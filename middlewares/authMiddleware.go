// middleware.go
package middlewares

import (
	"github.com/gin-gonic/gin"
	"reviews-back/controllers/auth"
)

func AuthMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		cookie, err := c.Cookie("token") // ✅ ищем токен
		if err != nil || cookie == "" {
			c.Next()
			return
		}

		claims, err := auth.ValidateJWT(cookie)
		if err != nil {
			c.Next()
			return
		}

		// Устанавливаем ID в контекст
		c.Set("user_id", claims.UserID)
		c.Next()
	}
}
