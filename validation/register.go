package validation

type RegisterRequest struct {
	Name        string `json:"name" validate:"required"`
	Email       string `json:"email" validate:"required,email"`
	Phone       string `json:"phone" validate:"omitempty"`
	Username    string `json:"username" validate:"required"`
	Password    string `json:"password" validate:"required,password"`
	AccountType string `json:"account_type" validate:"required,oneof=user specialist organization"`
	// для специалистов
	ExperienceYears int    `json:"experience_years" validate:"required_if=AccountType specialist,omitempty,gte=0"`
	About           string `json:"about" validate:"omitempty"`
	// для учреждений
	Website string `json:"website" validate:"omitempty,url"`
	Address string `json:"address" validate:"omitempty"`
}
