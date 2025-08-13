package init

import (
	"context"
	"github.com/casbin/casbin/v2"
	"github.com/elastic/go-elasticsearch/v8"
	"github.com/hibiken/asynq"
	"gorm.io/gorm"
	"log"
	"reviews-back/config"
	"reviews-back/controllers/auth"
	"reviews-back/controllers/search"
	"reviews-back/cron"
	"reviews-back/database"
	"reviews-back/rbac"
)

// Инициализация всех сервисов (minio, redis, cron, db..)
// Подключение происходит в main

type Services struct {
	DB          *gorm.DB
	ES          *elasticsearch.Client
	AsynqClient *asynq.Client
	Enforcer    *casbin.Enforcer
}

func InitServices() *Services {
	database.InitDB()

	auth.JwtKey = []byte(config.GetEnv("JWT_SECRET"))
	if len(auth.JwtKey) == 0 {
		log.Fatal("JWT_SECRET is not set in .env")
	}

	esClient, err := search.InitES()
	if err != nil {
		log.Printf("Elasticsearch не доступен: %v. Работаем в fallback режиме.", err)
	} else {
		ctx := context.Background()
		if err := search.LoadDataToES(ctx, esClient, database.DB); err != nil {
			log.Printf("Ошибка загрузки данных в Elasticsearch: %v.", err)
		}
	}

	cron.StartRatingCron(database.DB)

	//storage.InitMinio()

	var asynqClient *asynq.Client
	if redisAddr := config.GetEnv("REDIS_ADDR"); redisAddr != "" {
		asynqClient = asynq.NewClient(asynq.RedisClientOpt{Addr: redisAddr})
	}

	enforcer, err := rbac.NewEnforcer(database.DB)
	if err != nil {
		log.Fatalf("Failed to initialize Casbin: %v", err)
	}

	return &Services{
		DB:          database.DB,
		ES:          esClient,
		AsynqClient: asynqClient,
		Enforcer:    enforcer,
	}
}
