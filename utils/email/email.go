package email

import (
	"fmt"
	"html/template"
	"os"
	"strings"

	"gopkg.in/gomail.v2"
)

type EmailData struct {
	Subject   string
	To        string
	From      string
	Template  string
	Variables map[string]string
}

var templates *template.Template

func init() {
	tplPath := "templates/emails/confirm_email.html"
	var err error
	templates, err = template.ParseGlob(tplPath)
	if err != nil {
		panic(fmt.Sprintf("Ошибка загрузки шаблонов email: %v", err))
	}
}

func SendEmail(data EmailData) error {
	m := gomail.NewMessage()
	m.SetHeader("From", data.From)
	m.SetHeader("To", data.To)
	m.SetHeader("Subject", data.Subject)

	var body strings.Builder
	templateName := data.Template + ".html"
	if err := templates.ExecuteTemplate(&body, templateName, data.Variables); err != nil {
		fmt.Println("Ошибка рендеринга шаблона:", err)
		return fmt.Errorf("ошибка рендеринга шаблона: %v", err)
	}

	m.SetBody("text/html", body.String())

	smtpHost := os.Getenv("SMTP_HOST")
	smtpPort := 587
	smtpUser := os.Getenv("SMTP_USER")
	smtpPass := os.Getenv("SMTP_PASS")

	fmt.Println("Отправка email...")
	fmt.Printf("To: %s\nSubject: %s\n", data.To, data.Subject)
	fmt.Println("SMTP_HOST:", smtpHost)
	fmt.Println("SMTP_USER:", smtpUser)

	d := gomail.NewDialer(smtpHost, smtpPort, smtpUser, smtpPass)

	if err := d.DialAndSend(m); err != nil {
		fmt.Println("Ошибка отправки:", err)
		return fmt.Errorf("ошибка отправки email: %v", err)
	}

	fmt.Println("Email успешно отправлен")
	return nil
}
