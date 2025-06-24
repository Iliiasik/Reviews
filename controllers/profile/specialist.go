package profile

import (
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
	"net/http"
)

type SpecialistProfileResponse struct {
	ID              uint    `json:"id"`
	Name            string  `json:"name"`
	AvatarURL       string  `json:"avatar_url"`
	Rating          float64 `json:"rating"`
	About           string  `json:"about"`
	ExperienceYears int     `json:"experience_years"`
	IsConfirmed     bool    `json:"is_confirmed"`
}

func GetSpecialistProfile(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		id := c.Param("id")
		var result SpecialistProfileResponse

		err := db.Table("users").
			Select(`
				users.id,
				users.name,
				users.avatar_url,
				specialist_profiles.rating,
				specialist_profiles.about,
				specialist_profiles.experience_years,
				specialist_profiles.is_confirmed
			`).
			Joins("JOIN specialist_profiles ON users.id = specialist_profiles.user_id").
			Where("users.id = ?", id).
			Scan(&result).Error

		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "server error"})
			return
		}

		if result.ID == 0 {
			c.JSON(http.StatusNotFound, gin.H{"error": "not found"})
			return
		}

		c.JSON(http.StatusOK, result)
	}
}
