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
					htmlgo.Div(
						htmlgo.Div(
							htmlgo.I("").Class("mdi mdi-laptop").Style(`
								color: transparent;
								background: linear-gradient(to right, #ff6a00, #ee0979);
								-webkit-background-clip: text;
								background-clip: text;
								font-size: 3rem;
							`),
						).Style("grid-area: icon;"),

						htmlgo.Div().Text("MediRate").Style(`
							grid-area: title;
							font-size: 1.5rem;
							font-weight: 500;
							text-transform: uppercase;
							display: flex;
							align-items: center;
						`),

						htmlgo.Div(
							htmlgo.P().Text("MediRate — это система отзывов в сфере медицины, которая помогает пациентам и организациям улучшать качество медицинских услуг."),
						).Style("grid-area: content;"),
					).Style(`
						--grad: #ff6a00, #ee0979;
						padding: 2rem;
						background-image: linear-gradient(to bottom left, #e0e4e5, #f2f6f9);
						border-radius: 2rem;
						display: grid;
						gap: 1.5rem;
						grid-template: 'title icon' 'content content' 'bar bar' / 1fr auto;
						color: #444447;
						box-shadow: 0 4px 8px rgba(0,0,0,0.1);
						position: relative;
					`).AppendChildren(
						htmlgo.Div().Style(`
							content: "";
							grid-area: bar;
							height: 2px;
							background-image: linear-gradient(90deg, var(--grad));
						`),
					),
					htmlgo.Div(
						htmlgo.Div(
							htmlgo.I("").Class("mdi mdi-shield-account").Style(`
								color: transparent;
								background: linear-gradient(to right, #36d1dc, #5b86e5);
								-webkit-background-clip: text;
								background-clip: text;
								font-size: 3rem;
							`),
						).Style("grid-area: icon;"),

						htmlgo.Div().Text("Admin Panel").Style(`
							grid-area: title;
							font-size: 1.5rem;
							font-weight: 500;
							text-transform: uppercase;
							display: flex;
							align-items: center;
						`),

						htmlgo.Div(
							htmlgo.P().Text("Добро пожаловать в системную административную панель."),
							htmlgo.P().Text("В данной панели предоставлен доступ ко всем таблицам базы данных."),
							htmlgo.P().Text("Язык системной административной панели — английский."),
						).Style("grid-area: content;"),
					).Style(`
						--grad: #36d1dc, #5b86e5;
						padding: 2rem;
						background-image: linear-gradient(to bottom left, #e0e4e5, #f2f6f9);
						border-radius: 2rem;
						display: grid;
						gap: 1.5rem;
						grid-template: 'title icon' 'content content' 'bar bar' / 1fr auto;
						color: #444447;
						box-shadow: 0 4px 8px rgba(0,0,0,0.1);
						position: relative;
					`).AppendChildren(
						htmlgo.Div().Style(`
							content: "";
							grid-area: bar;
							height: 2px;
							background-image: linear-gradient(90deg, var(--grad));
						`),
					),
				).Style(`
					width: min(75rem, 100%);
					margin-inline: auto;
					display: grid;
					grid-template-columns: repeat(auto-fit, minmax(min(20rem, 100%), 1fr));
					gap: 2rem;
				`),
			)
			return
		})

	b.Model(&models.Role{}).Label("Roles").MenuIcon("mdi-account-key")
	b.Model(&models.User{}).Label("Users").MenuIcon("mdi-account-group")
	b.Model(&models.SpecialistProfile{}).Label("Specialists").MenuIcon("mdi-badge-account")
	b.Model(&models.OrganizationProfile{}).Label("Organizations").MenuIcon("mdi-domain")
	b.Model(&models.Confirmation{}).Label("Confirmations").MenuIcon("mdi-check-decagram")
	b.Model(&models.VerificationRequest{}).Label("Requests").MenuIcon("mdi-account-check")
	b.Model(&models.ReportCategory{}).Label("Categories").MenuIcon("mdi-alert-box")
	b.Model(&models.ReviewReport{}).Label("Reports").MenuIcon("mdi-flag")
	b.Model(&models.ReviewAspect{}).Label("Aspects").MenuIcon("mdi-star-half-full")
	b.Model(&models.Review{}).Label("Reviews").MenuIcon("mdi-comment-text-multiple")
	b.Model(&models.ReviewLike{}).Label("Likes").MenuIcon("mdi-thumb-up")

	b.Model(&models.ContactRequest{}).Label("Requests").MenuIcon("mdi-comment-text-multiple")
	b.Model(&models.TeamMember{}).Label("Team").MenuIcon("mdi-account-group")
	b.Model(&models.Partner{}).Label("Partners").MenuIcon("mdi-handshake")

	b.Model(&models.Collection{}).Label("Collections").MenuIcon("mdi-folder-multiple")
	b.Model(&models.CollectionCategory{}).Label("Categories").MenuIcon("mdi-folder")
	b.Model(&models.CollectionAccess{}).Label("Access").MenuIcon("mdi-lock")
	b.Model(&models.CollectionSpecialist{}).Label("Specialists").MenuIcon("mdi-account-badge")
	b.Model(&models.CollectionOrganization{}).Label("Organizations").MenuIcon("mdi-domain")

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
			"review_reports",
			"review_likes",
		).Icon("mdi-comment-multiple"),

		b.MenuGroup("Moderation").SubItems(
			"confirmations",
			"verification_requests",
			"report_categories",
		).Icon("mdi-shield-account"),

		b.MenuGroup("Communication").SubItems(
			"contact_requests",
			"team_members",
			"partners",
		).Icon("mdi-dots-horizontal"),

		b.MenuGroup("Collections").SubItems(
			"collections",
			"collection_categories",
			"collection_access",
			"collection_specialists",
			"collection_organizations",
		).Icon("mdi-folder-multiple"),
	)

	return b
}
