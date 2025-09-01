package models

type ContactRequest struct {
	ID          uint   `gorm:"primaryKey"`
	Name        string `gorm:"type:varchar(100);not null"`
	Email       string `gorm:"type:varchar(100);not null"`
	Description string `gorm:"type:text;not null"`
}

func (ContactRequest) TableName() string {
	return "contact_requests"
}
