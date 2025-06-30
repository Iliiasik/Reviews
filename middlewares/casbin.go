package middlewares

import (
	"github.com/casbin/casbin/v2"
	"github.com/gin-gonic/gin"
	"reviews-back/errors"
)

func CasbinMiddleware(enforcer *casbin.Enforcer) gin.HandlerFunc {
	return func(c *gin.Context) {
		if c.Request.Method == "OPTIONS" {
			c.Next()
			return
		}

		role, exists := c.Get("user_role")
		if !exists {
			c.Error(errors.UnauthorizedError(errors.CodeUnauthorized, "Требуется авторизация"))
			c.Abort()
			return
		}

		path := c.FullPath()
		method := c.Request.Method

		allowed, err := enforcer.Enforce(role, path, method)
		if err != nil {
			c.Error(errors.InternalServerError(err).WithCode(errors.CodeInternalServerError))
			c.Abort()
			return
		}

		if !allowed {
			c.Error(errors.ForbiddenError("У вас нет прав доступа к этому ресурсу"))
			c.Abort()
			return
		}

		c.Next()
	}
}
