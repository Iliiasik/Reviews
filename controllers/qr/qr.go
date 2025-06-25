package qr

import (
	"fmt"
	"github.com/gin-gonic/gin"
	"github.com/skip2/go-qrcode"
	"net/http"
)

func GenerateQR(c *gin.Context) {
	userID := c.MustGet("user_id").(uint)
	userRole := c.MustGet("user_role").(string)

	// Проверяем, что роль позволяет генерировать QR
	if userRole != "specialist" && userRole != "organization" && userRole != "admin" {
		c.JSON(http.StatusForbidden, gin.H{"error": "Ваша роль не позволяет генерировать QR-коды"})
		return
	}

	// Генерация QR с ID пользователя
	qrContent := fmt.Sprintf("user:%d", userID)
	png, err := qrcode.Encode(qrContent, qrcode.Medium, 256)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Ошибка генерации QR-кода"})
		return
	}

	c.Data(http.StatusOK, "image/png", png)
}
