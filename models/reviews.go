package models

import "time"

type Review struct {
	ID            uint      `json:"id" gorm:"primaryKey"`
	AuthorID      *uint     `json:"author_id"`
	Author        *User     `json:"author,omitempty" gorm:"foreignKey:AuthorID"`
	IsAnonymous   bool      `json:"is_anonymous" gorm:"default:false"`
	ProfileUserID uint      `json:"profile_user_id" gorm:"not null"`
	ProfileUser   User      `json:"profile_user" gorm:"foreignKey:ProfileUserID;constraint:OnDelete:CASCADE"`
	Rating        int       `json:"rating" gorm:"not null;check:rating>=1 AND rating<=5"`
	Text          string    `json:"text" gorm:"type:text;not null"`
	IsFrozen      bool      `json:"is_frozen" gorm:"default:false"`
	CreatedAt     time.Time `json:"created_at"`
	UpdatedAt     time.Time `json:"updated_at"`

	Pros []ReviewAspect `json:"pros" gorm:"many2many:review_pros;joinForeignKey:ReviewID;JoinReferences:AspectID"`
	Cons []ReviewAspect `json:"cons" gorm:"many2many:review_cons;joinForeignKey:ReviewID;JoinReferences:AspectID"`

	Likes []ReviewLike `json:"-" gorm:"foreignKey:ReviewID"`
}

type ReviewAspect struct {
	ID          uint   `json:"id" gorm:"primaryKey"`
	Description string `json:"description" gorm:"type:varchar(255);unique;not null"`
	Positive    bool   `json:"positive" gorm:"not null"` // true — сильная сторона, false — слабая
}

type ReviewLike struct {
	ID        uint `gorm:"primaryKey"`
	UserID    uint `gorm:"not null"`
	ReviewID  uint `gorm:"not null"`
	CreatedAt time.Time

	Review Review `gorm:"foreignKey:ReviewID;constraint:OnDelete:CASCADE"`
	User   User   `gorm:"foreignKey:UserID;constraint:OnDelete:CASCADE"`
}

func (ReviewLike) TableName() string {
	return "review_likes"
}
func (Review) TableName() string {
	return "reviews"
}

func (ReviewAspect) TableName() string {
	return "review_aspects"
}
