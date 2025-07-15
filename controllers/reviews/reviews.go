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

			response = append(response, gin.H{
				"id":         r.ID,
				"text":       r.Text,
				"rating":     r.Rating,
				"created_at": r.CreatedAt,
				"author":     author,
				"pros":       r.Pros,
				"cons":       r.Cons,
			})
		}

		c.JSON(http.StatusOK, response)
	}
}
