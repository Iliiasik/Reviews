package middlewares

import (
	"log"
	"reviews-back/errors"

	"github.com/gin-gonic/gin"
)

func ErrorHandler() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Next()

		if len(c.Errors) > 0 {
			for _, ginErr := range c.Errors {
				var appErr *errors.AppError
				switch err := ginErr.Err.(type) {
				case *errors.AppError:
					appErr = err
				default:
					appErr = errors.InternalServerError(err)
				}
				logError(appErr)
				c.JSON(appErr.HttpStatusCode, appErr)
			}
			c.Abort()
		}
	}
}

func logError(err *errors.AppError) {
	if err.InternalError != nil {
		log.Printf("[%s] %s: %v", err.ErrorCode, err.Message, err.InternalError)
	} else {
		log.Printf("[%s] %s", err.ErrorCode, err.Message)
	}
}
