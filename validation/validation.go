package validation

import (
	"fmt"
	"github.com/gin-gonic/gin"
	"reflect"
	"regexp"
	"strings"

	"github.com/go-playground/validator/v10"
	"reviews-back/error_types"
)

var validate *validator.Validate

func init() {
	validate = validator.New()
	registerCustomValidations()
}

func registerCustomValidations() {
	_ = validate.RegisterValidation("password", isValidPassword)
}

func isValidPassword(fl validator.FieldLevel) bool {
	password := fl.Field().String()
	if len(password) < 8 {
		return false
	}
	return regexp.MustCompile(`[0-9]`).MatchString(password) &&
		regexp.MustCompile(`[a-zA-Z]`).MatchString(password)
}

func ValidateStruct(s interface{}) *error_types.AppError {
	err := validate.Struct(s)
	if err == nil {
		return nil
	}

	if ve, ok := err.(validator.ValidationErrors); ok {
		details := make(map[string]string)
		for _, e := range ve {
			field := getJSONFieldName(e.StructField(), s)
			details[field] = getValidationMessage(e)
		}
		return error_types.ValidationError(details)
	}

	return error_types.InternalServerError(err)
}

func getJSONFieldName(structField string, s interface{}) string {
	t := reflect.TypeOf(s)
	if t.Kind() == reflect.Ptr {
		t = t.Elem()
	}

	field, ok := t.FieldByName(structField)
	if !ok {
		return structField
	}

	jsonTag := field.Tag.Get("json")
	if jsonTag == "" {
		return structField
	}

	return strings.Split(jsonTag, ",")[0]
}

func getValidationMessage(e validator.FieldError) string {
	switch e.Tag() {
	case "required":
		return "Обязательное поле"
	case "email":
		return "Некорректный email"
	case "password":
		return "Пароль должен содержать минимум 8 символов, включая цифры и буквы"
	case "oneof":
		return fmt.Sprintf("Должен быть одним из: %s", e.Param())
	case "gte":
		return "Должен быть больше или равен 0"
	case "url":
		return "Должен быть валидным URL"
	default:
		return fmt.Sprintf("Ошибка валидации (%s)", e.Tag())
	}
}

func BindAndValidate(c *gin.Context, req interface{}) bool {
	if err := c.ShouldBindJSON(req); err != nil {
		c.Error(error_types.ValidationError(map[string]string{
			"request": "Неверный формат запроса",
		}))
		return false
	}

	if validationErr := ValidateStruct(req); validationErr != nil {
		c.Error(validationErr)
		return false
	}

	return true
}
