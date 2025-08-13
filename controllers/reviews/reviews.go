package reviews

import (
	"github.com/gin-gonic/gin"
	"github.com/hibiken/asynq"
	"gorm.io/gorm"
	"log"
	"net/http"
	"reviews-back/error_types"
	"reviews-back/models"
	"reviews-back/tasks"
	"time"
)

type CreateReviewRequest struct {
	ProfileUserID uint   `json:"profile_user_id" binding:"required"`
	Rating        int    `json:"rating" binding:"required,min=1,max=5"`
	Text          string `json:"text" binding:"required"`
	IsAnonymous   bool   `json:"is_anonymous"`
	Pros          []uint `json:"pros"`
	Cons          []uint `json:"cons"`
}

func CreateReview(db *gorm.DB, asynqClient *asynq.Client) gin.HandlerFunc {
	return func(c *gin.Context) {
		var req CreateReviewRequest
		if err := c.ShouldBindJSON(&req); err != nil {
			c.Error(error_types.ValidationError(err.Error()))
			return
		}

		var userID *uint
		if val, exists := c.Get("user_id"); exists {
			if id, ok := val.(uint); ok {
				userID = &id
			}
		}

		if userID != nil && *userID == req.ProfileUserID {
			c.Error(error_types.ForbiddenError("Нельзя оставить отзыв самому себе"))
			return
		}

		isAnonymous := req.IsAnonymous
		if userID == nil {
			isAnonymous = true
		}

		review := models.Review{
			AuthorID:      userID,
			ProfileUserID: req.ProfileUserID,
			Rating:        req.Rating,
			Text:          req.Text,
			IsAnonymous:   isAnonymous,
			CreatedAt:     time.Now(),
			UpdatedAt:     time.Now(),
		}

		if err := db.Create(&review).Error; err != nil {
			c.Error(error_types.InternalServerError(err).WithCode(error_types.CodeDatabaseError))
			return
		}

		if asynqClient != nil {
			if err := tasks.EnqueueRatingUpdateTask(asynqClient, req.ProfileUserID); err != nil {
				log.Printf("Ошибка постановки задачи в очередь: %v", err)
			}
		} else {
			log.Printf("Asynq клиент не инициализирован — задача на пересчёт рейтинга не поставлена")
		}

		if len(req.Pros) > 0 {
			var pros []models.ReviewAspect
			if err := db.Where("id IN ?", req.Pros).Find(&pros).Error; err != nil {
				c.Error(error_types.InternalServerError(err).WithCode(error_types.CodeDatabaseError))
				return
			}
			if err := db.Model(&review).Association("Pros").Append(pros); err != nil {
				c.Error(error_types.InternalServerError(err).WithCode(error_types.CodeDatabaseError))
				return
			}
		}

		if len(req.Cons) > 0 {
			var cons []models.ReviewAspect
			if err := db.Where("id IN ?", req.Cons).Find(&cons).Error; err != nil {
				c.Error(error_types.InternalServerError(err).WithCode(error_types.CodeDatabaseError))
				return
			}
			if err := db.Model(&review).Association("Cons").Append(cons); err != nil {
				c.Error(error_types.InternalServerError(err).WithCode(error_types.CodeDatabaseError))
				return
			}
		}

		c.JSON(http.StatusCreated, review)
	}
}

func GetReviews(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		profileUserID := c.Query("profile_user_id")
		if profileUserID == "" {
			c.Error(error_types.ValidationError("profile_user_id is required"))
			return
		}

		var reviews []models.Review
		if err := db.Preload("Author").
			Preload("Pros").
			Preload("Cons").
			Where("profile_user_id = ?", profileUserID).
			Order("created_at DESC").
			Find(&reviews).Error; err != nil {
			c.Error(error_types.InternalServerError(err).WithCode(error_types.CodeDatabaseError))
			return
		}

		var currentUserID *uint
		if val, exists := c.Get("user_id"); exists {
			if id, ok := val.(uint); ok {
				currentUserID = &id
			}
		}

		response := make([]gin.H, 0, len(reviews))
		for _, r := range reviews {
			var author interface{}
			if !r.IsAnonymous && r.Author != nil {
				author = gin.H{
					"id":         r.Author.ID,
					"name":       r.Author.Name,
					"avatar_url": r.Author.AvatarURL,
				}
			}

			var likeCount int64
			db.Model(&models.ReviewLike{}).
				Where("review_id = ?", r.ID).
				Count(&likeCount)

			userHasLiked := false
			if currentUserID != nil {
				var count int64
				db.Model(&models.ReviewLike{}).
					Where("review_id = ? AND user_id = ?", r.ID, *currentUserID).
					Count(&count)
				userHasLiked = count > 0
			}

			response = append(response, gin.H{
				"id":             r.ID,
				"text":           r.Text,
				"rating":         r.Rating,
				"created_at":     r.CreatedAt,
				"author":         author,
				"pros":           r.Pros,
				"cons":           r.Cons,
				"useful_count":   likeCount,
				"user_has_liked": userHasLiked,
			})
		}

		c.JSON(http.StatusOK, response)
	}
}

func LikeReview(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		reviewID := c.Param("id")

		val, exists := c.Get("user_id")
		if !exists {
			c.Error(error_types.UnauthorizedError(error_types.CodeUnauthorized, "Требуется авторизация"))
			return
		}
		userID := val.(uint)

		var review models.Review
		if err := db.First(&review, reviewID).Error; err != nil {
			c.Error(error_types.NotFoundError(error_types.CodeNotFound, "Отзыв"))
			return
		}

		var existing models.ReviewLike
		err := db.
			Where("review_id = ? AND user_id = ?", reviewID, userID).
			Order("created_at DESC").
			First(&existing).Error
		if err == nil {
			if time.Since(existing.CreatedAt) < 5*time.Second {
				c.Error(error_types.CustomError(
					http.StatusTooManyRequests,
					error_types.CodeTooManyRequests,
					"Слишком частые запросы. Попробуйте через несколько секунд.",
					nil,
				))
				return
			}

			c.Error(error_types.CustomError(
				http.StatusBadRequest,
				error_types.CodeReviewAlreadyLiked,
				"Вы уже отметили этот отзыв как полезный",
				nil,
			))
			return
		}

		like := models.ReviewLike{
			UserID:    userID,
			ReviewID:  review.ID,
			CreatedAt: time.Now(),
		}
		if err := db.Create(&like).Error; err != nil {
			c.Error(error_types.InternalServerError(err).WithCode(error_types.CodeDatabaseError))
			return
		}

		c.JSON(http.StatusCreated, gin.H{"message": "Отметка добавлена"})
	}
}

func UnlikeReview(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		reviewID := c.Param("id")

		val, exists := c.Get("user_id")
		if !exists {
			c.Error(error_types.UnauthorizedError(error_types.CodeUnauthorized, "Требуется авторизация"))
			return
		}
		userID := val.(uint)

		if err := db.Where("review_id = ? AND user_id = ?", reviewID, userID).Delete(&models.ReviewLike{}).Error; err != nil {
			c.Error(error_types.InternalServerError(err).WithCode(error_types.CodeDatabaseError))
			return
		}

		c.JSON(http.StatusOK, gin.H{"message": "Лайк удалён"})
	}
}
