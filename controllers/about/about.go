package about

import (
	"github.com/gin-gonic/gin"
	"net/http"
	"reviews-back/database"
	"reviews-back/error_types"
	"reviews-back/models"
)

func GetTeam(c *gin.Context) {
	var members []models.TeamMember
	if err := database.DB.Find(&members).Error; err != nil {
		appErr := error_types.InternalServerError(err).
			WithCode(error_types.CodeDatabaseError).
			WithMessage("Не удалось получить список команды")
		c.JSON(appErr.HttpStatusCode, appErr)
		return
	}

	c.JSON(http.StatusOK, members)
}

func GetPartners(c *gin.Context) {
	var partners []models.Partner
	if err := database.DB.Find(&partners).Error; err != nil {
		appErr := error_types.InternalServerError(err).
			WithCode(error_types.CodeDatabaseError).
			WithMessage("Не удалось получить список партнёров")
		c.JSON(appErr.HttpStatusCode, appErr)
		return
	}

	c.JSON(http.StatusOK, partners)
}
