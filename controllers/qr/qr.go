package qr

import (
	"fmt"
	"github.com/gin-gonic/gin"
	"github.com/skip2/go-qrcode"
	"net/http"
)

func GenerateQR(c *gin.Context) {
	userID := c.MustGet("user_id").(uint)

	// Генерация QR с ID пользователя
	qrContent := fmt.Sprintf("user:%d", userID)
	png, err := qrcode.Encode(qrContent, qrcode.Medium, 256)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Ошибка генерации QR-кода"})
		return
	}

	c.Data(http.StatusOK, "image/png", png)
}
