package profile

import (
	"net/http"
	"reviews-back/database"
	"reviews-back/error_types"
	"reviews-back/models"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func GetUserReviews(c *gin.Context) {
	userID, exists := c.Get("user_id")
	if !exists {
		c.Error(error_types.UnauthorizedError(error_types.CodeUnauthorized, "Требуется авторизация"))
		return
	}

	userIDUint, ok := userID.(uint)
	if !ok {
		c.Error(error_types.InternalServerError(nil).WithMessage("Некорректный формат user_id"))
		return
	}

	var reviews []models.Review
	if err := database.DB.
		Preload("ProfileUser").
		Preload("ProfileUser.Role").
		Preload("Pros").
		Preload("Cons").
		Where("author_id = ?", userIDUint).
		Find(&reviews).Error; err != nil {
		c.Error(error_types.InternalServerError(err))
		return
	}

	var count int64
	if err := database.DB.
		Model(&models.Review{}).
		Where("author_id = ?", userIDUint).
		Count(&count).Error; err != nil {
		c.Error(error_types.InternalServerError(err))
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"data":               reviews,
		"user_reviews_count": count,
	})
}

type ReviewSummaryResponse struct {
	TotalReviews int64   `json:"total_reviews"`
	Rating       float64 `json:"rating"`
}

func GetUserReviewsSummary(c *gin.Context) {
	userID := c.Param("id")

	var user models.User
	if err := database.DB.Preload("Role").First(&user, userID).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			c.Error(error_types.NotFoundError(error_types.CodeUserNotFound, "Пользователь"))
			return
		}
		c.Error(error_types.InternalServerError(err))
		return
	}

	var count int64
	if err := database.DB.Model(&models.Review{}).
		Where("profile_user_id = ?", userID).
		Count(&count).Error; err != nil {
		c.Error(error_types.InternalServerError(err))
		return
	}

	var rating float64
	switch user.Role.Name {
	case "specialist":
		var profile models.SpecialistProfile
		if err := database.DB.Select("rating").Where("user_id = ?", userID).First(&profile).Error; err != nil {
			c.Error(error_types.NotFoundError(error_types.CodeNotFound, "Профиль специалиста"))
			return
		}
		rating = profile.Rating

	case "organization":
		var profile models.OrganizationProfile
		if err := database.DB.Select("rating").Where("user_id = ?", userID).First(&profile).Error; err != nil {
			c.Error(error_types.NotFoundError(error_types.CodeNotFound, "Профиль организации"))
			return
		}
		rating = profile.Rating
	}

	c.JSON(http.StatusOK, gin.H{
		"data": ReviewSummaryResponse{
			TotalReviews: count,
			Rating:       rating,
		},
	})
}
