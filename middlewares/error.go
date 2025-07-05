package middlewares

import (
	"log"
	"net/http"
	"reviews-back/error_types"

	"github.com/gin-gonic/gin"
)

func ErrorHandler() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Next()

		if len(c.Errors) == 0 {
			return
		}

		lastErr := c.Errors.Last()
		if lastErr == nil {
			logDefaultError(c, "Nil error in context")
			return
		}

		appErr := normalizeError(lastErr.Err)
		logAppError(appErr)
		sendErrorResponse(c, appErr)
	}
}

func normalizeError(err error) *error_types.AppError {
	if appErr, ok := err.(*error_types.AppError); ok {
		return appErr
	}

	if err == nil {
		return error_types.InternalServerError(nil).
			WithCode(error_types.CodeInternalServerError).
			WithMessage("Internal server error occurred")
	}

	return error_types.InternalServerError(err).
		WithCode(error_types.CodeInternalServerError)
}

func logAppError(err *error_types.AppError) {
	if err == nil {
		log.Println("[ERROR] Attempt to log nil AppError")
		return
	}

	msg := "[" + err.ErrorCode + "] " + err.Message
	if err.InternalError != nil {
		msg += ": " + err.InternalError.Error()
	}
	log.Println(msg)

	if err.Details != nil {
		log.Printf("Details: %v", err.Details)
	}
}

func logDefaultError(c *gin.Context, message string) {
	log.Println("[ERROR]", message)
	c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{
		"error_code": error_types.CodeInternalServerError,
		"message":    "Internal server error",
	})
}

func sendErrorResponse(c *gin.Context, err *error_types.AppError) {
	if err == nil {
		logDefaultError(c, "Nil error passed to sendErrorResponse")
		return
	}

	status := err.HttpStatusCode
	if status == 0 {
		status = http.StatusInternalServerError
	}

	response := gin.H{
		"error_code": err.ErrorCode,
		"message":    err.Message,
	}

	if err.Details != nil {
		response["details"] = err.Details
	}

	c.AbortWithStatusJSON(status, response)
}
