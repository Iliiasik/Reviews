package main

import (
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
	"log"
	"os"
	"reviews-back/controllers/auth"
	"reviews-back/database"
	"reviews-back/routes"
	"reviews-back/storage"
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
	storage.InitMinio()

	r := gin.Default()
	routes.RegisterRoutes(r)

	if err := r.Run(":8000"); err != nil {
		log.Fatalf("Server failed to start: %v", err)
	}
}
