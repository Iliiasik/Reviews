package middlewares

import (
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
	"reviews-back/controllers/auth"
	"reviews-back/models"
)

func AuthMiddleware(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		token, err := c.Cookie("token")
		if err != nil {
			c.Next()
			return
		}

		claims, err := auth.ValidateJWT(token)
		if err != nil {
			c.Next()
			return
		}

		var user models.User
		if err := db.Preload("Role").First(&user, claims.UserID).Error; err != nil {
			c.Next()
			return
		}

		c.Set("user_id", user.ID)
		c.Set("user_role", user.Role.Name)
		c.Next()
	}
}
