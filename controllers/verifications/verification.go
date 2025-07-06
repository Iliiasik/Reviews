package verifications

import (
	"net/http"
	"reviews-back/database"
	"reviews-back/error_types"
	"reviews-back/models"
	"time"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

type CreateRequest struct {
	Description string `json:"description" binding:"required,min=20,max=1000"`
}

func CreateVerificationRequest(c *gin.Context) {
	userID, exists := c.Get("user_id")
	if !exists {
		c.Error(error_types.UnauthorizedError(error_types.CodeUnauthorized, "Требуется авторизация"))
		return
	}

	userIDUint, ok := userID.(uint)
	if !ok {
		c.Error(error_types.InternalServerError(nil).WithMessage("Некорректный формат user_id"))
		return
	}

	var req CreateRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.Error(error_types.ValidationError(err))
		return
	}

	var user models.User
	if err := database.DB.Preload("Role").First(&user, userIDUint).Error; err != nil {
		c.Error(error_types.NotFoundError(error_types.CodeUserNotFound, "Пользователь"))
		return
	}

	switch user.Role.Name {
	case "specialist":
		var profile models.SpecialistProfile
		if err := database.DB.Where("user_id = ?", userIDUint).First(&profile).Error; err != nil {
			c.Error(error_types.NotFoundError(error_types.CodeNotFound, "Профиль специалиста"))
			return
		}
		if profile.IsConfirmed {
			c.Error(error_types.CustomError(
				http.StatusBadRequest,
				error_types.CodeProfileAlreadyConfirmed,
				"Профиль специалиста уже подтвержден",
				nil,
			))
			return
		}
	case "organization":
		var profile models.OrganizationProfile
		if err := database.DB.Where("user_id = ?", userIDUint).First(&profile).Error; err != nil {
			c.Error(error_types.NotFoundError(error_types.CodeNotFound, "Профиль организации"))
			return
		}
		if profile.IsConfirmed {
			c.Error(error_types.CustomError(
				http.StatusBadRequest,
				error_types.CodeProfileAlreadyConfirmed,
				"Профиль организации уже подтвержден",
				nil,
			))
			return
		}
	default:
		c.Error(error_types.ForbiddenError("Только специалисты и организации могут подавать заявки"))
		return
	}

	var existingRequest models.VerificationRequest
	err := database.DB.Where("user_id = ?", userIDUint).First(&existingRequest).Error
	if err == nil {
		c.Error(error_types.CustomError(
			http.StatusBadRequest,
			error_types.CodeVerificationRequestExists,
			"Вы уже подавали заявку на подтверждение",
			nil,
		))
		return
	} else if err != gorm.ErrRecordNotFound {
		c.Error(error_types.InternalServerError(err))
		return
	}

	request := models.VerificationRequest{
		UserID:      userIDUint,
		Description: req.Description,
		IsApproved:  false,
	}

	if err := database.DB.Create(&request).Error; err != nil {
		c.Error(error_types.InternalServerError(err))
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"message": "Заявка успешно создана",
		"data":    request,
	})
}

func GetPendingVerificationRequests(c *gin.Context) {
	var requests []models.VerificationRequest
	if err := database.DB.Preload("User").Preload("User.Role").
		Where("is_approved = ?", false).
		Find(&requests).Error; err != nil {
		c.Error(error_types.InternalServerError(err))
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"data": requests,
	})
}

func ApproveVerificationRequest(c *gin.Context) {
	requestID := c.Param("id")

	tx := database.DB.Begin()
	defer func() {
		if r := recover(); r != nil {
			tx.Rollback()
		}
	}()

	var request models.VerificationRequest
	if err := tx.Preload("User").Preload("User.Role").
		First(&request, requestID).Error; err != nil {
		tx.Rollback()
		if err == gorm.ErrRecordNotFound {
			c.Error(error_types.NotFoundError(error_types.CodeVerificationRequestNotFound, "Заявка"))
			return
		}
		c.Error(error_types.InternalServerError(err))
		return
	}

	if request.IsApproved {
		tx.Rollback()
		c.Error(error_types.CustomError(
			http.StatusBadRequest,
			error_types.CodeValidationError,
			"Заявка уже подтверждена",
			nil,
		))
		return
	}

	request.IsApproved = true
	request.UpdatedAt = time.Now()

	if err := tx.Save(&request).Error; err != nil {
		tx.Rollback()
		c.Error(error_types.InternalServerError(err))
		return
	}

	switch request.User.Role.Name {
	case "specialist":
		if err := tx.Model(&models.SpecialistProfile{}).
			Where("user_id = ?", request.UserID).
			Update("is_confirmed", true).Error; err != nil {
			tx.Rollback()
			c.Error(error_types.InternalServerError(err))
			return
		}
	case "organization":
		if err := tx.Model(&models.OrganizationProfile{}).
			Where("user_id = ?", request.UserID).
			Update("is_confirmed", true).Error; err != nil {
			tx.Rollback()
			c.Error(error_types.InternalServerError(err))
			return
		}
	}

	if err := tx.Commit().Error; err != nil {
		tx.Rollback()
		c.Error(error_types.InternalServerError(err))
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Заявка успешно подтверждена",
		"data":    request,
	})
}

func RejectVerificationRequest(c *gin.Context) {
	requestID := c.Param("id")

	var request models.VerificationRequest
	if err := database.DB.First(&request, requestID).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			c.Error(error_types.NotFoundError(error_types.CodeVerificationRequestNotFound, "Заявка"))
			return
		}
		c.Error(error_types.InternalServerError(err))
		return
	}

	if request.IsApproved {
		c.Error(error_types.CustomError(
			http.StatusBadRequest,
			error_types.CodeValidationError,
			"Нельзя отклонить уже подтвержденную заявку",
			nil,
		))
		return
	}

	if err := database.DB.Delete(&request).Error; err != nil {
		c.Error(error_types.InternalServerError(err))
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Заявка отклонена и удалена",
	})
}
