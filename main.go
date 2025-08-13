package main

import (
	"github.com/gin-gonic/gin"
	"log"
	"reviews-back/config"
	appinit "reviews-back/init"
	"reviews-back/middlewares"
	"reviews-back/routes"
)

func main() {
	config.LoadEnv()

	services := appinit.InitServices()
	defer func() {
		if services.AsynqClient != nil {
			services.AsynqClient.Close()
		}
	}()

	r := gin.New()
	r.Use(
		gin.Logger(),
		gin.Recovery(),
		middlewares.ErrorHandler(),
	)
	r.RedirectTrailingSlash = false

	routes.RegisterRoutes(r, services.Enforcer, services.ES, services.AsynqClient)

	if err := r.Run(":8000"); err != nil {
		log.Fatalf("Server failed to start: %v", err)
	}
}
