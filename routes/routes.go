package routes

import (
	"github.com/gin-gonic/gin"
	"reviews-back/controllers/auth"
	"reviews-back/controllers/profile"
	"reviews-back/controllers/reviews"
	"reviews-back/controllers/search"
	"reviews-back/database"
	"reviews-back/middlewares"
)

func RegisterRoutes(r *gin.Engine) {
	api := r.Group("/api")
	api.Use(middlewares.AuthMiddleware())
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

		api.GET("/specialist/:id", profile.GetSpecialistProfile(database.DB))

		api.POST("/reviews", reviews.CreateReview(database.DB))
		api.GET("/reviews", reviews.GetReviews(database.DB))
		api.GET("/aspects", reviews.GetReviewAspects(database.DB))

	}
}
