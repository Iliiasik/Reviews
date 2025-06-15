package controllers

import (
	"fmt"
	"net/http"
	"os"
	"reviews-back/models"
	"reviews-back/utils/email"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

type RegisterRequest struct {
	Name        string `json:"name" binding:"required"`
	Email       string `json:"email" binding:"required,email"`
	Phone       string `json:"phone"`
	Username    string `json:"username" binding:"required"`
	Password    string `json:"password" binding:"required"`
	AccountType string `json:"account_type" binding:"required"` // user | specialist | organization

	// specialist
	ExperienceYears *int   `json:"experience_years"`
	About           string `json:"about"`

	// organization
	Website string `json:"website"`
	Address string `json:"address"`
}

func RegisterHandler(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		var req RegisterRequest
		if err := c.ShouldBindJSON(&req); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		hashedPassword, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Ошибка хеширования пароля"})
			return
		}

		roleName := strings.ToLower(req.AccountType)
		var role models.Role
		if err := db.Where("name = ?", roleName).First(&role).Error; err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Роль не найдена"})
			return
		}

		user := models.User{
			Name:         req.Name,
			Email:        req.Email,
			Phone:        req.Phone,
			Username:     req.Username,
			PasswordHash: string(hashedPassword),
			RoleID:       role.ID,
			CreatedAt:    time.Now(),
		}

		if err := db.Create(&user).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Не удалось создать пользователя"})
			return
		}

		// профили
		switch roleName {
		case "specialist":
			if req.ExperienceYears == nil {
				c.JSON(http.StatusBadRequest, gin.H{"error": "Поле experience_years обязательно для специалиста"})
				return
			}
			db.Create(&models.SpecialistProfile{
				UserID:          user.ID,
				ExperienceYears: *req.ExperienceYears,
				About:           req.About,
				CreatedAt:       time.Now(),
			})
		case "organization":
			db.Create(&models.OrganizationProfile{
				UserID:    user.ID,
				Website:   req.Website,
				Address:   req.Address,
				About:     req.About,
				CreatedAt: time.Now(),
			})
		}

		// подтверждение
		token := uuid.NewString()
		db.Create(&models.Confirmation{
			UserID:         user.ID,
			EmailConfirmed: false,
			PhoneConfirmed: false,
			Token:          token,
		})

		// отправка письма
		link := fmt.Sprintf("http://localhost:5173/confirm-email?token=%s", token)
		err = email.SendEmail(email.EmailData{
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

		c.JSON(http.StatusCreated, gin.H{"message": "Письмо с подтверждением отправлено"})
	}
}
func ConfirmEmailHandler(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		token := c.Query("token")
		var confirmation models.Confirmation

		if err := db.Where("token = ?", token).First(&confirmation).Error; err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Неверный токен"})
			return
		}

		confirmation.EmailConfirmed = true
		db.Save(&confirmation)

		c.JSON(http.StatusOK, gin.H{"message": "Email подтверждён"})
	}
}
