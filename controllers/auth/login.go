package auth

import (
	"net/http"
	"reviews-back/database"
	"reviews-back/models"
	"reviews-back/validation"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
	"github.com/google/uuid"
	"golang.org/x/crypto/bcrypt"
	"reviews-back/errors"
)

var (
	JwtKey          []byte
	AccessTokenExp  = 15 * time.Minute
	RefreshTokenExp = 7 * 24 * time.Hour
)

type Claims struct {
	UserID   uint   `json:"user_id"`
	Username string `json:"username"`
	Role     string `json:"role"`
	jwt.RegisteredClaims
}

func ValidateJWT(tokenStr string) (*Claims, *errors.AppError) {
	token, err := jwt.ParseWithClaims(tokenStr, &Claims{}, func(token *jwt.Token) (interface{}, error) {
		return JwtKey, nil
	})

	if err != nil {
		if err == jwt.ErrTokenExpired {
			return nil, errors.UnauthorizedError(errors.CodeTokenExpired, "Токен истёк")
		}
		return nil, errors.UnauthorizedError(errors.CodeTokenInvalid, "Недействительный токен")
	}

	if !token.Valid {
		return nil, errors.UnauthorizedError(errors.CodeTokenInvalid, "Недействительный токен")
	}

	claims, ok := token.Claims.(*Claims)
	if !ok {
		return nil, errors.UnauthorizedError(errors.CodeTokenInvalid, "Неверные claims")
	}

	return claims, nil
}

func GenerateJWT(userID uint, username string, role string) (string, *errors.AppError) {
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
		return "", errors.InternalServerError(err).WithCode(errors.CodeJWTGenerationError)
	}

	return tokenString, nil
}

func GenerateRefreshToken(userID uint) (string, *errors.AppError) {
	token := uuid.New().String()

	refreshToken := models.RefreshToken{
		UserID:    userID,
		Token:     token,
		ExpiresAt: time.Now().Add(RefreshTokenExp),
	}

	if err := database.DB.Create(&refreshToken).Error; err != nil {
		return "", errors.InternalServerError(err).WithCode(errors.CodeRefreshTokenGenerationError)
	}

	return token, nil
}

func ValidateRefreshToken(token string) (*models.RefreshToken, *errors.AppError) {
	var refreshToken models.RefreshToken
	if err := database.DB.Where("token = ? AND expires_at > ?", token, time.Now()).First(&refreshToken).Error; err != nil {
		return nil, errors.UnauthorizedError(errors.CodeRefreshTokenInvalid, "Недействительный refresh токен")
	}

	return &refreshToken, nil
}

func RevokeRefreshToken(token string) *errors.AppError {
	if err := database.DB.Where("token = ?", token).Delete(&models.RefreshToken{}).Error; err != nil {
		return errors.InternalServerError(err).WithCode(errors.CodeRefreshTokenRevokeError)
	}
	return nil
}

func RevokeAllRefreshTokens(userID uint) *errors.AppError {
	if err := database.DB.Where("user_id = ?", userID).Delete(&models.RefreshToken{}).Error; err != nil {
		return errors.InternalServerError(err).WithCode(errors.CodeRefreshTokenRevokeError)
	}
	return nil
}

func HashPassword(password string) (string, *errors.AppError) {
	bytes, err := bcrypt.GenerateFromPassword([]byte(password), 14)
	if err != nil {
		return "", errors.InternalServerError(err).WithCode(errors.CodePasswordHashError)
	}
	return string(bytes), nil
}

func CheckPasswordHash(password, hash string) bool {
	err := bcrypt.CompareHashAndPassword([]byte(hash), []byte(password))
	return err == nil
}

func Login(c *gin.Context) {
	var req validation.LoginRequest
	if !validation.BindAndValidate(c, &req) {
		return
	}

	var user models.User
	if err := database.DB.Where("username = ?", req.Username).First(&user).Error; err != nil {
		c.Error(errors.UnauthorizedError(errors.CodeInvalidCredentials, "Неверный логин или пароль"))
		return
	}

	if !CheckPasswordHash(req.Password, user.PasswordHash) {
		c.Error(errors.UnauthorizedError(errors.CodeInvalidCredentials, "Неверный логин или пароль"))
		return
	}

	var confirmation models.Confirmation
	if err := database.DB.Where("user_id = ?", user.ID).First(&confirmation).Error; err == nil {
		if !confirmation.EmailConfirmed {
			c.Error(errors.UnauthorizedError(errors.CodeEmailNotConfirmed, "Подтвердите почту, чтобы войти в профиль"))
			return
		}
	}

	var role models.Role
	if err := database.DB.First(&role, user.RoleID).Error; err != nil {
		c.Error(errors.NotFoundError(errors.CodeRoleNotFound, "Роль"))
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

func Refresh(c *gin.Context) {
	refreshToken, err := c.Cookie("refresh_token")
	if err != nil {
		refreshToken = c.GetHeader("X-Refresh-Token")
		if refreshToken == "" {
			c.Error(errors.UnauthorizedError(errors.CodeRefreshTokenRequired, "Refresh token не предоставлен"))
			return
		}
	}

	tokenData, err := ValidateRefreshToken(refreshToken)
	if err != nil {
		c.Error(err)
		return
	}

	var user models.User
	if err := database.DB.First(&user, tokenData.UserID).Error; err != nil {
		c.Error(errors.NotFoundError(errors.CodeUserNotFound, "Пользователь"))
		return
	}

	var role models.Role
	if err := database.DB.First(&role, user.RoleID).Error; err != nil {
		c.Error(errors.NotFoundError(errors.CodeRoleNotFound, "Роль"))
		return
	}

	newAccessToken, err := GenerateJWT(user.ID, user.Username, role.Name)
	if err != nil {
		c.Error(err)
		return
	}

	if err := RevokeRefreshToken(refreshToken); err != nil {
		c.Error(err)
		return
	}

	newRefreshToken, err := GenerateRefreshToken(user.ID)
	if err != nil {
		c.Error(err)
		return
	}

	c.SetCookie("access_token", newAccessToken, int(AccessTokenExp.Seconds()), "/", "", false, true)
	c.SetCookie("refresh_token", newRefreshToken, int(RefreshTokenExp.Seconds()), "/", "", false, true)

	c.JSON(http.StatusOK, gin.H{
		"access_token":  newAccessToken,
		"refresh_token": newRefreshToken,
		"token_type":    "Bearer",
		"expires_in":    int(AccessTokenExp.Seconds()),
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
			c.Error(errors.UnauthorizedError(errors.CodeUnauthorized, "Неавторизован"))
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
		c.Error(errors.NotFoundError(errors.CodeUserNotFound, "Пользователь"))
		return
	}

	if !CheckPasswordHash(req.CurrentPassword, user.PasswordHash) {
		c.Error(errors.UnauthorizedError(errors.CodePasswordMismatch, "Неверный текущий пароль"))
		return
	}

	hashedPassword, appErr := HashPassword(req.NewPassword)
	if appErr != nil {
		c.Error(appErr)
		return
	}

	user.PasswordHash = hashedPassword
	if err := database.DB.Save(&user).Error; err != nil {
		c.Error(errors.InternalServerError(err).WithCode(errors.CodeDatabaseError))
		return
	}

	if err := RevokeAllRefreshTokens(user.ID); err != nil {
		c.Error(errors.InternalServerError(err).WithCode(errors.CodeRefreshTokenRevokeError))
		return
	}

	c.JSON(http.StatusOK, gin.H{"success": true, "message": "Пароль успешно изменён"})
}
