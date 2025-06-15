package database

import (
	"fmt"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"log"
	"os"
	"reviews-back/models"
)

var DB *gorm.DB

func InitDB() {
	user := os.Getenv("DB_USER")
	password := os.Getenv("DB_PASSWORD")
	dbName := os.Getenv("DB_NAME")
	host := os.Getenv("DB_HOST")
	port := os.Getenv("DB_PORT")

	if user == "" || password == "" || dbName == "" || host == "" || port == "" {
		log.Fatal("One or more environment variables for DB are missing")
	}

	dsn := fmt.Sprintf(
		"host=%s user=%s password=%s dbname=%s port=%s sslmode=disable",
		host, user, password, dbName, port,
	)

	var err error
	DB, err = gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatalf("Error connecting to the database: %v", err)
	}

	log.Println("Connection to database successful")

	sqlDB, err := DB.DB()
	if err != nil {
		log.Fatalf("Error getting SQL DB instance: %v", err)
	}

	if err := sqlDB.Ping(); err != nil {
		log.Fatalf("Error pinging database: %v", err)
	}
	log.Println("Database ping success")

	err = DB.AutoMigrate(
		&models.Role{},
		&models.User{},
		&models.SpecialistProfile{},
		&models.OrganizationProfile{},
		&models.Confirmation{},
		&models.ReportCategory{},
		&models.ReviewReport{},
		&models.ReviewAspect{},
		&models.ReviewCategory{},
		&models.Review{},
		&models.ReviewCollection{},
		&models.ReviewCollectionAccess{},
		&models.QRCode{},
	)
	if err != nil {
		log.Fatalf("Error running migrations: %v", err)
	}
	SeedRoles()

	log.Println("Migrations completed successfully")
}
func SeedRoles() {
	roles := []string{"user", "specialist", "organization"}

	for _, name := range roles {
		var role models.Role
		if err := DB.Where("name = ?", name).First(&role).Error; err != nil {
			if err == gorm.ErrRecordNotFound {
				DB.Create(&models.Role{Name: name})
				log.Printf("Создана роль: %s", name)
			} else {
				log.Printf("Ошибка при поиске роли %s: %v", name, err)
			}
		}
	}
}
