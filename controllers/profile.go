package controllers

import (
	"net/http"
	"reviews-back/models"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func GetProfileHandler(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		token, err := c.Cookie("token")
		if err != nil {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Нет доступа: отсутствует токен"})
			return
		}

		claims, err := ValidateJWT(token)
		if err != nil {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Невалидный токен"})
			return
		}

		var user models.User
		if err := db.Preload("Role").First(&user, claims.UserID).Error; err != nil {
			c.JSON(http.StatusNotFound, gin.H{"error": "Пользователь не найден"})
			return
		}

		profile := gin.H{
			"name":     user.Name,
			"email":    user.Email,
			"username": user.Username,
			"role":     user.Role.Name,
		}

		switch user.Role.Name {
		case "specialist":
			var sp models.SpecialistProfile
			if err := db.First(&sp, "user_id = ?", user.ID).Error; err == nil {
				profile["experience_years"] = sp.ExperienceYears
				profile["about"] = sp.About
			}
		case "organization":
			var org models.OrganizationProfile
			if err := db.First(&org, "user_id = ?", user.ID).Error; err == nil {
				profile["website"] = org.Website
				profile["address"] = org.Address
				profile["about"] = org.About
			}
		}

		c.JSON(http.StatusOK, profile)
	}
}
func UpdateProfileHandler(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		token, err := c.Cookie("token")
		if err != nil {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Нет доступа: отсутствует токен"})
			return
		}

		claims, err := ValidateJWT(token)
		if err != nil {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Невалидный токен"})
			return
		}

		var user models.User
		if err := db.First(&user, claims.UserID).Error; err != nil {
			c.JSON(http.StatusNotFound, gin.H{"error": "Пользователь не найден"})
			return
		}

		// Общие поля
		var req struct {
			Name            string `json:"name"`
			Email           string `json:"email"`
			Phone           string `json:"phone"`
			About           string `json:"about"`
			Website         string `json:"website"`
			Address         string `json:"address"`
			ExperienceYears *int   `json:"experience_years"`
		}
		if err := c.ShouldBindJSON(&req); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Неверный формат запроса"})
			return
		}

		user.Name = req.Name
		user.Email = req.Email
		user.Phone = req.Phone
		db.Save(&user)

		role := user.Role.Name
		switch role {
		case "specialist":
			var sp models.SpecialistProfile
			db.FirstOrCreate(&sp, models.SpecialistProfile{UserID: user.ID})
			sp.About = req.About
			if req.ExperienceYears != nil {
				sp.ExperienceYears = *req.ExperienceYears
			}
			db.Save(&sp)
		case "organization":
			var org models.OrganizationProfile
			db.FirstOrCreate(&org, models.OrganizationProfile{UserID: user.ID})
			org.About = req.About
			org.Website = req.Website
			org.Address = req.Address
			db.Save(&org)
		}

		c.JSON(http.StatusOK, gin.H{"message": "Профиль успешно обновлён"})
	}
}
