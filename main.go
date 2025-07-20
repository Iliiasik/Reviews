package main

import (
	"context"
	"github.com/elastic/go-elasticsearch/v8"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
	"log"
	"os"
	"reviews-back/controllers/auth"
	"reviews-back/controllers/search"
	"reviews-back/cron"
	"reviews-back/database"
	"reviews-back/middlewares"
	"reviews-back/rbac"
	"reviews-back/routes"
)

func main() {
	err := godotenv.Load()
	if err != nil {
		log.Fatalf("Error loading .env file: %v", err)
	}

	auth.JwtKey = []byte(os.Getenv("JWT_SECRET"))
	if len(auth.JwtKey) == 0 {
		log.Fatal("JWT_SECRET is not set in .env")
	}

	database.InitDB()
	var esClient *elasticsearch.Client
	esClient, err = search.InitES()
	if err != nil {
		log.Printf("Elasticsearch не доступен: %v. Работаем в fallback режиме.", err)
		// esClient останется nil
	} else {
		ctx := context.Background()
		if err := search.LoadDataToES(ctx, esClient, database.DB); err != nil {
			log.Printf("Ошибка загрузки данных в Elasticsearch: %v. Работаем в fallback режиме.", err)
		}
	}

	// Запускаем CRON
	cron.StartRatingCron(database.DB)
	//storage.InitMinio()
	r := gin.New()
	r.Use(gin.Logger(), gin.Recovery(), middlewares.ErrorHandler())

	r.RedirectTrailingSlash = false
	enforcer, err := rbac.NewEnforcer(database.DB)
	if err != nil {
		log.Fatalf("Failed to initialize Casbin: %v", err)
	}
	routes.RegisterRoutes(r, enforcer, esClient)
	if err := r.Run(":8000"); err != nil {
		log.Fatalf("Server failed to start: %v", err)
	}
}
