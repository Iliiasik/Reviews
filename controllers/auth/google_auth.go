package auth

import (
	"context"
	"fmt"
	"net/http"
	"os"
	"reviews-back/database"
	"reviews-back/models"

	"github.com/gin-gonic/gin"
	"golang.org/x/oauth2"
	"golang.org/x/oauth2/google"
	googleapi "google.golang.org/api/oauth2/v2"
)

func getGoogleOAuthConfig() *oauth2.Config {
	return &oauth2.Config{
		ClientID:     os.Getenv("GOOGLE_CLIENT_ID"),
		ClientSecret: os.Getenv("GOOGLE_CLIENT_SECRET"),
		RedirectURL:  "http://localhost:8000/api/auth/google/callback",
		Scopes: []string{
			"https://www.googleapis.com/auth/userinfo.email",
			"https://www.googleapis.com/auth/userinfo.profile",
		},
		Endpoint: google.Endpoint,
	}
}

func GoogleLogin(c *gin.Context) {
	conf := getGoogleOAuthConfig()
	fmt.Println("ClientID?", conf.ClientID)
	url := conf.AuthCodeURL("random-state")
	c.Redirect(http.StatusTemporaryRedirect, url)
}

func GoogleCallback(c *gin.Context) {
	conf := getGoogleOAuthConfig()

	code := c.Query("code")
	fmt.Println("Получен code из Google:", code)

	token, err := conf.Exchange(context.Background(), code)
	if err != nil {
		fmt.Println("Ошибка обмена кода на токен:", err)
		c.JSON(http.StatusBadRequest, gin.H{"error": "Ошибка токена"})
		return
	}
	fmt.Println("OAuth токен получен:", token.AccessToken)

	client := conf.Client(context.Background(), token)
	service, err := googleapi.New(client)
	if err != nil {
		fmt.Println("Ошибка инициализации Google API:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Ошибка API Google"})
		return
	}

	info, err := service.Userinfo.Get().Do()
	if err != nil {
		fmt.Println("Ошибка получения userinfo:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Ошибка получения данных"})
		return
	}
	fmt.Printf("UserInfo от Google: %+v\n", info)

	// проверка пользователя по email
	var user models.User
	result := database.DB.Where("email = ?", info.Email).First(&user)

	if result.Error != nil {
		fmt.Println("Пользователь не найден, создаём нового")
		var role models.Role
		if err := database.DB.Where("name = ?", "user").First(&role).Error; err != nil {
			fmt.Println("Ошибка получения роли user:", err)
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Не найдена роль по умолчанию"})
			return
		}

		username := info.Email
		if len(username) > 20 {
			username = username[:20]
		}
		user = models.User{
			Name:         info.Name,
			Email:        info.Email,
			Username:     username,
			PasswordHash: "Oauth",
			RoleID:       role.ID,
		}

		if err := database.DB.Create(&user).Error; err != nil {
			fmt.Println("Ошибка создания пользователя:", err)
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Ошибка создания пользователя"})
			return
		}
	} else {
		fmt.Println("Пользователь уже существует:", user.Username)
	}

	jwt, err := GenerateJWT(user.ID, user.Username)
	if err != nil {
		fmt.Println("Ошибка генерации JWT:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Ошибка JWT"})
		return
	}
	fmt.Println("JWT сгенерирован:", jwt)

	c.SetCookie("token", jwt, 3600*24, "/", "localhost", false, true)
	fmt.Println("Кука token установлена")

	c.Redirect(http.StatusTemporaryRedirect, "http://localhost:5173/profile")
	fmt.Println("Редирект на профиль завершён")
}
