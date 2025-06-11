package models

import "time"

type ReviewReport struct {
	ID         uint           `gorm:"primaryKey"`
	ReviewID   uint           `gorm:"not null"`
	Review     Review         `gorm:"foreignKey:ReviewID;constraint:OnDelete:CASCADE"`
	ReporterID *uint          `gorm:"index"` // Может быть null, если жалоба от гостя
	Reporter   *User          `gorm:"foreignKey:ReporterID"`
	CategoryID uint           `gorm:"not null"`
	Category   ReportCategory `gorm:"foreignKey:CategoryID"`
	Message    string         `gorm:"type:text"`
	CreatedAt  time.Time
}

type ReportCategory struct {
	ID   uint   `gorm:"primaryKey"`
	Name string `gorm:"type:varchar(100);unique;not null"` // Например: "Спам", "Оскорбления"
}

func (ReviewReport) TableName() string {
	return "review_reports"
}

func (ReportCategory) TableName() string {
	return "report_categories"
}
