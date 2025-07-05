package error_types

import (
	"fmt"
	"net/http"
)

const (
	CodeValidationError             = "VALIDATION_ERROR"
	CodeUnauthorized                = "UNAUTHORIZED"
	CodeForbidden                   = "FORBIDDEN"
	CodeNotFound                    = "NOT_FOUND"
	CodeInternalServerError         = "INTERNAL_SERVER_ERROR"
	CodeEmailNotConfirmed           = "EMAIL_NOT_CONFIRMED"
	CodeInvalidCredentials          = "INVALID_CREDENTIALS"
	CodeTokenInvalid                = "TOKEN_INVALID"
	CodeUserNotFound                = "USER_NOT_FOUND"
	CodeRoleNotFound                = "ROLE_NOT_FOUND"
	CodePasswordMismatch            = "PASSWORD_MISMATCH"
	CodePasswordHashError           = "PASSWORD_HASH_ERROR"
	CodeJWTGenerationError          = "JWT_GENERATION_ERROR"
	CodeUnsupportedImageFormat      = "UNSUPPORTED_IMAGE_FORMAT"
	CodeFileUploadError             = "FILE_UPLOAD_ERROR"
	CodeEmailSendError              = "EMAIL_SEND_ERROR"
	CodeUniqueConstraint            = "UNIQUE_CONSTRAINT"
	CodeTokenExpired                = "TOKEN_EXPIRED"
	CodeRefreshTokenExpired         = "REFRESH_TOKEN_EXPIRED"
	CodeRefreshTokenInvalid         = "REFRESH_TOKEN_INVALID"
	CodeRefreshTokenRequired        = "REFRESH_TOKEN_REQUIRED"
	CodeRefreshTokenGenerationError = "REFRESH_TOKEN_GENERATION_ERROR"
	CodeRefreshTokenRevokeError     = "REFRESH_TOKEN_REVOKE_ERROR"
	CodeTokenNotFound               = "TOKEN_NOT_FOUND"
	CodeDatabaseError               = "DATABASE_ERROR"
)

type AppError struct {
	ErrorCode      string      `json:"error_code"`
	Message        string      `json:"message"`
	Details        interface{} `json:"details,omitempty"`
	InternalError  error       `json:"-"`
	HttpStatusCode int         `json:"-"`
}

func (e *AppError) Error() string {
	if e.InternalError != nil {
		return fmt.Sprintf("%s: %v", e.Message, e.InternalError)
	}
	return e.Message
}

func ValidationError(details interface{}) *AppError {
	return &AppError{
		ErrorCode:      CodeValidationError,
		Message:        "Ошибка валидации",
		Details:        details,
		HttpStatusCode: http.StatusBadRequest,
	}
}

func UnauthorizedError(errorCode string, message string) *AppError {
	return &AppError{
		ErrorCode:      errorCode,
		Message:        message,
		HttpStatusCode: http.StatusUnauthorized,
	}
}

func ForbiddenError(message string) *AppError {
	return &AppError{
		ErrorCode:      CodeForbidden,
		Message:        message,
		HttpStatusCode: http.StatusForbidden,
	}
}

func NotFoundError(errorCode string, resource string) *AppError {
	return &AppError{
		ErrorCode:      errorCode,
		Message:        fmt.Sprintf("%s не найден", resource),
		HttpStatusCode: http.StatusNotFound,
	}
}

func InternalServerError(internal error) *AppError {
	return &AppError{
		ErrorCode:      CodeInternalServerError,
		Message:        "Внутренняя ошибка сервера",
		InternalError:  internal,
		HttpStatusCode: http.StatusInternalServerError,
	}
}

func CustomError(statusCode int, errorCode string, message string, details interface{}) *AppError {
	return &AppError{
		ErrorCode:      errorCode,
		Message:        message,
		Details:        details,
		HttpStatusCode: statusCode,
	}
}

func (e *AppError) WithCode(code string) *AppError {
	e.ErrorCode = code
	return e
}

func (e *AppError) WithDetails(details interface{}) *AppError {
	e.Details = details
	return e
}

func (e *AppError) WithInternal(err error) *AppError {
	e.InternalError = err
	return e
}
func (e *AppError) WithMessage(message string) *AppError {
	e.Message = message
	return e
}
