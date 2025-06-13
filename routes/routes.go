package routes

import (
	"github.com/gin-gonic/gin"
	"reviews-back/controllers"
)

func RegisterRoutes(r *gin.Engine) {
	api := r.Group("/api")
	{
		api.POST("/login", controllers.Login)
		api.POST("/logout", controllers.Logout)
		api.POST("/change-password", controllers.ChangePassword)
	}
}
