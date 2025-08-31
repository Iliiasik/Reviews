package database

import (
	"github.com/casbin/casbin/v2"
	gormadapter "github.com/casbin/gorm-adapter/v3"
	"gorm.io/gorm"
	"log"
	"reviews-back/models"
)

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
		{"admin", "/api/verification-requests", "POST"},
		{"admin", "/api/verification-requests/pending", "GET"},
		{"admin", "/api/verification-requests/:id/approve", "POST"},
		{"admin", "/api/verification-requests/:id/reject", "POST"},
		{"admin", "/api/reviews/user", "GET"},
		{"admin", "/api/users/:user_id/avatar", "POST"},
		{"admin", "/api/users/:user_id/avatar", "DELETE"},

		// Модераторские права
		{"moderator", "/api/profile", "GET"},
		{"moderator", "/api/specialist/:id", "GET"},
		{"moderator", "/api/reviews", "GET"},
		{"moderator", "/api/logout", "POST"},
		{"moderator", "/api/change-password", "POST"},
		{"moderator", "/api/reviews/user", "GET"},

		// Права специалиста
		{"specialist", "/api/profile", "GET"},
		{"specialist", "/api/profile", "POST"},
		{"specialist", "/api/profile/update", "POST"},
		{"specialist", "/api/reviews", "GET"},
		{"specialist", "/api/generate-qr", "GET"},
		{"specialist", "/api/logout", "POST"},
		{"specialist", "/api/change-password", "POST"},
		{"specialist", "/api/verification-requests", "POST"},
		{"specialist", "/api/verification-requests/status", "GET"},
		{"specialist", "/api/reviews/user", "GET"},
		{"specialist", "/api/users/:user_id/avatar", "POST"},
		{"specialist", "/api/users/:user_id/avatar", "DELETE"},

		// Права организации
		{"organization", "/api/profile", "GET"},
		{"organization", "/api/profile", "POST"},
		{"organization", "/api/profile/update", "POST"},
		{"organization", "/api/reviews", "GET"},
		{"organization", "/api/generate-qr", "GET"},
		{"organization", "/api/logout", "POST"},
		{"organization", "/api/change-password", "POST"},
		{"organization", "/api/verification-requests", "POST"},
		{"organization", "/api/verification-requests/status", "GET"},
		{"organization", "/api/reviews/user", "GET"},
		{"organization", "/api/users/:user_id/avatar", "POST"},
		{"organization", "/api/users/:user_id/avatar", "DELETE"},

		// Базовые права пользователя
		{"user", "/api/profile", "GET"},
		{"user", "/api/logout", "POST"},
		{"user", "/api/change-password", "POST"},
		{"user", "/api/profile/update", "POST"},
		{"user", "/api/reviews/user", "GET"},
		{"user", "/api/users/:user_id/avatar", "POST"},
		{"user", "/api/users/:user_id/avatar", "DELETE"},
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

func SeedReviewAspects() {
	aspects := []models.ReviewAspect{
		{Description: "Вежливость", Positive: true},
		{Description: "Пунктуальность", Positive: true},
		{Description: "Компетентность", Positive: true},
		{Description: "Чистота помещения", Positive: true},
		{Description: "Умение слушать", Positive: true},
		{Description: "Грубость", Positive: false},
		{Description: "Слишком долго ждать", Positive: false},
		{Description: "Некомпетентен", Positive: false},
		{Description: "Неопрятность", Positive: false},
		{Description: "Игнорирование жалоб", Positive: false},
	}

	for _, aspect := range aspects {
		var existing models.ReviewAspect
		if err := DB.Where("description = ?", aspect.Description).First(&existing).Error; err != nil {
			if err == gorm.ErrRecordNotFound {
				if err := DB.Create(&aspect).Error; err != nil {
					log.Printf("Ошибка при создании аспекта: %v", err)
				} else {
					log.Printf("Аспект добавлен: %s", aspect.Description)
				}
			} else {
				log.Printf("Ошибка при поиске аспекта: %v", err)
			}
		}
	}
}
