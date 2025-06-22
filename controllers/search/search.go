package search

import (
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
	"net/http"
	"strings"
)

func SearchHandler(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		query := strings.TrimSpace(c.Query("q"))
		if query == "" {
			c.JSON(http.StatusOK, []interface{}{})
			return
		}

		type SearchResult struct {
			ID   uint   `json:"id"`
			Name string `json:"name"`
			Type string `json:"type"`
		}

		var results []SearchResult

		searchQuery := `
			(SELECT users.id, users.name, 'specialist' AS type
			 FROM users
			 JOIN specialist_profiles ON users.id = specialist_profiles.user_id
			 WHERE LOWER(users.name) ILIKE ? OR LOWER(users.username) ILIKE ?)

			UNION ALL

			(SELECT users.id, users.name, 'organization' AS type
			 FROM users
			 JOIN organization_profiles ON users.id = organization_profiles.user_id
			 WHERE LOWER(users.name) ILIKE ?)
		`

		searchTerm := "%" + strings.ToLower(query) + "%"
		args := []interface{}{searchTerm, searchTerm, searchTerm}

		if err := db.Raw(searchQuery, args...).Scan(&results).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Ошибка при выполнении поиска: " + err.Error()})
			return
		}

		c.JSON(http.StatusOK, results)
	}
}
