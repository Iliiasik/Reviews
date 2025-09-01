package contacts

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"

	"reviews-back/database"
	"reviews-back/error_types"
	"reviews-back/models"
)

type CreateContactRequest struct {
	Name        string `json:"name" binding:"required,min=2,max=100"`
	Email       string `json:"email" binding:"required,email"`
	Description string `json:"description" binding:"required,min=10,max=1000"`
}

func CreateContact(c *gin.Context) {
	var req CreateContactRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.Error(error_types.ValidationError(err))
		return
	}

	request := models.ContactRequest{
		Name:        req.Name,
		Email:       req.Email,
		Description: req.Description,
	}

	if err := database.DB.Create(&request).Error; err != nil {
		if err == gorm.ErrInvalidData {
			c.Error(error_types.ValidationError(err))
			return
		}
		c.Error(error_types.InternalServerError(err))
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"message": "Заявка успешно отправлена",
		"data":    request,
	})
}
