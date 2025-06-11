package controllers

import (
	"fmt"
	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
	"golang.org/x/crypto/bcrypt"
	"net/http"
)

var JwtKey []byte

type Claims struct {
	UserID   uint   `json:"employee_id"`
	Username string `json:"username"`
	jwt.RegisteredClaims
}

func ValidateJWT(tokenStr string) (*Claims, error) {
	token, err := jwt.ParseWithClaims(tokenStr, &Claims{}, func(token *jwt.Token) (interface{}, error) {
		return JwtKey, nil
	})

	if err != nil || !token.Valid {
		return nil, err
	}

	claims, ok := token.Claims.(*Claims)
	if !ok {
		return nil, fmt.Errorf("incorrect claims")
	}

	return claims, nil
}

func HashPassword(password string) (string, error) {
	bytes, err := bcrypt.GenerateFromPassword([]byte(password), 14)
	return string(bytes), err
}

func CheckPasswordHash(password, hash string) bool {
	err := bcrypt.CompareHashAndPassword([]byte(hash), []byte(password))
	return err == nil
}

func Logout(c *gin.Context) {
	c.SetCookie("token", "", -1, "/", "localhost", false, true)

	c.JSON(http.StatusOK, gin.H{"success": true, "message": "Вы успешно вышли из системы"})
}
