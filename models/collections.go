package models

import "time"

type CollectionAccess struct {
	ID           uint       `gorm:"primaryKey"`
	CollectionID uint       `gorm:"not null"`
	Collection   Collection `gorm:"foreignKey:CollectionID;constraint:OnDelete:CASCADE"`
	UserID       uint       `gorm:"not null"`
	User         User       `gorm:"foreignKey:UserID"`
	CanEdit      bool       `gorm:"default:false"`
	CreatedAt    time.Time
}

type Collection struct {
	ID          uint                `gorm:"primaryKey"`
	OwnerID     uint                `gorm:"not null"`
	Owner       User                `gorm:"foreignKey:OwnerID"`
	Title       string              `gorm:"not null"`
	Description string              `gorm:"type:text"`
	IsPublic    bool                `gorm:"default:false"`
	SharedToken *string             `gorm:"uniqueIndex;type:uuid"`
	CategoryID  *uint               `gorm:"index"`
	Category    *CollectionCategory `gorm:"foreignKey:CategoryID"`
	CreatedAt   time.Time
	UpdatedAt   time.Time

	Specialists   []SpecialistProfile   `gorm:"many2many:collection_specialists"`
	Organizations []OrganizationProfile `gorm:"many2many:collection_organizations"`
	AccessEntries []CollectionAccess    `gorm:"foreignKey:CollectionID"`
}

type CollectionCategory struct {
	ID          uint   `gorm:"primaryKey"`
	Name        string `gorm:"unique;not null"`
	Description string `gorm:"type:text"`
}

type CollectionSpecialist struct {
	CollectionID uint              `gorm:"primaryKey"`
	SpecialistID uint              `gorm:"primaryKey"`
	Collection   Collection        `gorm:"foreignKey:CollectionID;constraint:OnDelete:CASCADE"`
	Specialist   SpecialistProfile `gorm:"foreignKey:SpecialistID;constraint:OnDelete:CASCADE"`
	AddedAt      time.Time         `gorm:"autoCreateTime"`
	Notes        string            `gorm:"type:text"`
}

type CollectionOrganization struct {
	CollectionID   uint                `gorm:"primaryKey"`
	OrganizationID uint                `gorm:"primaryKey"`
	Collection     Collection          `gorm:"foreignKey:CollectionID;constraint:OnDelete:CASCADE"`
	Organization   OrganizationProfile `gorm:"foreignKey:OrganizationID;constraint:OnDelete:CASCADE"`
	AddedAt        time.Time           `gorm:"autoCreateTime"`
	Notes          string              `gorm:"type:text"`
}

func (CollectionAccess) TableName() string {
	return "collection_access"
}

func (Collection) TableName() string {
	return "collections"
}

func (CollectionCategory) TableName() string {
	return "collection_categories"
}

func (CollectionSpecialist) TableName() string {
	return "collection_specialists"
}

func (CollectionOrganization) TableName() string {
	return "collection_organizations"
}
