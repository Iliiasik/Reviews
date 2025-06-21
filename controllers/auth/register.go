package auth

import (
	"fmt"
	"net/http"
	"os"
	"regexp"
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
	AccountType string `json:"account_type" binding:"required"`

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

		if err := validatePassword(req.Password); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		if err := checkUniqueFields(db, req); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		hashedPassword, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Ошибка хеширования пароля"})
			return
		}

		role, err := findRole(db, req.AccountType)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		// Транзакция для создания пользователя, профиля и подтверждения
		err = db.Transaction(func(tx *gorm.DB) error {
			user := models.User{
				Name:         req.Name,
				Email:        req.Email,
				Phone:        req.Phone,
				Username:     req.Username,
				PasswordHash: string(hashedPassword),
				RoleID:       role.ID,
				CreatedAt:    time.Now(),
			}
			if err := tx.Create(&user).Error; err != nil {
				return err
			}

			if err := createProfile(tx, req, role.Name, user.ID); err != nil {
				return err
			}

			confirmation, err := createConfirmation(tx, user.ID)
			if err != nil {
				return err
			}

			// Отправка письма вне транзакции, чтобы не блокировать
			go sendConfirmationEmail(user, confirmation.Token)

			return nil
		})

		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Не удалось зарегистрировать пользователя: " + err.Error()})
			return
		}

		c.JSON(http.StatusCreated, gin.H{"message": "Пользователь создан. Письмо с подтверждением отправлено"})
	}
}

func validatePassword(password string) error {
	if len(password) < 8 {
		return fmt.Errorf("Пароль должен содержать минимум 8 символов")
	}
	if !regexp.MustCompile(`[0-9]`).MatchString(password) || !regexp.MustCompile(`[a-zA-Z]`).MatchString(password) {
		return fmt.Errorf("Пароль должен содержать хотя бы одну цифру и один символ")
	}
	return nil
}

func checkUniqueFields(db *gorm.DB, req RegisterRequest) error {
	var count int64

	db.Model(&models.User{}).Where("email = ?", req.Email).Count(&count)
	if count > 0 {
		return fmt.Errorf("Email уже используется")
	}

	db.Model(&models.User{}).Where("username = ?", req.Username).Count(&count)
	if count > 0 {
		return fmt.Errorf("Имя пользователя уже занято")
	}

	if req.Phone != "" {
		db.Model(&models.User{}).Where("phone = ?", req.Phone).Count(&count)
		if count > 0 {
			return fmt.Errorf("Телефон уже используется")
		}
	}

	return nil
}

func findRole(db *gorm.DB, roleName string) (*models.Role, error) {
	roleName = strings.ToLower(roleName)
	var role models.Role
	if err := db.Where("name = ?", roleName).First(&role).Error; err != nil {
		return nil, fmt.Errorf("Роль не найдена")
	}
	return &role, nil
}

func createProfile(db *gorm.DB, req RegisterRequest, roleName string, userID uint) error {
	switch strings.ToLower(roleName) {
	case "specialist":
		if req.ExperienceYears == nil {
			return fmt.Errorf("Поле experience_years обязательно для специалиста")
		}
		if *req.ExperienceYears < 0 {
			return fmt.Errorf("Опыт работы не может быть отрицательным")
		}
		return db.Create(&models.SpecialistProfile{
			UserID:          userID,
			ExperienceYears: *req.ExperienceYears,
			About:           req.About,
			CreatedAt:       time.Now(),
		}).Error

	case "organization":
		if req.Website != "" && !strings.HasPrefix(req.Website, "http") {
			req.Website = "http://" + req.Website
		}
		return db.Create(&models.OrganizationProfile{
			UserID:    userID,
			Website:   req.Website,
			Address:   req.Address,
			About:     req.About,
			CreatedAt: time.Now(),
		}).Error

	default:
		return nil
	}
}

func createConfirmation(db *gorm.DB, userID uint) (*models.Confirmation, error) {
	token := uuid.NewString()
	confirmation := &models.Confirmation{
		UserID:         userID,
		EmailConfirmed: false,
		PhoneConfirmed: false,
		Token:          token,
	}
	err := db.Create(confirmation).Error
	return confirmation, err
}

func sendConfirmationEmail(user models.User, token string) {
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
			c.JSON(http.StatusBadRequest, gin.H{"error": "Токен обязателен"})
			return
		}

		err := confirmEmailByToken(db, token)
		if err != nil {
			if err.Error() == "Email уже подтверждён" {
				c.JSON(http.StatusOK, gin.H{"message": err.Error()})
			} else {
				c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			}
			return
		}

		c.JSON(http.StatusOK, gin.H{"message": "Email подтверждён"})
	}
}

func confirmEmailByToken(db *gorm.DB, token string) error {
	var confirmation models.Confirmation
	if err := db.Where("token = ?", token).First(&confirmation).Error; err != nil {
		return fmt.Errorf("Неверный токен")
	}

	if confirmation.EmailConfirmed {
		return fmt.Errorf("Email уже подтверждён")
	}

	confirmation.EmailConfirmed = true
	if err := db.Save(&confirmation).Error; err != nil {
		return fmt.Errorf("Не удалось подтвердить email")
	}
	return nil
}
