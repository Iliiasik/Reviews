package reviews

import (
	"fmt"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
	"net/http"
	"reviews-back/models"
	"time"
)

type CreateReviewRequest struct {
	ProfileUserID uint   `json:"profile_user_id" binding:"required"`
	Rating        int    `json:"rating" binding:"required,min=1,max=5"`
	Text          string `json:"text" binding:"required"`
	IsAnonymous   bool   `json:"is_anonymous"`
	Pros          []uint `json:"pros"` // ID аспектов
	Cons          []uint `json:"cons"` // ID аспектов
}

func CreateReview(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		var req CreateReviewRequest
		if err := c.ShouldBindJSON(&req); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		// вместо user := c.Get("user")
		var userID *uint
		if val, exists := c.Get("user_id"); exists {
			if id, ok := val.(uint); ok {
				userID = &id
			}
		}

		// 🔍 Добавь лог перед использованием userID
		fmt.Println("Middleware user:", userID)
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

		// создаём запись
		if err := db.Create(&review).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "could not create review"})
			return
		}

		// добавляем аспекты (pros/cons)
		if len(req.Pros) > 0 {
			var pros []models.ReviewAspect
			if err := db.Where("id IN ?", req.Pros).Find(&pros).Error; err == nil {
				if err := db.Model(&review).Association("Pros").Append(pros); err != nil {
					c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to add pros"})
					return
				}
			}
		}
		if len(req.Cons) > 0 {
			var cons []models.ReviewAspect
			if err := db.Where("id IN ?", req.Cons).Find(&cons).Error; err == nil {
				if err := db.Model(&review).Association("Cons").Append(cons); err != nil {
					c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to add cons"})
					return
				}
			}
		}

		c.JSON(http.StatusCreated, review)
	}
}
func GetReviews(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		profileUserID := c.Query("profile_user_id")
		if profileUserID == "" {
			c.JSON(http.StatusBadRequest, gin.H{"error": "profile_user_id is required"})
			return
		}

		var reviews []models.Review
		if err := db.Preload("Author").
			Preload("Pros").
			Preload("Cons").
			Where("profile_user_id = ?", profileUserID).
			Order("created_at DESC").
			Find(&reviews).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to fetch reviews"})
			return
		}

		// формируем ответ с учётом анонимности
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
