package routes

import (
	"github.com/gin-gonic/gin"
	"reviews-back/controllers"
	"reviews-back/database"
)

func RegisterRoutes(r *gin.Engine) {
	api := r.Group("/api")
	{
		api.POST("/login", controllers.Login)
		api.POST("/logout", controllers.Logout)
		api.POST("/change-password", controllers.ChangePassword)

		api.POST("/register", controllers.RegisterHandler(database.DB))
		api.GET("/profile", controllers.GetProfileHandler(database.DB))
		api.GET("/auth/google", controllers.GoogleLogin)
		api.GET("/auth/google/callback", controllers.GoogleCallback)
		api.GET("/confirm-email", controllers.ConfirmEmailHandler(database.DB))
		api.POST("/profile/update", controllers.UpdateProfileHandler(database.DB))

	}
}
