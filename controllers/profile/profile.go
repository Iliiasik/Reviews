package profile

import (
	"net/http"
	"reviews-back/controllers/auth"
	"reviews-back/error_types"
	"reviews-back/models"
	"reviews-back/validation"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func GetProfileHandler(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		userIDVal, exists := c.Get("user_id")
		if !exists {
			c.JSON(http.StatusUnauthorized, error_types.UnauthorizedError(error_types.CodeUnauthorized, "Нет доступа: отсутствует user_id в контексте"))
			return
		}

		userID, ok := userIDVal.(uint)
		if !ok {
			c.JSON(http.StatusInternalServerError, error_types.InternalServerError(nil).
				WithCode(error_types.CodeInternalServerError).
				WithDetails("Неверный тип user_id"))
			return
		}

		var user models.User
		if err := db.Preload("Role").First(&user, userID).Error; err != nil {
			if err == gorm.ErrRecordNotFound {
				c.JSON(http.StatusNotFound, error_types.NotFoundError(error_types.CodeUserNotFound, "Пользователь"))
				return
			}
			c.JSON(http.StatusInternalServerError, error_types.InternalServerError(err))
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
				profile["is_confirmed"] = sp.IsConfirmed
			}
		case "organization":
			var org models.OrganizationProfile
			if err := db.First(&org, "user_id = ?", user.ID).Error; err == nil {
				profile["website"] = org.Website
				profile["address"] = org.Address
				profile["about"] = org.About
				profile["is_confirmed"] = org.IsConfirmed
			}
		}

		c.JSON(http.StatusOK, profile)
	}
}

func UpdateProfileHandler(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		userIDVal, exists := c.Get("user_id")
		if !exists {
			c.JSON(http.StatusUnauthorized, error_types.UnauthorizedError(error_types.CodeUnauthorized, "Нет доступа: отсутствует user_id в контексте"))
			return
		}

		userID, ok := userIDVal.(uint)
		if !ok {
			c.JSON(http.StatusInternalServerError, error_types.InternalServerError(nil).
				WithCode(error_types.CodeInternalServerError).
				WithDetails("Неверный тип user_id"))
			return
		}

		var user models.User
		if err := db.Preload("Role").First(&user, userID).Error; err != nil {
			if err == gorm.ErrRecordNotFound {
				c.JSON(http.StatusNotFound, error_types.NotFoundError(error_types.CodeUserNotFound, "Пользователь"))
				return
			}
			c.JSON(http.StatusInternalServerError, error_types.InternalServerError(err))
			return
		}

		var req validation.UpdateProfileRequest
		if !validation.BindAndValidate(c, &req) {
			return
		}

		emailChanged := req.Email != user.Email

		if emailChanged {
			var existingUser models.User
			if err := db.Where("email = ?", req.Email).First(&existingUser).Error; err == nil {
				c.JSON(http.StatusBadRequest, error_types.ValidationError(map[string]string{
					"email": "Этот email уже используется другим пользователем",
				}))
				return
			}
		}

		user.Name = req.Name
		user.Phone = req.Phone

		if emailChanged {
			user.Email = req.Email

			if err := db.Where("user_id = ?", user.ID).Delete(&models.Confirmation{}).Error; err != nil {
				c.JSON(http.StatusInternalServerError, error_types.InternalServerError(err))
				return
			}

			confirmation, err := auth.CreateConfirmation(db, user.ID)
			if err != nil {
				c.JSON(http.StatusInternalServerError, err)
				return
			}

			go auth.SendConfirmationEmail(user, confirmation.Token)
		}

		if err := db.Save(&user).Error; err != nil {
			c.JSON(http.StatusInternalServerError, error_types.InternalServerError(err))
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
				c.JSON(http.StatusInternalServerError, error_types.InternalServerError(err))
				return
			}
		case "organization":
			var org models.OrganizationProfile
			db.FirstOrCreate(&org, models.OrganizationProfile{UserID: user.ID})
			org.About = req.About
			org.Website = req.Website
			org.Address = req.Address
			if err := db.Save(&org).Error; err != nil {
				c.JSON(http.StatusInternalServerError, error_types.InternalServerError(err))
				return
			}
		}

		response := gin.H{
			"message": "Профиль успешно обновлён",
		}

		if emailChanged {
			response["email_changed"] = true
			response["requires_logout"] = true
		}

		c.JSON(http.StatusOK, response)
	}
}
