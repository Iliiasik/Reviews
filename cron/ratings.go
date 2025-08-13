package cron

import (
	"log"
	"reviews-back/models"

	"github.com/robfig/cron/v3"
	"gorm.io/gorm"
)

func StartRatingCron(db *gorm.DB) {
	c := cron.New()

	_, err := c.AddFunc("0 2 * * *", func() {
		log.Println("[CRON] Обновление рейтингов...")
		updateRatings(db)
	})
	if err != nil {
		log.Fatalf("Ошибка запуска CRON-задачи: %v", err)
	}

	c.Start()
}

func updateRatings(db *gorm.DB) {
	var userIDs []uint
	err := db.Model(&models.Review{}).
		Where("is_frozen = false").
		Distinct("profile_user_id").
		Pluck("profile_user_id", &userIDs).Error
	if err != nil {
		log.Println("Не удалось получить список пользователей:", err)
		return
	}

	for _, userID := range userIDs {
		_ = recalculateRatingForUser(db, userID)
	}
}

func recalculateRatingForUser(db *gorm.DB, userID uint) error {
	var total int64
	var count int64

	err := db.Model(&models.Review{}).
		Where("profile_user_id = ? AND is_frozen = false", userID).
		Count(&count).
		Select("SUM(rating)").Scan(&total).Error
	if err != nil {
		log.Printf("Ошибка подсчета рейтинга для пользователя %d: %v", userID, err)
		return err
	}
	if count == 0 {
		return nil
	}
	avg := float64(total) / float64(count)

	res := db.Model(&models.SpecialistProfile{}).
		Where("user_id = ?", userID).
		Update("rating", avg)

	if res.Error != nil {
		return res.Error
	}
	if res.RowsAffected > 0 {
		return nil // Специалист найден и обновлён
	}

	orgRes := db.Model(&models.OrganizationProfile{}).
		Where("user_id = ?", userID).
		Update("rating", avg)

	if orgRes.Error != nil {
		return orgRes.Error
	}
	if orgRes.RowsAffected == 0 {
		log.Printf("Пользователь %d не является ни специалистом, ни организацией", userID)
	}

	return nil
}
