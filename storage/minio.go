package storage

import (
	"context"
	"fmt"
	"github.com/minio/minio-go/v7"
	"github.com/minio/minio-go/v7/pkg/credentials"
	"log"
	"os"
)

var (
	MinioClient    *minio.Client
	MinioPublicURL string
	BucketName     = "user-media"
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

// Отключенные функции

//const (
//	presignedExpiry = time.Hour * 24 * 7
//)
// DeleteAvatar удаляет аватар пользователя
//func DeleteAvatar(userType UserType, userID uint) error {
//	if MinioClient == nil {
//		return fmt.Errorf("MinIO клиент не инициализирован")
//	}
//
//	// Пытаемся удалить все возможные форматы
//	formats := []string{".jpg", ".jpeg", ".png"}
//	for _, ext := range formats {
//		objectName := fmt.Sprintf("%s/%d/avatar%s", userType, userID, ext)
//		err := MinioClient.RemoveObject(context.Background(), BucketName, objectName, minio.RemoveObjectOptions{})
//		if err != nil {
//			if minio.ToErrorResponse(err).Code != "NoSuchKey" {
//				return fmt.Errorf("ошибка при удалении аватара: %v", err)
//			}
//		}
//	}
//
//	return nil
//}
//
//// GenerateAvatarUploadURL генерирует URL для загрузки аватара
//func GenerateAvatarUploadURL(userType UserType, userID uint, filename string) (string, error) {
//	if MinioClient == nil {
//		return "", fmt.Errorf("MinIO клиент не инициализирован")
//	}
//
//	// Проверяем расширение файла
//	ext := filepath.Ext(filename)
//	if ext != ".jpg" && ext != ".jpeg" && ext != ".png" {
//		return "", fmt.Errorf("неподдерживаемый формат изображения")
//	}
//
//	objectName := fmt.Sprintf("%s/%d/avatar%s", userType, userID, ext)
//
//	url, err := MinioClient.PresignedPutObject(context.Background(), BucketName, objectName, presignedExpiry)
//	if err != nil {
//		return "", fmt.Errorf("ошибка при генерации URL для загрузки: %v", err)
//	}
//
//	return url.String(), nil
//}
