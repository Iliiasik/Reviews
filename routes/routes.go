package routes

import (
	"github.com/casbin/casbin/v2"
	"github.com/gin-gonic/gin"
	"reviews-back/controllers/auth"
	"reviews-back/controllers/profile"
	"reviews-back/controllers/reviews"
	"reviews-back/controllers/search"
	"reviews-back/database"
	"reviews-back/middlewares"
)

func RegisterRoutes(r *gin.Engine, enforcer *casbin.Enforcer) {
	// Публичные роуты, не требующие авторизации
	public := r.Group("/api")
	{
		public.POST("/login", auth.Login)
		public.GET("/auth/google", auth.GoogleLogin)
		public.GET("/auth/google/callback", auth.GoogleCallback)
		public.GET("/confirm-email", auth.ConfirmEmailHandler(database.DB))
		public.POST("/register", auth.RegisterHandler(database.DB))
		public.GET("/search", search.SearchHandler(database.DB))
		public.GET("/explore", search.ExploreHandler(database.DB))
		public.POST("/resend-confirmation", auth.ResendConfirmationHandler(database.DB))
		public.POST("/reviews", reviews.CreateReview(database.DB))
		public.GET("/reviews", reviews.GetReviews(database.DB))
		public.GET("/aspects", reviews.GetReviewAspects(database.DB))
		public.GET("/specialist/:id", profile.GetSpecialistProfile(database.DB))
	}

	// Защищенные роуты
	protected := r.Group("/api")
	protected.Use(middlewares.AuthMiddleware(database.DB))
	protected.Use(middlewares.CasbinMiddleware(enforcer))
	{
		protected.POST("/logout", auth.Logout)
		protected.POST("/change-password", auth.ChangePassword)
		protected.GET("/profile", profile.GetProfileHandler(database.DB))
		protected.POST("/profile/update", profile.UpdateProfileHandler(database.DB))
	}
}
