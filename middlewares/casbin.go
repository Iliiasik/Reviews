package middlewares

import (
	"net/http"

	"github.com/casbin/casbin/v2"
	"github.com/gin-gonic/gin"
)

func CasbinMiddleware(enforcer *casbin.Enforcer) gin.HandlerFunc {
	return func(c *gin.Context) {
		// Пропускаем OPTIONS запросы (для CORS)
		if c.Request.Method == "OPTIONS" {
			c.Next()
			return
		}

		role, exists := c.Get("user_role")
		if !exists {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{
				"error":   "unauthorized",
				"message": "Authentication required",
			})
			return
		}

		// Получаем путь и метод
		path := c.FullPath() // Используем FullPath для точного соответствия
		method := c.Request.Method

		// Проверяем разрешения
		allowed, err := enforcer.Enforce(role, path, method)
		if err != nil {
			c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{
				"error":   "internal_error",
				"message": "Failed to check permissions",
			})
			return
		}

		if !allowed {
			c.AbortWithStatusJSON(http.StatusForbidden, gin.H{
				"error":   "forbidden",
				"message": "You don't have permission to access this resource",
			})
			return
		}

		c.Next()
	}
}
