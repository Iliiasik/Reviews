package routes

import (
	"github.com/gin-gonic/gin"
	"reviews-back/controllers"
	"reviews-back/controllers/auth"
	"reviews-back/database"
)

func RegisterRoutes(r *gin.Engine) {
	api := r.Group("/api")
	{
		api.POST("/login", auth.Login)
		api.POST("/logout", auth.Logout)
		api.POST("/change-password", auth.ChangePassword)

		api.POST("/register", auth.RegisterHandler(database.DB))
		api.GET("/profile", controllers.GetProfileHandler(database.DB))
		api.GET("/auth/google", auth.GoogleLogin)
		api.GET("/auth/google/callback", auth.GoogleCallback)
		api.GET("/confirm-email", auth.ConfirmEmailHandler(database.DB))
		api.POST("/profile/update", controllers.UpdateProfileHandler(database.DB))

	}
}
