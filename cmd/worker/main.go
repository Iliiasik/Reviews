package main

import (
	"fmt"
	"log"
	"os"

	"github.com/hibiken/asynq"
	"github.com/joho/godotenv"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"

	"reviews-back/tasks"
)

func main() {
	if err := godotenv.Load(); err != nil {
		log.Println(" .env файл не найден")
	}
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
	if dsn == "" {
		log.Fatal("DATABASE_DSN не задан")
	}

	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatalf("Не удалось подключиться к базе данных: %v", err)
	}

	redisAddr := os.Getenv("REDIS_ADDR")
	if redisAddr == "" {
		redisAddr = "localhost:6379"
	}
	log.Printf("Подключение к Redis на %s ...", redisAddr)
	srv := asynq.NewServer(
		asynq.RedisClientOpt{Addr: redisAddr},
		asynq.Config{
			Concurrency: 10,
			Queues: map[string]int{
				"ratings": 5,
			},
		},
	)

	mux := asynq.NewServeMux()
	mux.HandleFunc(tasks.TypeUpdateRating, tasks.NewRatingUpdateHandler(db))

	log.Println("Воркер Asynq запущен и слушает задачи...")
	if err := srv.Run(mux); err != nil {
		log.Fatalf("Ошибка запуска воркера: %v", err)
	}
}
