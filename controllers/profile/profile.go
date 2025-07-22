package profile

import (
	"errors"
	"fmt"
	"github.com/minio/minio-go/v7"
	"net/http"
	"path/filepath"
	"reviews-back/controllers/auth"
	"reviews-back/error_types"
	"reviews-back/models"
	"reviews-back/storage"
	"reviews-back/validation"
	"strconv"
	"strings"

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
			"id":         user.ID,
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

func deleteAvatar(c *gin.Context, db *gorm.DB, userID int, userType string) error {
	var user models.User
	if err := db.Where("id = ?", userID).First(&user).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return error_types.NotFoundError(error_types.CodeUserNotFound, "Пользователь")
		}
		return error_types.InternalServerError(err)
	}

	if user.AvatarURL == "" {
		return error_types.CustomError(
			http.StatusBadRequest,
			error_types.CodeNotFound,
			"Аватар пользователя не найден",
			nil,
		)
	}

	ext := filepath.Ext(user.AvatarURL)
	objectName := fmt.Sprintf("%s/%d/avatar%s", userType, userID, ext)

	if err := storage.MinioClient.RemoveObject(
		c.Request.Context(),
		storage.BucketName,
		objectName,
		minio.RemoveObjectOptions{},
	); err != nil {
		return error_types.CustomError(
			http.StatusInternalServerError,
			error_types.CodeFileUploadError,
			"Ошибка удаления аватара из хранилища",
			nil,
		)
	}

	if err := db.Model(&user).Update("avatar_url", "").Error; err != nil {
		return error_types.InternalServerError(err)
	}

	return nil
}

func DeleteAvatarHandler(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		userID, err := strconv.Atoi(c.Param("user_id"))
		if err != nil {
			c.Error(error_types.CustomError(
				http.StatusBadRequest,
				error_types.CodeValidationError,
				"Некорректный ID пользователя",
				nil,
			))
			return
		}

		accountType := c.Query("account_type")
		if accountType == "" {
			c.Error(error_types.CustomError(
				http.StatusBadRequest,
				error_types.CodeValidationError,
				"Не указан тип аккаунта",
				nil,
			))
			return
		}

		userType := storage.UserTypeUser
		switch accountType {
		case "specialist":
			userType = storage.UserTypeSpecialist
		case "organization":
			userType = storage.UserTypeOrganization
		}

		if err := deleteAvatar(c, db, userID, string(userType)); err != nil {
			c.Error(err)
			return
		}

		c.JSON(http.StatusOK, gin.H{
			"message": "Аватар успешно удален",
		})
	}
}

func UploadAvatarHandler(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		userID, err := strconv.Atoi(c.Param("user_id"))
		if err != nil {
			c.Error(error_types.CustomError(
				http.StatusBadRequest,
				error_types.CodeValidationError,
				"Некорректный ID пользователя",
				nil,
			))
			return
		}

		accountType := c.Query("account_type")
		if accountType == "" {
			c.Error(error_types.CustomError(
				http.StatusBadRequest,
				error_types.CodeValidationError,
				"Не указан тип аккаунта",
				nil,
			))
			return
		}

		userType := storage.UserTypeUser
		switch accountType {
		case "specialist":
			userType = storage.UserTypeSpecialist
		case "organization":
			userType = storage.UserTypeOrganization
		}

		var user models.User
		if err := db.Where("id = ?", userID).First(&user).Error; err != nil {
			if errors.Is(err, gorm.ErrRecordNotFound) {
				c.Error(error_types.NotFoundError(error_types.CodeUserNotFound, "Пользователь"))
				return
			}
			c.Error(error_types.InternalServerError(err))
			return
		}

		if user.AvatarURL != "" {
			if err := deleteAvatar(c, db, userID, string(userType)); err != nil {
				c.Error(err)
				return
			}
		}

		file, header, err := c.Request.FormFile("avatar")
		if err != nil {
			c.Error(error_types.CustomError(
				http.StatusBadRequest,
				error_types.CodeFileUploadError,
				"Ошибка получения файла аватара",
				nil,
			))
			return
		}
		defer file.Close()

		ext := strings.ToLower(filepath.Ext(header.Filename))
		if ext != ".jpg" && ext != ".jpeg" && ext != ".png" {
			c.Error(error_types.CustomError(
				http.StatusBadRequest,
				error_types.CodeUnsupportedImageFormat,
				"Неподдерживаемый формат изображения",
				nil,
			))
			return
		}

		objectName := fmt.Sprintf("%s/%d/avatar%s", userType, userID, ext)
		_, err = storage.MinioClient.PutObject(
			c.Request.Context(),
			storage.BucketName,
			objectName,
			file,
			header.Size,
			minio.PutObjectOptions{ContentType: header.Header.Get("Content-Type")},
		)
		if err != nil {
			c.Error(error_types.CustomError(
				http.StatusInternalServerError,
				error_types.CodeFileUploadError,
				"Ошибка загрузки аватара в хранилище",
				nil,
			))
			return
		}

		avatarURL := storage.GetAvatarURL(userType, uint(userID), ext)
		if err := db.Model(&user).Update("avatar_url", avatarURL).Error; err != nil {
			c.Error(error_types.InternalServerError(err))
			return
		}

		c.JSON(http.StatusOK, gin.H{
			"message":    "Аватар успешно загружен",
			"avatar_url": avatarURL,
		})
	}
}
