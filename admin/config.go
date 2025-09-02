package admin

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
		BrandTitle("Admin Panel").
		DataOperator(gorm2op.DataOperator(db)).
		HomePageFunc(func(ctx *web.EventContext) (r web.PageResponse, err error) {
			r.PageTitle = "Home"
			r.Body = htmlgo.Div(
				htmlgo.Div(
					htmlgo.H1("MediRate").Style(`
				font-size: 28px;
				margin-bottom: 10px;
			`),
					htmlgo.P().Text("Добро пожаловать в системную административную панель.").Style("font-size: 16px; margin-bottom: 5px;"),
					htmlgo.P().Text("В данной панели предоставлен доступ ко всем таблицам базы данных.").Style("font-size: 16px; margin-bottom: 5px;"),
					htmlgo.P().Text("Язык системной административной панели - английский").Style("font-size: 16px; margin-bottom: 0;"),
				).Style(`
			background: linear-gradient(135deg, #3a3a3a, #1f1f1f);
			padding: 20px;
			border-radius: 10px;
			color: #ffffff;
			max-width: 400px;
		`),
			)
			return
		})

	b.Model(&models.Role{}).Label("Roles").MenuIcon("mdi-account-key")
	b.Model(&models.User{}).Label("Users").MenuIcon("mdi-account-group")
	b.Model(&models.SpecialistProfile{}).Label("Specialists").MenuIcon("mdi-badge-account")
	b.Model(&models.OrganizationProfile{}).Label("Organizations").MenuIcon("mdi-domain")
	b.Model(&models.Confirmation{}).Label("Confirmations").MenuIcon("mdi-check-decagram")
	b.Model(&models.ReportCategory{}).Label("Report Categories").MenuIcon("mdi-alert-box")
	b.Model(&models.ReviewReport{}).Label("Review Reports").MenuIcon("mdi-flag")
	b.Model(&models.ReviewAspect{}).Label("Review Aspects").MenuIcon("mdi-star-half-full")
	b.Model(&models.Review{}).Label("Reviews").MenuIcon("mdi-comment-text-multiple")

	b.MenuOrder(
		b.MenuGroup("Users & Access").SubItems(
			"roles",
			"users",
			"review_collection_accesses",
		).Icon("mdi-account-lock"),

		b.MenuGroup("Profiles").SubItems(
			"specialist_profiles",
			"organization_profiles",
		).Icon("mdi-card-account-details"),

		b.MenuGroup("Reviews").SubItems(
			"reviews",
			"review_collections",
			"review_aspects",
			"review_categories",
		).Icon("mdi-comment-multiple"),

		b.MenuGroup("Moderation").SubItems(
			"confirmations",
			"report_categories",
			"review_reports",
		).Icon("mdi-shield-account"),
	)

	return b
}
