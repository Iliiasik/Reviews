package auth

import (
	"fmt"
	"github.com/minio/minio-go/v7"
	"log"
	_ "log"
	"mime/multipart"
	"net/http"
	"os"
	"path/filepath"
	"regexp"
	"reviews-back/models"
	"reviews-back/storage"
	"reviews-back/utils/email"
	"strconv"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

type RegisterRequest struct {
	Name        string                `form:"name" binding:"required"`
	Email       string                `form:"email" binding:"required,email"`
	Phone       string                `form:"phone"`
	Username    string                `form:"username" binding:"required"`
	Password    string                `form:"password" binding:"required"`
	AccountType string                `form:"account_type" binding:"required"`
	Avatar      *multipart.FileHeader `form:"avatar"`

	// specialist
	ExperienceYears string `form:"experience_years"`
	About           string `form:"about"`

	// organization
	Website string `form:"website"`
	Address string `form:"address"`
}

func RegisterHandler(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		var req RegisterRequest
		if err := c.ShouldBind(&req); err != nil {
			log.Printf("Ошибка биндинга формы: %v\n", err)
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		log.Printf("Начало регистрации пользователя: %s (%s)\n", req.Username, req.Email)

		if err := validatePassword(req.Password); err != nil {
			log.Printf("Ошибка валидации пароля: %v\n", err)
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		if err := checkUniqueFields(db, req); err != nil {
			log.Printf("Ошибка уникальности данных: %v\n", err)
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		hashedPassword, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
		if err != nil {
			log.Println("Ошибка хеширования пароля:", err)
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Ошибка хеширования пароля"})
			return
		}

		role, err := findRole(db, req.AccountType)
		if err != nil {
			log.Printf("Ошибка поиска роли '%s': %v\n", req.AccountType, err)
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		//  minio
		userType := storage.UserTypeUser
		switch req.AccountType {
		case "specialist":
			userType = storage.UserTypeSpecialist
		case "organization":
			userType = storage.UserTypeOrganization
		}

		var userID uint
		var avatarURL string

		err = db.Transaction(func(tx *gorm.DB) error {
			log.Println("Создание пользователя в базе данных...")

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
				log.Printf("Ошибка при создании пользователя: %v\n", err)
				return err
			}
			userID = user.ID
			log.Printf("Пользователь создан с ID %d\n", userID)

			// аватарка
			if req.Avatar != nil {
				log.Printf("Обработка аватара: имя файла — %s, размер — %d байт\n", req.Avatar.Filename, req.Avatar.Size)

				ext := strings.ToLower(filepath.Ext(req.Avatar.Filename))
				if ext != ".jpg" && ext != ".jpeg" && ext != ".png" {
					log.Printf("Недопустимый формат аватара: %s\n", ext)
					return fmt.Errorf("Неподдерживаемый формат изображения")
				}

				file, err := req.Avatar.Open()
				if err != nil {
					log.Printf("Ошибка открытия файла аватара: %v\n", err)
					return fmt.Errorf("Ошибка чтения файла аватара")
				}
				defer file.Close()

				objectName := fmt.Sprintf("%s/%d/avatar%s", userType, userID, ext)
				log.Printf("Загрузка аватара в MinIO: bucket=%s, object=%s\n", storage.BucketName, objectName)

				_, err = storage.MinioClient.PutObject(
					c.Request.Context(),
					storage.BucketName,
					objectName,
					file,
					req.Avatar.Size,
					minio.PutObjectOptions{ContentType: req.Avatar.Header.Get("Content-Type")},
				)
				if err != nil {
					log.Printf("Ошибка при загрузке аватара в MinIO: %v\n", err)
					return fmt.Errorf("Ошибка загрузки аватара в хранилище")
				}

				avatarURL = storage.GetAvatarURL(userType, userID, ext)
				log.Printf("Аватар успешно загружен: %s\n", avatarURL)

				user.AvatarURL = avatarURL
				if err := tx.Save(&user).Error; err != nil {
					log.Printf("Ошибка сохранения avatar_url в базе: %v\n", err)
					return fmt.Errorf("Ошибка сохранения URL аватара")
				}
			}

			if err := createProfile(tx, req, role.Name, user.ID); err != nil {
				log.Printf("Ошибка создания профиля: %v\n", err)
				return err
			}

			confirmation, err := createConfirmation(tx, user.ID)
			if err != nil {
				log.Printf("Ошибка создания подтверждения email: %v\n", err)
				return err
			}

			go sendConfirmationEmail(user, confirmation.Token)
			log.Println("Письмо с подтверждением отправлено")

			return nil
		})

		if err != nil {
			log.Printf("Ошибка транзакции регистрации: %v\n", err)
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Не удалось зарегистрировать пользователя: " + err.Error()})
			return
		}

		log.Printf("Регистрация завершена успешно: ID=%d, Avatar=%s\n", userID, avatarURL)

		response := gin.H{
			"message":    "Пользователь создан. Письмо с подтверждением отправлено",
			"user_id":    userID,
			"avatar_url": avatarURL,
		}

		c.JSON(http.StatusCreated, response)
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
		if req.ExperienceYears == "" {
			return fmt.Errorf("Поле experience_years обязательно для специалиста")
		}

		// Преобразуем строку в число
		expYears, err := strconv.Atoi(req.ExperienceYears)
		if err != nil {
			return fmt.Errorf("Опыт работы должен быть числом")
		}

		if expYears < 0 {
			return fmt.Errorf("Опыт работы не может быть отрицательным")
		}

		return db.Create(&models.SpecialistProfile{
			UserID:          userID,
			ExperienceYears: expYears,
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

func ResendConfirmationHandler(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		var req struct {
			Username string `json:"username" binding:"required"`
		}

		if err := c.ShouldBindJSON(&req); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "username обязателен"})
			return
		}

		var user models.User
		if err := db.Where("username = ?", req.Username).First(&user).Error; err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Пользователь не найден"})
			return
		}

		db.Where("user_id = ?", user.ID).Delete(&models.Confirmation{})

		confirmation, err := createConfirmation(db, user.ID)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Не удалось создать подтверждение"})
			return
		}

		go sendConfirmationEmail(user, confirmation.Token)

		c.JSON(http.StatusOK, gin.H{"message": "Письмо с подтверждением отправлено"})
	}
}
