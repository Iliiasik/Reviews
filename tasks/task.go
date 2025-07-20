package tasks

import (
	"context"
	"encoding/json"
	"github.com/hibiken/asynq"
	"gorm.io/gorm"
	"log"
	"reviews-back/models"
)

// Имя типа задачи
const TypeUpdateRating = "update:rating"

type RatingUpdatePayload struct {
	UserID uint `json:"user_id"`
}

// Отправка задачи в очередь (вызывается при создании/обновлении отзыва)
func EnqueueRatingUpdateTask(client *asynq.Client, userID uint) error {
	payload, err := json.Marshal(RatingUpdatePayload{UserID: userID})
	if err != nil {
		return err
	}
	task := asynq.NewTask(TypeUpdateRating, payload)
	_, err = client.Enqueue(task, asynq.Queue("ratings"))
	return err
}

// Обработчик задачи — вызывается воркером
func NewRatingUpdateHandler(db *gorm.DB) asynq.HandlerFunc {
	return func(ctx context.Context, t *asynq.Task) error {
		var p RatingUpdatePayload
		if err := json.Unmarshal(t.Payload(), &p); err != nil {
			return err
		}
		log.Printf("[TASK] Обновляем рейтинг пользователя %d", p.UserID)
		return recalculateRatingForUser(db, p.UserID)
	}
}

// Функция пересчёта рейтинга
func recalculateRatingForUser(db *gorm.DB, userID uint) error {
	var total int64
	var count int64

	err := db.Model(&models.Review{}).
		Where("profile_user_id = ? AND is_frozen = false", userID).
		Count(&count).Error
	if err != nil {
		return err
	}
	if count == 0 {
		return nil
	}

	err = db.Model(&models.Review{}).
		Where("profile_user_id = ? AND is_frozen = false", userID).
		Select("SUM(rating)").Scan(&total).Error
	if err != nil {
		return err
	}

	avg := float64(total) / float64(count)

	res := db.Model(&models.SpecialistProfile{}).
		Where("user_id = ?", userID).
		Update("rating", avg)
	if res.Error != nil {
		return res.Error
	}
	if res.RowsAffected > 0 {
		return nil
	}

	orgRes := db.Model(&models.OrganizationProfile{}).
		Where("user_id = ?", userID).
		Update("rating", avg)
	if orgRes.Error != nil {
		return orgRes.Error
	}
	if orgRes.RowsAffected == 0 {
		log.Printf(" Пользователь %d не специалист и не организация", userID)
	}

	return nil
}
