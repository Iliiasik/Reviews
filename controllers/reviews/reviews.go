package reviews

import (
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
	"net/http"
	"reviews-back/error_types"
	"reviews-back/models"
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

func CreateReview(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		var req CreateReviewRequest
		if err := c.ShouldBindJSON(&req); err != nil {
			appErr := error_types.ValidationError(err.Error())
			c.JSON(appErr.HttpStatusCode, appErr)
			return
		}

		var userID *uint
		if val, exists := c.Get("user_id"); exists {
			if id, ok := val.(uint); ok {
				userID = &id
			}
		}

		if userID != nil && *userID == req.ProfileUserID {
			appErr := error_types.ForbiddenError("Нельзя оставить отзыв самому себе")
			c.JSON(appErr.HttpStatusCode, appErr)
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
			appErr := error_types.InternalServerError(err)
			c.JSON(appErr.HttpStatusCode, appErr)
			return
		}

		if len(req.Pros) > 0 {
			var pros []models.ReviewAspect
			if err := db.Where("id IN ?", req.Pros).Find(&pros).Error; err != nil {
				appErr := error_types.InternalServerError(err)
				c.JSON(appErr.HttpStatusCode, appErr)
				return
			}
			if err := db.Model(&review).Association("Pros").Append(pros); err != nil {
				appErr := error_types.InternalServerError(err)
				c.JSON(appErr.HttpStatusCode, appErr)
				return
			}
		}

		if len(req.Cons) > 0 {
			var cons []models.ReviewAspect
			if err := db.Where("id IN ?", req.Cons).Find(&cons).Error; err != nil {
				appErr := error_types.InternalServerError(err)
				c.JSON(appErr.HttpStatusCode, appErr)
				return
			}
			if err := db.Model(&review).Association("Cons").Append(cons); err != nil {
				appErr := error_types.InternalServerError(err)
				c.JSON(appErr.HttpStatusCode, appErr)
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
			appErr := error_types.ValidationError("profile_user_id is required")
			c.JSON(appErr.HttpStatusCode, appErr)
			return
		}

		var reviews []models.Review
		if err := db.Preload("Author").
			Preload("Pros").
			Preload("Cons").
			Where("profile_user_id = ?", profileUserID).
			Order("created_at DESC").
			Find(&reviews).Error; err != nil {
			appErr := error_types.InternalServerError(err)
			c.JSON(appErr.HttpStatusCode, appErr)
			return
		}

		// Получаем текущего пользователя, если есть
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

			// Подсчёт количества лайков
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
			appErr := error_types.UnauthorizedError(error_types.CodeUnauthorized, "Требуется авторизация")
			c.JSON(appErr.HttpStatusCode, appErr)
			return
		}
		userID := val.(uint)

		var review models.Review
		if err := db.First(&review, reviewID).Error; err != nil {
			appErr := error_types.NotFoundError(error_types.CodeNotFound, "Отзыв")
			c.JSON(appErr.HttpStatusCode, appErr)
			return
		}

		var existing models.ReviewLike
		err := db.
			Where("review_id = ? AND user_id = ?", reviewID, userID).
			Order("created_at DESC").
			First(&existing).Error
		if err == nil {
			// Проверяем таймаут между лайками (5 секунд)
			if time.Since(existing.CreatedAt) < 5*time.Second {
				appErr := error_types.CustomError(
					http.StatusTooManyRequests,
					"TOO_MANY_REQUESTS",
					"Слишком частые запросы. Попробуйте через несколько секунд.",
					nil,
				)
				c.JSON(appErr.HttpStatusCode, appErr)
				return
			}

			appErr := error_types.CustomError(
				http.StatusBadRequest,
				"REVIEW_ALREADY_LIKED",
				"Вы уже отметили этот отзыв как полезный",
				nil,
			)
			c.JSON(appErr.HttpStatusCode, appErr)
			return
		}

		like := models.ReviewLike{
			UserID:    userID,
			ReviewID:  review.ID,
			CreatedAt: time.Now(),
		}
		if err := db.Create(&like).Error; err != nil {
			appErr := error_types.InternalServerError(err)
			c.JSON(appErr.HttpStatusCode, appErr)
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
			appErr := error_types.UnauthorizedError(error_types.CodeUnauthorized, "Требуется авторизация")
			c.JSON(appErr.HttpStatusCode, appErr)
			return
		}
		userID := val.(uint)

		if err := db.Where("review_id = ? AND user_id = ?", reviewID, userID).Delete(&models.ReviewLike{}).Error; err != nil {
			appErr := error_types.InternalServerError(err)
			c.JSON(appErr.HttpStatusCode, appErr)
			return
		}

		c.JSON(http.StatusOK, gin.H{"message": "Лайк удалён"})
	}
}
