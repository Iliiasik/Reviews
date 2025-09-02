package routes

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/qor5/web/v3"
	"reviews-back/admin"
)

func RegisterAdminRoutes(r *gin.Engine) {
	adminHandler := admin.Initialize()

	adminGroup := r.Group("/api/admin")
	{
		adminGroup.GET("/packs/*filepath", gin.WrapH(web.PacksHandler(string(web.JSComponentsPack()))))

		panelGroup := adminGroup.Group("/panel")
		{
			panelGroup.GET("", gin.WrapH(adminHandler))
			panelGroup.Any("/*path", gin.WrapH(adminHandler))
		}

		adminGroup.GET("/", func(c *gin.Context) {
			if c.Request.URL.Path == "/api/admin" || c.Request.URL.Path == "/api/admin/" {
				c.Redirect(http.StatusFound, "/api/admin/panel/")
			} else {
				c.Next()
			}
		})
	}
}
