package database

import (
	"fmt"
	"github.com/casbin/casbin/v2"
	gormadapter "github.com/casbin/gorm-adapter/v3"
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
		&models.RefreshToken{},
	)
	if err != nil {
		log.Fatalf("Error running migrations: %v", err)
	}

	SeedRoles()
	SeedCasbinPolicies()

	log.Println("Migrations completed successfully")
}

func SeedRoles() {
	roles := []string{"user", "specialist", "organization", "admin", "moderator"}

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

func SeedCasbinPolicies() {
	adapter, err := gormadapter.NewAdapterByDBWithCustomTable(DB, nil, "casbin_rules")
	if err != nil {
		log.Fatalf("Failed to create casbin adapter: %v", err)
	}

	enforcer, err := casbin.NewEnforcer("rbac/casbin/model.conf", adapter)
	if err != nil {
		log.Fatalf("Failed to create casbin enforcer: %v", err)
	}

	enforcer.ClearPolicy()

	policies := []struct {
		sub string
		obj string
		act string
	}{
		// Админские права ПЕРЕДЕЛАТЬ
		{"admin", "/api/profile", "GET"},
		{"admin", "/api/profile", "POST"},
		{"admin", "/api/profile/update", "POST"},
		{"admin", "/api/specialist/:id", "GET"},
		{"admin", "/api/reviews", "GET"},
		{"admin", "/api/reviews", "POST"},
		{"admin", "/api/aspects", "GET"},
		{"admin", "/api/logout", "POST"},
		{"admin", "/api/change-password", "POST"},

		// Модераторские права
		{"moderator", "/api/profile", "GET"},
		{"moderator", "/api/specialist/:id", "GET"},
		{"moderator", "/api/reviews", "GET"},
		{"moderator", "/api/logout", "POST"},
		{"moderator", "/api/change-password", "POST"},

		// Права специалиста
		{"specialist", "/api/profile", "GET"},
		{"specialist", "/api/profile", "POST"},
		{"specialist", "/api/profile/update", "POST"},
		{"specialist", "/api/reviews", "GET"},
		{"specialist", "/api/generate-qr", "GET"},
		{"specialist", "/api/logout", "POST"},
		{"specialist", "/api/change-password", "POST"},

		// Права организации
		{"organization", "/api/profile", "GET"},
		{"organization", "/api/profile", "POST"},
		{"organization", "/api/profile/update", "POST"},
		{"organization", "/api/reviews", "GET"},
		{"organization", "/api/generate-qr", "GET"},
		{"organization", "/api/logout", "POST"},
		{"organization", "/api/change-password", "POST"},

		// Базовые права пользователя
		{"user", "/api/profile", "GET"},
		{"user", "/api/logout", "POST"},
		{"user", "/api/change-password", "POST"},
	}

	for _, policy := range policies {
		if _, err := enforcer.AddPolicy(policy.sub, policy.obj, policy.act); err != nil {
			log.Printf("Failed to add policy: %v", err)
		}
	}

	if _, err := enforcer.AddGroupingPolicy("admin", "moderator"); err != nil {
		log.Printf("Failed to add role hierarchy: %v", err)
	}

	if err := enforcer.SavePolicy(); err != nil {
		log.Fatalf("Failed to save casbin policies: %v", err)
	}

	log.Println("Casbin policies seeded successfully")
}
