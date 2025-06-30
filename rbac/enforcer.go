package rbac

import (
	"github.com/casbin/casbin/v2"
	gormadapter "github.com/casbin/gorm-adapter/v3"
	"gorm.io/gorm"
)

func NewEnforcer(db *gorm.DB) (*casbin.Enforcer, error) {
	adapter, err := gormadapter.NewAdapterByDBWithCustomTable(db, nil, "casbin_rules")
	if err != nil {
		return nil, err
	}

	enforcer, err := casbin.NewEnforcer("rbac/casbin/model.conf", adapter)
	if err != nil {
		return nil, err
	}

	enforcer.EnableAutoSave(true)

	if err := enforcer.LoadPolicy(); err != nil {
		return nil, err
	}

	return enforcer, nil
}
