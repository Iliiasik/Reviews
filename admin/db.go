package admin

import (
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
	"reviews-back/database"
)

func ConnectDB() *gorm.DB {
	db := database.DB
	db.Logger = db.Logger.LogMode(logger.Info)
	return db
}
