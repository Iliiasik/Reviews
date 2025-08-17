package auth

import (
	"errors"
	"net/http"
	"reviews-back/database"
	"reviews-back/models"
	"reviews-back/validation"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
	"github.com/google/uuid"
	"golang.org/x/crypto/bcrypt"
	"reviews-back/error_types"
)

var (
	JwtKey          []byte
	AccessTokenExp  = 2 * time.Minute
	RefreshTokenExp = 7 * 24 * time.Hour
)

type Claims struct {
	UserID   uint   `json:"user_id"`
	Username string `json:"username"`
	Role     string `json:"role"`
	jwt.RegisteredClaims
}

//=========================================================
// Функции авторизации

func Login(c *gin.Context) {
	var req validation.LoginRequest
	if !validation.BindAndValidate(c, &req) {
		return
	}

	var user models.User
	if err := database.DB.Where("username = ?", req.Username).First(&user).Error; err != nil {
		c.Error(error_types.UnauthorizedError(error_types.CodeInvalidCredentials, "Неверный логин или пароль"))
		return
	}

	if !CheckPasswordHash(req.Password, user.PasswordHash) {
		c.Error(error_types.UnauthorizedError(error_types.CodeInvalidCredentials, "Неверный логин или пароль"))
		return
	}

	var confirmation models.Confirmation
	if err := database.DB.Where("user_id = ?", user.ID).First(&confirmation).Error; err == nil {
		if !confirmation.EmailConfirmed {
			c.Error(error_types.UnauthorizedError(error_types.CodeEmailNotConfirmed, "Подтвердите почту, чтобы войти в профиль"))
			return
		}
	}

	var role models.Role
	if err := database.DB.First(&role, user.RoleID).Error; err != nil {
		c.Error(error_types.NotFoundError(error_types.CodeRoleNotFound, "Роль"))
		return
	}

	if err := RevokeAllRefreshTokens(user.ID); err != nil {
		c.Error(err)
		return
	}

	access_token, err := GenerateJWT(user.ID, user.Username, role.Name)
	if err != nil {
		c.Error(err)
		return
	}

	refresh_token, err := GenerateRefreshToken(user.ID)
	if err != nil {
		c.Error(err)
		return
	}

	c.SetCookie("access_token", access_token, int(AccessTokenExp.Seconds()), "/", "", false, true)
	c.SetCookie("refresh_token", refresh_token, int(RefreshTokenExp.Seconds()), "/", "", false, true)

	c.JSON(http.StatusOK, gin.H{
		"access_token":  access_token,
		"refresh_token": refresh_token,
		"token_type":    "Bearer",
		"expires_in":    int(AccessTokenExp.Seconds()),
		"user_id":       user.ID,
		"username":      user.Username,
		"role":          role.Name,
	})
}

func Logout(c *gin.Context) {
	refreshToken, err := c.Cookie("refresh_token")
	if err == nil {
		_ = RevokeRefreshToken(refreshToken)
	} else {
		refreshToken = c.GetHeader("X-Refresh-Token")
		if refreshToken != "" {
			_ = RevokeRefreshToken(refreshToken)
		}
	}

	c.SetCookie("access_token", "", -1, "/", "", false, true)
	c.SetCookie("refresh_token", "", -1, "/", "", false, true)

	c.JSON(http.StatusOK, gin.H{"success": true, "message": "Вы успешно вышли из системы"})
}

//=========================================================
// Не придумал как назвать эту часть 🤑

func ValidateJWT(tokenStr string) (*Claims, *error_types.AppError) {
	token, err := jwt.ParseWithClaims(tokenStr, &Claims{}, func(token *jwt.Token) (interface{}, error) {
		return JwtKey, nil
	})

	if err != nil {
		if errors.Is(err, jwt.ErrTokenExpired) {
			return nil, error_types.UnauthorizedError(error_types.CodeTokenExpired, "Токен истёк")
		}
		return nil, error_types.UnauthorizedError(error_types.CodeTokenInvalid, "Недействительный токен")
	}

	if !token.Valid {
		return nil, error_types.UnauthorizedError(error_types.CodeTokenInvalid, "Недействительный токен")
	}

	claims, ok := token.Claims.(*Claims)
	if !ok {
		return nil, error_types.UnauthorizedError(error_types.CodeTokenInvalid, "Неверные claims")
	}

	return claims, nil
}

func GenerateJWT(userID uint, username string, role string) (string, *error_types.AppError) {
	expirationTime := time.Now().Add(AccessTokenExp)
	claims := &Claims{
		UserID:   userID,
		Username: username,
		Role:     role,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(expirationTime),
			IssuedAt:  jwt.NewNumericDate(time.Now()),
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	tokenString, err := token.SignedString(JwtKey)
	if err != nil {
		return "", error_types.InternalServerError(err).WithCode(error_types.CodeJWTGenerationError)
	}

	return tokenString, nil
}

func GenerateRefreshToken(userID uint) (string, *error_types.AppError) {
	token := uuid.New().String()

	refreshToken := models.RefreshToken{
		UserID:    userID,
		Token:     token,
		ExpiresAt: time.Now().Add(RefreshTokenExp),
	}

	if err := database.DB.Create(&refreshToken).Error; err != nil {
		return "", error_types.InternalServerError(err).WithCode(error_types.CodeRefreshTokenGenerationError)
	}

	return token, nil
}

//=========================================================
// Операции с паролями. Позже вынесу в отдельный контроллер

func HashPassword(password string) (string, *error_types.AppError) {
	bytes, err := bcrypt.GenerateFromPassword([]byte(password), 14)
	if err != nil {
		return "", error_types.InternalServerError(err).WithCode(error_types.CodePasswordHashError)
	}
	return string(bytes), nil
}

func CheckPasswordHash(password, hash string) bool {
	err := bcrypt.CompareHashAndPassword([]byte(hash), []byte(password))
	return err == nil
}

func ChangePassword(c *gin.Context) {
	var req validation.ChangePasswordRequest
	if !validation.BindAndValidate(c, &req) {
		return
	}

	accessToken, err := c.Cookie("access_token")
	if err != nil {
		authHeader := c.GetHeader("Authorization")
		if len(authHeader) > 7 && authHeader[:7] == "Bearer " {
			accessToken = authHeader[7:]
		} else {
			c.Error(error_types.UnauthorizedError(error_types.CodeUnauthorized, "Неавторизован"))
			return
		}
	}

	claims, appErr := ValidateJWT(accessToken)
	if appErr != nil {
		c.Error(appErr)
		return
	}

	var user models.User
	if err := database.DB.First(&user, claims.UserID).Error; err != nil {
		c.Error(error_types.NotFoundError(error_types.CodeUserNotFound, "Пользователь"))
		return
	}

	if !CheckPasswordHash(req.CurrentPassword, user.PasswordHash) {
		c.Error(error_types.UnauthorizedError(error_types.CodePasswordMismatch, "Неверный текущий пароль"))
		return
	}

	hashedPassword, appErr := HashPassword(req.NewPassword)
	if appErr != nil {
		c.Error(appErr)
		return
	}

	user.PasswordHash = hashedPassword
	if err := database.DB.Save(&user).Error; err != nil {
		c.Error(error_types.InternalServerError(err).WithCode(error_types.CodeDatabaseError))
		return
	}

	if err := RevokeAllRefreshTokens(user.ID); err != nil {
		c.Error(error_types.InternalServerError(err).WithCode(error_types.CodeRefreshTokenRevokeError))
		return
	}

	c.JSON(http.StatusOK, gin.H{"success": true, "message": "Пароль успешно изменён"})
}

//=========================================================
// Все функции для рефреш токена (кроме его генерации). Пока такая версия, позже постараюсь улучшить
// вынесу в отдельный контроллер

func Refresh(c *gin.Context) {
	refreshToken := getRefreshTokenFromRequest(c)
	if refreshToken == "" {
		c.Error(error_types.UnauthorizedError(
			error_types.CodeRefreshTokenRequired,
			"Refresh token не предоставлен",
		))
		return
	}

	tokenData, err := ValidateRefreshToken(refreshToken)
	if err != nil {
		c.Error(err)
		return
	}

	user, role, err := getUserAndRole(tokenData.UserID)
	if err != nil {
		c.Error(err)
		return
	}

	newAccessToken, newRefreshToken, err := generateNewTokens(user, role)
	if err != nil {
		c.Error(err)
		return
	}

	if err := RevokeRefreshToken(refreshToken); err != nil {
		c.Error(err)
		return
	}

	setAuthCookies(c, newAccessToken, newRefreshToken)
	sendTokenResponse(c, newAccessToken, newRefreshToken)
}

func getRefreshTokenFromRequest(c *gin.Context) string {
	if cookie, err := c.Cookie("refresh_token"); err == nil {
		return cookie
	}
	return c.GetHeader("X-Refresh-Token")
}

func getUserAndRole(userID uint) (*models.User, *models.Role, *error_types.AppError) {
	var user models.User
	if err := database.DB.First(&user, userID).Error; err != nil {
		return nil, nil, error_types.NotFoundError(
			error_types.CodeUserNotFound,
			"Пользователь не найден",
		).WithInternal(err)
	}

	var role models.Role
	if err := database.DB.First(&role, user.RoleID).Error; err != nil {
		return nil, nil, error_types.NotFoundError(
			error_types.CodeRoleNotFound,
			"Роль не найдена",
		).WithInternal(err)
	}

	return &user, &role, nil
}

func generateNewTokens(user *models.User, role *models.Role) (string, string, *error_types.AppError) {
	accessToken, err := GenerateJWT(user.ID, user.Username, role.Name)
	if err != nil {
		return "", "", err
	}

	refreshToken, err := GenerateRefreshToken(user.ID)
	if err != nil {
		return "", "", err
	}

	return accessToken, refreshToken, nil
}

func setAuthCookies(c *gin.Context, accessToken, refreshToken string) {
	c.SetCookie("access_token", accessToken, int(AccessTokenExp.Seconds()), "/", "", false, true)
	c.SetCookie("refresh_token", refreshToken, int(RefreshTokenExp.Seconds()), "/", "", false, true)
}

func sendTokenResponse(c *gin.Context, accessToken, refreshToken string) {
	c.JSON(http.StatusOK, gin.H{
		"access_token":  accessToken,
		"refresh_token": refreshToken,
		"token_type":    "Bearer",
		"expires_in":    int(AccessTokenExp.Seconds()),
	})
}

func ValidateRefreshToken(token string) (*models.RefreshToken, *error_types.AppError) {
	var refreshToken models.RefreshToken

	if token == "" {
		return nil, error_types.UnauthorizedError(error_types.CodeRefreshTokenInvalid, "Пустой refresh token")
	}

	if err := database.DB.Where("token = ?", token).First(&refreshToken).Error; err != nil {
		return nil, error_types.UnauthorizedError(error_types.CodeRefreshTokenInvalid, "Refresh token не найден")
	}

	if time.Now().After(refreshToken.ExpiresAt) {
		return nil, error_types.UnauthorizedError(error_types.CodeRefreshTokenExpired, "Refresh token истёк")
	}

	return &refreshToken, nil
}

func RevokeRefreshToken(token string) *error_types.AppError {
	if err := database.DB.Where("token = ?", token).Delete(&models.RefreshToken{}).Error; err != nil {
		return error_types.InternalServerError(err).WithCode(error_types.CodeRefreshTokenRevokeError)
	}
	return nil
}

func RevokeAllRefreshTokens(userID uint) *error_types.AppError {
	if err := database.DB.Where("user_id = ?", userID).Delete(&models.RefreshToken{}).Error; err != nil {
		return error_types.InternalServerError(err).WithCode(error_types.CodeRefreshTokenRevokeError)
	}
	return nil
}
