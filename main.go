package main

import (
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
	"log"
	"os"
	"reviews-back/controllers"
	"reviews-back/database"
	"reviews-back/routes"
)

func main() {

	err := godotenv.Load()
	if err != nil {
		log.Fatalf("Error loading .env file: %v", err)
	}

	controllers.JwtKey = []byte(os.Getenv("JWT_SECRET"))
	if len(controllers.JwtKey) == 0 {
		log.Fatal("JWT_SECRET is not set in .env")
	}

	database.InitDB()

	r := gin.Default()
	routes.RegisterRoutes(r)
	err = r.Run(":8080")
	if err != nil {
		log.Fatalf("Server failed to start: %v", err)
	}
}
