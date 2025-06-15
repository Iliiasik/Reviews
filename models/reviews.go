package models

import "time"

type Review struct {
	ID            uint      `json:"id" gorm:"primaryKey"`
	AuthorID      *uint     `json:"author_id"` // nil = гость
	Author        *User     `json:"author,omitempty" gorm:"foreignKey:AuthorID"`
	IsAnonymous   bool      `json:"is_anonymous" gorm:"default:false"` // true = скрываем имя в UI
	ProfileUserID uint      `json:"profile_user_id" gorm:"not null"`
	ProfileUser   User      `json:"profile_user" gorm:"foreignKey:ProfileUserID;constraint:OnDelete:CASCADE"`
	Rating        int       `json:"rating" gorm:"not null;check:rating>=1 AND rating<=5"`
	Text          string    `json:"text" gorm:"type:text;not null"`
	IsFrozen      bool      `json:"is_frozen" gorm:"default:false"`
	CreatedAt     time.Time `json:"created_at"`
	UpdatedAt     time.Time `json:"updated_at"`

	Pros []ReviewAspect `json:"pros" gorm:"many2many:review_pros;joinForeignKey:ReviewID;JoinReferences:AspectID"`
	Cons []ReviewAspect `json:"cons" gorm:"many2many:review_cons;joinForeignKey:ReviewID;JoinReferences:AspectID"`
}

type ReviewAspect struct {
	ID          uint   `json:"id" gorm:"primaryKey"`
	Description string `json:"description" gorm:"type:varchar(255);unique;not null"`
	Positive    bool   `json:"positive" gorm:"not null"` // true — сильная сторона, false — слабая
}

type QRCode struct {
	ID     uint   `json:"id" gorm:"primaryKey"`
	QRUrl  string `json:"qr_url" gorm:"type:varchar(255);not null"`
	UserID uint   `json:"user_id" gorm:"not null;index"`
	User   User   `json:"user" gorm:"foreignKey:UserID;constraint:OnDelete:CASCADE"`
}

func (QRCode) TableName() string {
	return "qr_codes"
}

func (Review) TableName() string {
	return "reviews"
}

func (ReviewAspect) TableName() string {
	return "review_aspects"
}
