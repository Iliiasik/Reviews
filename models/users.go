package models

import "time"

type Role struct {
	ID   uint   `json:"id" gorm:"primaryKey"`
	Name string `json:"name" gorm:"type:varchar(50);unique;not null"`
}

type User struct {
	ID           uint      `json:"id" gorm:"primaryKey"`
	Name         string    `json:"name" gorm:"type:varchar(100);not null"`
	Email        string    `json:"email" gorm:"type:varchar(100);uniqueIndex"`
	Phone        string    `json:"phone" gorm:"type:varchar(20);uniqueIndex"`
	Username     string    `json:"username" gorm:"type:varchar(20);uniqueIndex"`
	PasswordHash string    `json:"-" gorm:"not null"`
	RoleID       uint      `json:"role_id" gorm:"not null"`
	Role         Role      `json:"role" gorm:"foreignKey:RoleID;constraint:OnDelete:RESTRICT"`
	AvatarURL    string    `json:"avatar_url" gorm:"type:varchar(255)"`
	CreatedAt    time.Time `json:"created_at"`
}

type SpecialistProfile struct {
	UserID          uint      `json:"user_id" gorm:"primaryKey"`
	User            User      `json:"user" gorm:"foreignKey:UserID;constraint:OnDelete:CASCADE"`
	ExperienceYears int       `json:"experience_years" gorm:"not null"`
	About           string    `json:"about" gorm:"type:text"`
	Rating          float64   `json:"rating" gorm:"default:0"`
	IsConfirmed     bool      `json:"is_confirmed" gorm:"default:false"`
	CreatedAt       time.Time `json:"created_at"`
}

type OrganizationProfile struct {
	UserID      uint      `json:"user_id" gorm:"primaryKey"`
	User        User      `json:"user" gorm:"foreignKey:UserID;constraint:OnDelete:CASCADE"`
	Website     string    `json:"website" gorm:"type:varchar(100)"`
	Address     string    `json:"address" gorm:"type:varchar(200)"`
	About       string    `json:"about" gorm:"type:text"`
	IsConfirmed bool      `json:"is_confirmed" gorm:"default:false"`
	CreatedAt   time.Time `json:"created_at"`
}

type Confirmation struct {
	UserID         uint `json:"user_id" gorm:"primaryKey"`
	User           User `json:"user" gorm:"foreignKey:UserID;constraint:OnDelete:CASCADE"`
	EmailConfirmed bool `json:"email_confirmed" gorm:"default:false;not null"`
	PhoneConfirmed bool `json:"phone_confirmed" gorm:"default:false;not null"`
}

func (Role) TableName() string {
	return "roles"
}

func (User) TableName() string {
	return "users"
}

func (SpecialistProfile) TableName() string {
	return "specialist_profiles"
}

func (OrganizationProfile) TableName() string {
	return "organization_profiles"
}

func (Confirmation) TableName() string {
	return "confirmations"
}
