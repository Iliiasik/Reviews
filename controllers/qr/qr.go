package qr

import (
	"bytes"
	"fmt"
	"image"
	"image/color"
	"image/png"
	"net/http"
	"os"
	"strings"

	"github.com/fogleman/gg"
	"github.com/gin-gonic/gin"
	qrcode "github.com/skip2/go-qrcode"
	"golang.org/x/image/draw"
	"gorm.io/gorm"
	"reviews-back/models"
)

func GenerateQR(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		userID := c.MustGet("user_id").(uint)

		var user models.User
		if err := db.Preload("Role").First(&user, userID).Error; err != nil {
			c.JSON(http.StatusNotFound, gin.H{"error": "Пользователь не найден"})
			return
		}

		roleName := strings.ToLower(user.Role.Name)
		url := fmt.Sprintf("http://localhost:5173/%s/%d/add-review", roleName, user.ID)

		qr, err := qrcode.New(url, qrcode.Low)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Ошибка создания QR"})
			return
		}
		qr.DisableBorder = true

		const (
			canvasSize   = 800
			moduleSize   = 20
			overlapShift = 1
		)

		dc := gg.NewContext(canvasSize, canvasSize)

		cornerRadius := 100.0
		bgMargin := 30.0
		bgWidth := float64(canvasSize) - 2*bgMargin
		bgHeight := float64(canvasSize) - 2*bgMargin

		grad := gg.NewLinearGradient(bgMargin, bgMargin, bgMargin+bgWidth, bgMargin+bgHeight)
		grad.AddColorStop(0, color.RGBA{150, 230, 255, 255})
		grad.AddColorStop(1, color.RGBA{150, 255, 230, 255})

		dc.SetFillStyle(grad)
		dc.DrawRoundedRectangle(bgMargin, bgMargin, bgWidth, bgHeight, cornerRadius)
		dc.Fill()

		bitmap := qr.Bitmap()
		rows := len(bitmap)
		cols := len(bitmap[0])

		qrWidth := cols*moduleSize - overlapShift*(cols-1)
		qrHeight := rows*moduleSize - overlapShift*(rows-1)
		offsetX := (canvasSize - qrWidth) / 2
		offsetY := (canvasSize - qrHeight) / 2

		dc.SetColor(color.Black)
		radius := float64(moduleSize) * 0.3

		for y := 0; y < rows; y++ {
			x := 0
			for x < cols {
				if bitmap[y][x] {
					startX := x
					for x < cols && bitmap[y][x] {
						x++
					}
					length := x - startX

					px := float64(offsetX + startX*(moduleSize-overlapShift))
					py := float64(offsetY + y*(moduleSize-overlapShift))
					width := float64(length*moduleSize - (length-1)*overlapShift)
					height := float64(moduleSize)

					dc.DrawRoundedRectangle(px, py, width, height, radius)
					dc.Fill()
				} else {
					x++
				}
			}
		}

		for x := 0; x < cols; x++ {
			y := 0
			for y < rows {
				if bitmap[y][x] {
					startY := y
					for y < rows && bitmap[y][x] {
						y++
					}
					length := y - startY

					px := float64(offsetX + x*(moduleSize-overlapShift))
					py := float64(offsetY + startY*(moduleSize-overlapShift))
					width := float64(moduleSize)
					height := float64(length*moduleSize - (length-1)*overlapShift)

					dc.DrawRoundedRectangle(px, py, width, height, radius)
					dc.Fill()
				} else {
					y++
				}
			}
		}

		logoPath := "assets/logo.png"
		if _, err := os.Stat(logoPath); err == nil {
			logoFile, err := os.Open(logoPath)
			if err == nil {
				defer logoFile.Close()
				logoImg, _, err := image.Decode(logoFile)
				if err == nil {
					logoSize := 100
					logoRect := image.Rect(0, 0, logoSize, logoSize)
					resizedLogo := image.NewRGBA(logoRect)

					draw.ApproxBiLinear.Scale(
						resizedLogo, logoRect,
						logoImg, logoImg.Bounds(),
						draw.Over, nil,
					)

					logoX := canvasSize/2 - logoSize/2
					logoY := canvasSize/2 - logoSize/2
					dc.DrawImage(resizedLogo, logoX, logoY)
				}
			}
		}

		buf := new(bytes.Buffer)
		if err := png.Encode(buf, dc.Image()); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Ошибка кодирования изображения"})
			return
		}

		c.Data(http.StatusOK, "image/png", buf.Bytes())
	}
}
