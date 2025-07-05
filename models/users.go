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
	ID              uint      `gorm:"primaryKey;autoIncrement" json:"id"`
	UserID          uint      `json:"user_id" gorm:"not null;uniqueIndex"`
	User            User      `gorm:"foreignKey:UserID;constraint:OnDelete:CASCADE" json:"user"`
	ExperienceYears int       `json:"experience_years" gorm:"not null"`
	About           string    `json:"about" gorm:"type:text"`
	Rating          float64   `json:"rating" gorm:"default:0"`
	IsConfirmed     bool      `json:"is_confirmed" gorm:"default:false"`
	CreatedAt       time.Time `json:"created_at"`
}

type OrganizationProfile struct {
	ID          uint      `gorm:"primaryKey;autoIncrement" json:"id"`
	UserID      uint      `json:"user_id" gorm:"not null;uniqueIndex"`
	User        User      `gorm:"foreignKey:UserID;constraint:OnDelete:CASCADE" json:"user"`
	Website     string    `json:"website" gorm:"type:varchar(100)"`
	Address     string    `json:"address" gorm:"type:varchar(200)"`
	About       string    `json:"about" gorm:"type:text"`
	Rating      float64   `json:"rating" gorm:"default:0"`
	IsConfirmed bool      `json:"is_confirmed" gorm:"default:false"`
	CreatedAt   time.Time `json:"created_at"`
}

type Confirmation struct {
	ID             uint   `gorm:"primaryKey;autoIncrement" json:"id"`
	UserID         uint   `json:"user_id" gorm:"not null;uniqueIndex"`
	User           User   `gorm:"foreignKey:UserID;constraint:OnDelete:CASCADE" json:"user"`
	EmailConfirmed bool   `json:"email_confirmed" gorm:"default:false;not null"`
	PhoneConfirmed bool   `json:"phone_confirmed" gorm:"default:false;not null"`
	Token          string `json:"token" gorm:"uniqueIndex;not null"`
}

type RefreshToken struct {
	ID        uint      `gorm:"primaryKey;autoIncrement" json:"id"`
	UserID    uint      `json:"user_id" gorm:"not null;index"`
	Token     string    `json:"token" gorm:"type:varchar(36);uniqueIndex;not null"`
	ExpiresAt time.Time `json:"expires_at" gorm:"not null;type:timestamptz"`
	CreatedAt time.Time `json:"created_at" gorm:"autoCreateTime"`
	User      User      `gorm:"foreignKey:UserID;constraint:OnDelete:CASCADE" json:"-"`
}

func (RefreshToken) TableName() string {
	return "refresh_tokens"
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
