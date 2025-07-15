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

type AspectCount struct {
	ID          uint   `json:"id"`
	Description string `json:"description"`
	Count       int64  `json:"count"`
}

func GetUserReviewsSummary(c *gin.Context) {
	userID := c.Param("id")

	var user models.User
	if err := database.DB.Preload("Role").First(&user, userID).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			c.Error(error_types.UnauthorizedError(error_types.CodeUnauthorized, "Требуется авторизация"))
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

	var prosCount []AspectCount
	if err := database.DB.Table("review_aspects").
		Select("review_aspects.id, review_aspects.description, COUNT(review_pros.aspect_id) as count").
		Joins("JOIN review_pros ON review_aspects.id = review_pros.aspect_id").
		Joins("JOIN reviews ON review_pros.review_id = reviews.id").
		Where("reviews.profile_user_id = ? AND review_aspects.positive = true", userID).
		Group("review_aspects.id, review_aspects.description").
		Scan(&prosCount).Error; err != nil {
		c.Error(error_types.InternalServerError(err))
		return
	}

	var consCount []AspectCount
	if err := database.DB.Table("review_aspects").
		Select("review_aspects.id, review_aspects.description, COUNT(review_cons.aspect_id) as count").
		Joins("JOIN review_cons ON review_aspects.id = review_cons.aspect_id").
		Joins("JOIN reviews ON review_cons.review_id = reviews.id").
		Where("reviews.profile_user_id = ? AND review_aspects.positive = false", userID).
		Group("review_aspects.id, review_aspects.description").
		Scan(&consCount).Error; err != nil {
		c.Error(error_types.InternalServerError(err))
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"data": gin.H{
			"total_reviews": count,
			"rating":        rating,
			"pros_count":    prosCount,
			"cons_count":    consCount,
			"total_pros":    sumCounts(prosCount),
			"total_cons":    sumCounts(consCount),
		},
	})
}

func sumCounts(aspects []AspectCount) int64 {
	var total int64
	for _, a := range aspects {
		total += a.Count
	}
	return total
}
