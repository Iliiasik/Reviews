package auth

import (
	"fmt"
	"github.com/minio/minio-go/v7"
	"net/http"
	"os"
	"path/filepath"
	"reviews-back/error_types"
	"reviews-back/models"
	"reviews-back/storage"
	"reviews-back/utils/email"
	"reviews-back/validation"
	"strconv"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

func RegisterHandler(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		var req validation.RegisterRequest
		if !validation.BindAndValidate(c, &req) {
			return
		}

		if err := checkUniqueFields(db, req); err != nil {
			c.Error(err)
			return
		}

		hashedPassword, err := HashPassword(req.Password)
		if err != nil {
			c.Error(err)
			return
		}

		role, err := findRole(db, req.AccountType)
		if err != nil {
			c.Error(err)
			return
		}

		user := models.User{
			Name:         req.Name,
			Email:        req.Email,
			Phone:        req.Phone,
			Username:     req.Username,
			PasswordHash: hashedPassword,
			RoleID:       role.ID,
			CreatedAt:    time.Now(),
		}

		if err := db.Create(&user).Error; err != nil {
			c.Error(error_types.InternalServerError(err))
			return
		}

		if err := createProfile(db, req, role.Name, user.ID); err != nil {
			c.Error(err)
			return
		}

		confirmation, err := CreateConfirmation(db, user.ID)
		if err != nil {
			c.Error(err)
			return
		}

		go SendConfirmationEmail(user, confirmation.Token)

		c.JSON(http.StatusCreated, gin.H{
			"message": "Пользователь создан. Письмо с подтверждением отправлено",
			"user_id": user.ID,
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
		if err := db.Model(&models.User{}).Where("id = ?", userID).Update("avatar_url", avatarURL).Error; err != nil {
			c.Error(error_types.InternalServerError(err))
			return
		}

		c.JSON(http.StatusOK, gin.H{
			"message":    "Аватар успешно загружен",
			"avatar_url": avatarURL,
		})
	}
}

func checkUniqueFields(db *gorm.DB, req validation.RegisterRequest) *error_types.AppError {
	var count int64

	db.Model(&models.User{}).Where("email = ?", req.Email).Count(&count)
	if count > 0 {
		return error_types.CustomError(
			http.StatusBadRequest,
			error_types.CodeUniqueConstraint,
			"Email уже используется",
			nil,
		)
	}

	db.Model(&models.User{}).Where("username = ?", req.Username).Count(&count)
	if count > 0 {
		return error_types.CustomError(
			http.StatusBadRequest,
			error_types.CodeUniqueConstraint,
			"Имя пользователя уже занято",
			nil,
		)
	}

	if req.Phone != "" {
		db.Model(&models.User{}).Where("phone = ?", req.Phone).Count(&count)
		if count > 0 {
			return error_types.CustomError(
				http.StatusBadRequest,
				error_types.CodeUniqueConstraint,
				"Телефон уже используется",
				nil,
			)
		}
	}

	return nil
}

func findRole(db *gorm.DB, roleName string) (*models.Role, *error_types.AppError) {
	roleName = strings.ToLower(roleName)
	var role models.Role
	if err := db.Where("name = ?", roleName).First(&role).Error; err != nil {
		return nil, error_types.NotFoundError(error_types.CodeRoleNotFound, "Роль")
	}
	return &role, nil
}

func createProfile(db *gorm.DB, req validation.RegisterRequest, roleName string, userID uint) *error_types.AppError {
	switch strings.ToLower(roleName) {
	case "specialist":
		if err := db.Create(&models.SpecialistProfile{
			UserID:          userID,
			ExperienceYears: req.ExperienceYears,
			About:           req.About,
			CreatedAt:       time.Now(),
		}).Error; err != nil {
			return error_types.InternalServerError(err)
		}

	case "organization":
		if err := db.Create(&models.OrganizationProfile{
			UserID:    userID,
			Website:   req.Website,
			Address:   req.Address,
			About:     req.About,
			CreatedAt: time.Now(),
		}).Error; err != nil {
			return error_types.InternalServerError(err)
		}
	}

	return nil
}

func CreateConfirmation(db *gorm.DB, userID uint) (*models.Confirmation, *error_types.AppError) {
	token := uuid.NewString()
	confirmation := &models.Confirmation{
		UserID:         userID,
		EmailConfirmed: false,
		PhoneConfirmed: false,
		Token:          token,
	}
	err := db.Create(confirmation).Error
	if err != nil {
		return nil, error_types.InternalServerError(err)
	}
	return confirmation, nil
}

func SendConfirmationEmail(user models.User, token string) {
	link := fmt.Sprintf("http://localhost:5173/confirm-email?token=%s", token)
	err := email.SendEmail(email.EmailData{
		To:       user.Email,
		From:     os.Getenv("SMTP_USER"),
		Subject:  "Подтверждение Email",
		Template: "confirm_email",
		Variables: map[string]string{
			"Name":             user.Name,
			"ConfirmationLink": link,
		},
	})
	if err != nil {
		fmt.Println("Ошибка отправки письма:", err)
	}
}

func ConfirmEmailHandler(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		token := c.Query("token")
		if token == "" {
			c.Error(error_types.ValidationError(map[string]string{
				"token": "Токен обязателен",
			}))
			return
		}

		err := confirmEmailByToken(db, token)
		if err != nil {
			if err.ErrorCode == error_types.CodeEmailNotConfirmed {
				c.JSON(http.StatusOK, gin.H{"message": err.Message})
			} else {
				c.Error(err)
			}
			return
		}

		c.JSON(http.StatusOK, gin.H{"message": "Email подтверждён"})
	}
}

func confirmEmailByToken(db *gorm.DB, token string) *error_types.AppError {
	var confirmation models.Confirmation
	if err := db.Where("token = ?", token).First(&confirmation).Error; err != nil {
		return error_types.UnauthorizedError(error_types.CodeTokenInvalid, "Неверный токен")
	}

	if confirmation.EmailConfirmed {
		return error_types.CustomError(
			http.StatusOK,
			error_types.CodeEmailNotConfirmed,
			"Email уже подтверждён",
			nil,
		)
	}

	confirmation.EmailConfirmed = true
	if err := db.Save(&confirmation).Error; err != nil {
		return error_types.InternalServerError(err)
	}
	return nil
}

func ResendConfirmationHandler(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		var req struct {
			Username string `json:"username" binding:"required"`
		}

		if err := c.ShouldBindJSON(&req); err != nil {
			c.Error(error_types.ValidationError(map[string]string{
				"username": "Обязательное поле",
			}))
			return
		}

		var user models.User
		if err := db.Where("username = ?", req.Username).First(&user).Error; err != nil {
			c.Error(error_types.NotFoundError(error_types.CodeUserNotFound, "Пользователь"))
			return
		}

		db.Where("user_id = ?", user.ID).Delete(&models.Confirmation{})

		confirmation, err := CreateConfirmation(db, user.ID)
		if err != nil {
			c.Error(err)
			return
		}

		go SendConfirmationEmail(user, confirmation.Token)

		c.JSON(http.StatusOK, gin.H{"message": "Письмо с подтверждением отправлено"})
	}
}
