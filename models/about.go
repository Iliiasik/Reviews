package models

type TeamMember struct {
	ID       uint   `gorm:"primaryKey"`
	Name     string `gorm:"type:varchar(100);not null"`
	Position string `gorm:"type:varchar(100);not null"`
	PhotoURL string `gorm:"type:text"`
	Bio      string `gorm:"type:text"`
}

type Partner struct {
	ID      uint   `gorm:"primaryKey"`
	LogoURL string `gorm:"type:text"`
	Website string `gorm:"type:text"`
}

func (TeamMember) TableName() string { return "team_members" }

func (Partner) TableName() string { return "partners" }
