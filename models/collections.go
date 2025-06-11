package models

import "time"

type ReviewCollectionAccess struct {
	ID           uint             `gorm:"primaryKey"`
	CollectionID uint             `gorm:"not null"`
	Collection   ReviewCollection `gorm:"foreignKey:CollectionID;constraint:OnDelete:CASCADE"`
	UserID       uint             `gorm:"not null"`
	User         User             `gorm:"foreignKey:UserID"`
	CanEdit      bool             `gorm:"default:false"` // Доступ только к просмотру или с возможностью редактировать
	CreatedAt    time.Time
}

type ReviewCollection struct {
	ID          uint            `gorm:"primaryKey"`
	OwnerID     uint            `gorm:"not null"`
	Owner       User            `gorm:"foreignKey:OwnerID"`
	Title       string          `gorm:"not null"`
	Description string          `gorm:"type:text"`
	IsPublic    bool            `gorm:"default:false"`
	SharedToken *string         `gorm:"uniqueIndex;type:uuid"`
	CategoryID  *uint           `gorm:"index"`
	Category    *ReviewCategory `gorm:"foreignKey:CategoryID"`
	CreatedAt   time.Time
	UpdatedAt   time.Time

	Reviews       []Review                 `gorm:"many2many:review_collection_reviews"`
	AccessEntries []ReviewCollectionAccess `gorm:"foreignKey:CollectionID"`
}

type ReviewCategory struct {
	ID          uint   `gorm:"primaryKey"`
	Name        string `gorm:"unique;not null"`
	Description string `gorm:"type:text"`
}

func (ReviewCollectionAccess) TableName() string {
	return "review_collection_access"
}

func (ReviewCollection) TableName() string {
	return "review_collections"
}

func (ReviewCategory) TableName() string {
	return "review_categories"
}
