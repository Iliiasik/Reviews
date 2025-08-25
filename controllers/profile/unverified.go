package profile

import (
	"fmt"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"gorm.io/gorm"
	"net/http"
	"reviews-back/error_types"
	"reviews-back/models"
	"strings"
	"time"
)

type CreateUnverifiedRequest struct {
	Name  string `json:"name" binding:"required"`
	About string `json:"about" binding:"required"`
	Type  string `json:"type" binding:"required,oneof=specialist organization"`
}

func CreateUnverifiedProfile(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		var req CreateUnverifiedRequest
		if err := c.ShouldBindJSON(&req); err != nil {
			c.Error(error_types.ValidationError(err.Error()))
			return
		}

		now := time.Now().UnixNano()

		var roleID uint
		switch req.Type {
		case "specialist":
			roleID = 2
		case "organization":
			roleID = 3
		default:
			c.Error(error_types.CustomError(
				http.StatusBadRequest,
				error_types.CodeValidationError,
				"Неизвестный тип профиля",
				nil,
			))
			return
		}

		user := models.User{
			Name:         strings.TrimSpace(req.Name),
			Email:        fmt.Sprintf("unverified-%d@example.com", now),
			Username:     fmt.Sprintf("unv_%s", uuid.New().String()[:10]),
			Phone:        fmt.Sprintf("unv-%d", now%1_000_000_000),
			PasswordHash: "unverified",
			RoleID:       roleID,
			CreatedAt:    time.Now(),
		}

		if err := db.Create(&user).Error; err != nil {
			c.Error(error_types.InternalServerError(err).WithCode(error_types.CodeDatabaseError))
			return
		}

		switch req.Type {
		case "specialist":
			profile := models.SpecialistProfile{
				UserID:      user.ID,
				About:       strings.TrimSpace(req.About),
				IsConfirmed: false,
				CreatedAt:   time.Now(),
			}
			if err := db.Create(&profile).Error; err != nil {
				c.Error(error_types.InternalServerError(err).
					WithCode(error_types.CodeDatabaseError).
					WithMessage("Ошибка при создании профиля специалиста"))
				return
			}
		case "organization":
			profile := models.OrganizationProfile{
				UserID:      user.ID,
				About:       strings.TrimSpace(req.About),
				IsConfirmed: false,
				CreatedAt:   time.Now(),
			}
			if err := db.Create(&profile).Error; err != nil {
				c.Error(error_types.InternalServerError(err).
					WithCode(error_types.CodeDatabaseError).
					WithMessage("Ошибка при создании профиля организации"))
				return
			}
		}

		c.JSON(http.StatusCreated, gin.H{
			"user_id": user.ID,
			"type":    req.Type,
			"message": "Профиль успешно создан",
		})
	}
}
