package storage

import (
	"context"
	"github.com/minio/minio-go/v7"
	"github.com/minio/minio-go/v7/pkg/credentials"
	"log"
	"os"
)

var (
	MinioClient    *minio.Client
	MinioPublicURL string
	bucketName     = "user-media"
	location       = "us-east-1"
)

func InitMinio() {
	endpoint := os.Getenv("MINIO_ENDPOINT")
	accessKeyID := os.Getenv("MINIO_ACCESS_KEY")
	secretAccessKey := os.Getenv("MINIO_SECRET_KEY")
	useSSL := os.Getenv("MINIO_USE_SSL") == "true"

	if endpoint == "" || accessKeyID == "" || secretAccessKey == "" {
		log.Fatal("Не заданы переменные окружения для MinIO")
	}

	client, err := minio.New(endpoint, &minio.Options{
		Creds:  credentials.NewStaticV4(accessKeyID, secretAccessKey, ""),
		Secure: useSSL,
	})
	if err != nil {
		log.Fatalf("Ошибка подключения к MinIO: %v", err)
	}
	MinioClient = client
	MinioPublicURL = endpoint

	exists, err := client.BucketExists(context.Background(), bucketName)
	if err != nil {
		log.Fatalf("Ошибка при проверке bucket: %v", err)
	}
	if !exists {
		err = client.MakeBucket(context.Background(), bucketName, minio.MakeBucketOptions{Region: location})
		if err != nil {
			log.Fatalf("Не удалось создать bucket: %v", err)
		}
	}
	log.Println("MinIO инициализирован")
}
