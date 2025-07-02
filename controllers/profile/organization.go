package profile

import (
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
	"net/http"
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
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Ошибка сервера"})
			return
		}

		if result.ID == 0 {
			c.JSON(http.StatusNotFound, gin.H{"error": "Организация не найдена"})
			return
		}

		c.JSON(http.StatusOK, result)
	}
}
