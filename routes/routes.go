package routes

import (
	"github.com/casbin/casbin/v2"
	"github.com/elastic/go-elasticsearch/v8"
	"github.com/gin-gonic/gin"
	"github.com/hibiken/asynq"
	"reviews-back/controllers/auth"
	"reviews-back/controllers/profile"
	"reviews-back/controllers/qr"
	"reviews-back/controllers/reviews"
	"reviews-back/controllers/search"
	"reviews-back/controllers/verifications"
	"reviews-back/database"
	"reviews-back/middlewares"
)

func RegisterRoutes(r *gin.Engine, enforcer *casbin.Enforcer, esClient *elasticsearch.Client, asynqClient *asynq.Client) {
	public := r.Group("/api")
	public.Use(middlewares.AuthMiddleware(database.DB))
	{
		public.POST("/login", auth.Login)
		public.POST("/auth/refresh", auth.Refresh)
		public.GET("/auth/google", auth.GoogleLogin)
		public.GET("/auth/google/callback", auth.GoogleCallback)
		public.GET("/confirm-email", auth.ConfirmEmailHandler(database.DB))
		public.POST("/register", auth.RegisterHandler(database.DB))
		public.GET("/search", search.ElasticSearch(esClient, search.SearchHandler(database.DB)))
		public.GET("/explore", search.ExploreHandler(database.DB))
		public.POST("/resend-confirmation", auth.ResendConfirmationHandler(database.DB))
		public.POST("/reviews", reviews.CreateReview(database.DB, asynqClient))
		public.GET("/reviews", reviews.GetReviews(database.DB))
		public.GET("/aspects", reviews.GetReviewAspects(database.DB))
		public.GET("/specialist/:id", profile.GetSpecialistProfile(database.DB))
		public.POST("/unverified-profile", profile.CreateUnverifiedProfile(database.DB))
		public.GET("/organization/:id", profile.GetOrganizationProfile(database.DB))
		public.GET("/reviews/summary/:id", profile.GetUserReviewsSummary)
		public.POST("/reviews/:id/like", reviews.LikeReview(database.DB))
		public.DELETE("/reviews/:id/like", reviews.UnlikeReview(database.DB))

	}

	protected := r.Group("/api")
	protected.Use(middlewares.AuthMiddleware(database.DB))
	protected.Use(middlewares.CasbinMiddleware(enforcer))
	{
		protected.POST("/logout", auth.Logout)
		protected.POST("/change-password", auth.ChangePassword)
		protected.GET("/profile", profile.GetProfileHandler(database.DB))
		protected.POST("/profile/update", profile.UpdateProfileHandler(database.DB))
		protected.POST("/users/:user_id/avatar", profile.UploadAvatarHandler(database.DB))
		protected.DELETE("/users/:user_id/avatar", profile.DeleteAvatarHandler(database.DB))
		protected.GET("/generate-qr", qr.GenerateQR(database.DB))
		protected.POST("/verification-requests", verifications.CreateVerificationRequest)
		protected.GET("/verification-requests/pending", verifications.GetPendingVerificationRequests)
		protected.POST("/verification-requests/:id/approve", verifications.ApproveVerificationRequest)
		protected.POST("/verification-requests/:id/reject", verifications.RejectVerificationRequest)
		protected.GET("/verification-requests/status", verifications.CheckVerificationRequestStatus)
		protected.GET("/reviews/user", profile.GetUserReviews)
	}
}
