package admin_panel

import (
	"net/http"

	"github.com/qor5/admin/v3/presets"
	"github.com/qor5/admin/v3/presets/gorm2op"
	"github.com/qor5/web/v3"
	"github.com/theplant/htmlgo"
	"reviews-back/models"
)

func Initialize() http.Handler {
	db := ConnectDB()
	b := presets.New()

	b.URIPrefix("/api/admin/panel").
		BrandTitle("Панель управления").
		DataOperator(gorm2op.DataOperator(db)).
		HomePageFunc(func(ctx *web.EventContext) (r web.PageResponse, err error) {
			r.Body = htmlgo.Div(
				htmlgo.H1("Административная панель"),
				htmlgo.P().Text("Управление системой отзывов"),
			)
			return
		})

	b.Model(&models.Role{}).Label("Роли").MenuIcon("mdi-account-key")
	b.Model(&models.User{}).Label("Пользователи").MenuIcon("mdi-account-group")
	b.Model(&models.SpecialistProfile{}).Label("Специалисты").MenuIcon("mdi-badge-account")
	b.Model(&models.OrganizationProfile{}).Label("Организации").MenuIcon("mdi-domain")
	b.Model(&models.Confirmation{}).Label("Подтверждения").MenuIcon("mdi-check-decagram")
	b.Model(&models.ReportCategory{}).Label("Категории жалоб").MenuIcon("mdi-alert-box")
	b.Model(&models.ReviewReport{}).Label("Жалобы на отзывы").MenuIcon("mdi-flag")
	b.Model(&models.ReviewAspect{}).Label("Аспекты отзывов").MenuIcon("mdi-star-half-full")
	b.Model(&models.Review{}).Label("Отзывы").MenuIcon("mdi-comment-text-multiple")

	b.MenuOrder(
		b.MenuGroup("Пользователи и доступы").SubItems(
			"roles",
			"users",
			"review_collection_accesses",
		).Icon("mdi-account-lock"),

		b.MenuGroup("Профили").SubItems(
			"specialist_profiles",
			"organization_profiles",
		).Icon("mdi-card-account-details"),

		b.MenuGroup("Отзывы").SubItems(
			"reviews",
			"review_collections",
			"review_aspects",
			"review_categories",
		).Icon("mdi-comment-multiple"),

		b.MenuGroup("Модерация").SubItems(
			"confirmations",
			"report_categories",
			"review_reports",
		).Icon("mdi-shield-account"),
	)

	return b
}
