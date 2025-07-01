package profile

import (
	"net/http"
	"reviews-back/errors"
	"reviews-back/models"
	"reviews-back/validation"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func GetProfileHandler(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		userIDVal, exists := c.Get("user_id")
		if !exists {
			c.JSON(http.StatusUnauthorized, errors.UnauthorizedError(errors.CodeUnauthorized, "Нет доступа: отсутствует user_id в контексте"))
			return
		}

		userID, ok := userIDVal.(uint)
		if !ok {
			c.JSON(http.StatusInternalServerError, errors.InternalServerError(nil).
				WithCode(errors.CodeInternalServerError).
				WithDetails("Неверный тип user_id"))
			return
		}

		var user models.User
		if err := db.Preload("Role").First(&user, userID).Error; err != nil {
			if err == gorm.ErrRecordNotFound {
				c.JSON(http.StatusNotFound, errors.NotFoundError(errors.CodeUserNotFound, "Пользователь"))
				return
			}
			c.JSON(http.StatusInternalServerError, errors.InternalServerError(err))
			return
		}

		profile := gin.H{
			"name":       user.Name,
			"email":      user.Email,
			"username":   user.Username,
			"phone":      user.Phone,
			"avatar_url": user.AvatarURL,
			"role":       user.Role.Name,
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
		userIDVal, exists := c.Get("user_id")
		if !exists {
			c.JSON(http.StatusUnauthorized, errors.UnauthorizedError(errors.CodeUnauthorized, "Нет доступа: отсутствует user_id в контексте"))
			return
		}

		userID, ok := userIDVal.(uint)
		if !ok {
			c.JSON(http.StatusInternalServerError, errors.InternalServerError(nil).
				WithCode(errors.CodeInternalServerError).
				WithDetails("Неверный тип user_id"))
			return
		}

		var user models.User
		if err := db.Preload("Role").First(&user, userID).Error; err != nil {
			if err == gorm.ErrRecordNotFound {
				c.JSON(http.StatusNotFound, errors.NotFoundError(errors.CodeUserNotFound, "Пользователь"))
				return
			}
			c.JSON(http.StatusInternalServerError, errors.InternalServerError(err))
			return
		}

		var req validation.UpdateProfileRequest
		if !validation.BindAndValidate(c, &req) {
			return
		}

		if req.Email != user.Email {
			var existingUser models.User
			if err := db.Where("email = ?", req.Email).First(&existingUser).Error; err == nil {
				c.JSON(http.StatusBadRequest, errors.ValidationError(map[string]string{
					"email": "Этот email уже используется другим пользователем",
				}))
				return
			}
		}

		user.Name = req.Name
		user.Email = req.Email
		user.Phone = req.Phone
		if err := db.Save(&user).Error; err != nil {
			c.JSON(http.StatusInternalServerError, errors.InternalServerError(err))
			return
		}

		switch user.Role.Name {
		case "specialist":
			var sp models.SpecialistProfile
			db.FirstOrCreate(&sp, models.SpecialistProfile{UserID: user.ID})
			sp.About = req.About
			if req.ExperienceYears != nil {
				sp.ExperienceYears = *req.ExperienceYears
			}
			if err := db.Save(&sp).Error; err != nil {
				c.JSON(http.StatusInternalServerError, errors.InternalServerError(err))
				return
			}
		case "organization":
			var org models.OrganizationProfile
			db.FirstOrCreate(&org, models.OrganizationProfile{UserID: user.ID})
			org.About = req.About
			org.Website = req.Website
			org.Address = req.Address
			if err := db.Save(&org).Error; err != nil {
				c.JSON(http.StatusInternalServerError, errors.InternalServerError(err))
				return
			}
		}

		c.JSON(http.StatusOK, gin.H{"message": "Профиль успешно обновлён"})
	}
}
