package profile

import (
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
	"net/http"
	"reviews-back/error_types"
)

type OrganizationProfileResponse struct {
	ID          uint    `json:"id"`
	Name        string  `json:"name"`
	AvatarURL   string  `json:"avatar_url"`
	Rating      float64 `json:"rating"`
	Website     string  `json:"website"`
	Address     string  `json:"address"`
	About       string  `json:"about"`
	IsConfirmed bool    `json:"is_confirmed"`
}

func GetOrganizationProfile(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		id := c.Param("id")
		if id == "" {
			c.Error(error_types.ValidationError("id is required"))
			return
		}

		var result OrganizationProfileResponse
		err := db.Table("users").
			Select(`
				users.id,
				users.name,
				users.avatar_url,
				organization_profiles.rating,
				organization_profiles.website,
				organization_profiles.address,
				organization_profiles.about,
				organization_profiles.is_confirmed
			`).
			Joins("JOIN organization_profiles ON users.id = organization_profiles.user_id").
			Where("users.id = ?", id).
			Scan(&result).Error

		if err != nil {
			c.Error(error_types.InternalServerError(err).WithCode(error_types.CodeDatabaseError))
			return
		}

		if result.ID == 0 {
			c.Error(error_types.NotFoundError(error_types.CodeUserNotFound, "Организация"))
			return
		}

		c.JSON(http.StatusOK, result)
	}
}
