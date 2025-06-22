package routes

import (
	"github.com/gin-gonic/gin"
	"reviews-back/controllers/auth"
	"reviews-back/controllers/profile"
	"reviews-back/controllers/search"
	"reviews-back/database"
)

func RegisterRoutes(r *gin.Engine) {
	api := r.Group("/api")
	{
		api.POST("/login", auth.Login)
		api.POST("/logout", auth.Logout)
		api.POST("/change-password", auth.ChangePassword)

		api.POST("/register", auth.RegisterHandler(database.DB))
		api.GET("/profile", profile.GetProfileHandler(database.DB))
		api.GET("/auth/google", auth.GoogleLogin)
		api.GET("/auth/google/callback", auth.GoogleCallback)
		api.GET("/confirm-email", auth.ConfirmEmailHandler(database.DB))
		api.POST("/profile/update", profile.UpdateProfileHandler(database.DB))

		api.GET("/search", search.SearchHandler(database.DB))
		api.GET("/explore", search.ExploreHandler(database.DB))
		api.POST("/resend-confirmation", auth.ResendConfirmationHandler(database.DB))
	}
}
