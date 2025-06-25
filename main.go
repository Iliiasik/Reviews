package main

import (
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
	"log"
	"os"
	"reviews-back/controllers/auth"
	"reviews-back/controllers/rbac"
	"reviews-back/database"
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
	//storage.InitMinio()

	r := gin.Default()

	enforcer, err := rbac.NewEnforcer(database.DB)
	if err != nil {
		log.Fatalf("Failed to initialize Casbin: %v", err)
	}
	routes.RegisterRoutes(r, enforcer)

	if err := r.Run(":8000"); err != nil {
		log.Fatalf("Server failed to start: %v", err)
	}
}
