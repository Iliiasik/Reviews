package validation

type UpdateProfileRequest struct {
	Name            string `json:"name" validate:"required"`
	Email           string `json:"email" validate:"required,email"`
	Phone           string `json:"phone" validate:"omitempty"`
	About           string `json:"about" validate:"omitempty"`
	Website         string `json:"website" validate:"omitempty,url"`
	Address         string `json:"address" validate:"omitempty"`
	ExperienceYears *int   `json:"experience_years" validate:"omitempty,gte=0"`
}
