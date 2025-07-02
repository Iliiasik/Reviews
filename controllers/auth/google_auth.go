package auth

import (
	"context"
	"net/http"
	"os"
	"reviews-back/database"
	"reviews-back/errors"
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
	url := conf.AuthCodeURL("random-state")
	c.Redirect(http.StatusTemporaryRedirect, url)
}

func GoogleCallback(c *gin.Context) {
	conf := getGoogleOAuthConfig()

	code := c.Query("code")
	if code == "" {
		c.Error(errors.UnauthorizedError(errors.CodeTokenInvalid, "Не получен код от Google"))
		return
	}

	token, err := conf.Exchange(context.Background(), code)
	if err != nil {
		c.Error(errors.UnauthorizedError(errors.CodeTokenInvalid, "Ошибка обмена кода на токен").WithInternal(err))
		return
	}

	client := conf.Client(context.Background(), token)
	service, err := googleapi.New(client)
	if err != nil {
		c.Error(errors.InternalServerError(err).WithCode(errors.CodeInternalServerError))
		return
	}

	info, err := service.Userinfo.Get().Do()
	if err != nil {
		c.Error(errors.InternalServerError(err).WithCode(errors.CodeInternalServerError))
		return
	}

	var user models.User
	result := database.DB.Preload("Role").Where("email = ?", info.Email).First(&user)

	if result.Error != nil {
		var role models.Role
		if err := database.DB.Where("name = ?", "user").First(&role).Error; err != nil {
			c.Error(errors.NotFoundError(errors.CodeRoleNotFound, "Роль").WithInternal(err))
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
			Role:         role,
		}

		if err := database.DB.Create(&user).Error; err != nil {
			c.Error(errors.InternalServerError(err).WithCode(errors.CodeDatabaseError))
			return
		}
	}

	if err := RevokeAllRefreshTokens(user.ID); err != nil {
		c.Error(err)
		return
	}

	accessToken, appErr := GenerateJWT(user.ID, user.Username, user.Role.Name)
	if appErr != nil {
		c.Error(appErr)
		return
	}

	refreshToken, appErr := GenerateRefreshToken(user.ID)
	if appErr != nil {
		c.Error(appErr)
		return
	}

	c.SetCookie("access_token", accessToken, int(AccessTokenExp.Seconds()), "/", "localhost", false, true)
	c.SetCookie("refresh_token", refreshToken, int(RefreshTokenExp.Seconds()), "/", "localhost", false, true)

	c.Redirect(http.StatusTemporaryRedirect, "http://localhost:5173/profile")
}
