package middlewares

import (
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
	"reviews-back/controllers/auth"
	"reviews-back/error_types"
	"reviews-back/models"
)

func AuthMiddleware(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		token, err := c.Cookie("access_token")
		if err != nil {
			c.Next()
			return
		}

		claims, appErr := auth.ValidateJWT(token)
		if appErr != nil {
			c.Error(appErr)
			c.Abort()
			return
		}

		var user models.User
		if err := db.Preload("Role").First(&user, claims.UserID).Error; err != nil {
			c.Error(error_types.NotFoundError(error_types.CodeUserNotFound, "Пользователь"))
			c.Abort()
			return
		}

		c.Set("user_id", user.ID)
		c.Set("user_role", user.Role.Name)

		c.Next()
	}
}
