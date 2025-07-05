package middlewares

import (
	"github.com/casbin/casbin/v2"
	"github.com/gin-gonic/gin"
	"reviews-back/error_types"
)

func CasbinMiddleware(enforcer *casbin.Enforcer) gin.HandlerFunc {
	return func(c *gin.Context) {
		if c.Request.Method == "OPTIONS" {
			c.Next()
			return
		}

		role, exists := c.Get("user_role")
		if !exists {
			c.Error(error_types.UnauthorizedError(error_types.CodeUnauthorized, "Требуется авторизация"))
			c.Abort()
			return
		}

		path := c.FullPath()
		method := c.Request.Method

		allowed, err := enforcer.Enforce(role, path, method)
		if err != nil {
			c.Error(error_types.InternalServerError(err).WithCode(error_types.CodeInternalServerError))
			c.Abort()
			return
		}

		if !allowed {
			c.Error(error_types.ForbiddenError("У вас нет прав доступа к этому ресурсу"))
			c.Abort()
			return
		}

		c.Next()
	}
}
