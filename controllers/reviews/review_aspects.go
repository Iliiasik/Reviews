package reviews

import (
	"net/http"
	"reviews-back/models"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func GetReviewAspects(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		var aspects []models.ReviewAspect
		if err := db.Order("positive DESC, description ASC").Find(&aspects).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Не удалось получить аспекты"})
			return
		}
		c.JSON(http.StatusOK, aspects)
	}
}
