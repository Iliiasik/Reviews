package profile

import (
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
	"net/http"
	"reviews-back/error_types"
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
		if id == "" {
			c.Error(error_types.ValidationError("id parameter is required"))
			return
		}

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
			c.Error(error_types.InternalServerError(err).WithCode(error_types.CodeDatabaseError))
			return
		}

		if result.ID == 0 {
			c.Error(error_types.NotFoundError(error_types.CodeUserNotFound, "Specialist"))
			return
		}

		c.JSON(http.StatusOK, result)
	}
}
