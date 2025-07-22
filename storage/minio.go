package storage

import (
	"context"
	"fmt"
	"github.com/minio/minio-go/v7"
	"github.com/minio/minio-go/v7/pkg/credentials"
	"log"
	"os"
)

// посложнее надо поставить бакет
var (
	MinioClient    *minio.Client
	MinioPublicURL string
	BucketName     = "jDnks1nkf2nDkKddn23jjffrwsdfvWifnsd"
	location       = "us-east-1"
)

type UserType string

const (
	UserTypeUser         UserType = "users"
	UserTypeSpecialist   UserType = "specialists"
	UserTypeOrganization UserType = "organizations"
)

func InitMinio() {
	endpoint := os.Getenv("MINIO_ENDPOINT")
	accessKeyID := os.Getenv("MINIO_ACCESS_KEY")
	secretAccessKey := os.Getenv("MINIO_SECRET_KEY")
	useSSL := os.Getenv("MINIO_USE_SSL") == "true"
	publicURL := os.Getenv("MINIO_PUBLIC_URL")

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
	MinioPublicURL = publicURL

	ctx := context.Background()

	exists, err := client.BucketExists(ctx, BucketName)
	if err != nil {
		log.Fatalf("Ошибка при проверке bucket: %v", err)
	}
	if !exists {
		err = client.MakeBucket(ctx, BucketName, minio.MakeBucketOptions{Region: location})
		if err != nil {
			log.Fatalf("Не удалось создать bucket: %v", err)
		}

		policy := `{
			"Version": "2012-10-17",
			"Statement": [
				{
					"Effect": "Allow",
					"Principal": {"AWS": ["*"]},
					"Action": ["s3:GetObject"],
					"Resource": ["arn:aws:s3:::` + BucketName + `/*"]
				}
			]
		}`

		if err := client.SetBucketPolicy(ctx, BucketName, policy); err != nil {
			log.Printf("Предупреждение: не удалось установить политику bucket: %v", err)
		}
	}
	log.Println("MinIO инициализирован")
}

func GetAvatarURL(userType UserType, userID uint, ext string) string {
	if MinioPublicURL == "" {
		return ""
	}

	objectName := fmt.Sprintf("%s/%d/avatar%s", userType, userID, ext)
	return fmt.Sprintf("%s/%s/%s", MinioPublicURL, BucketName, objectName)
}
