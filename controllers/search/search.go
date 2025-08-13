package search

import (
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
	"net/http"
	"strconv"
	"strings"
)

func SearchHandler(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		query := strings.TrimSpace(c.Query("q"))
		if query == "" {
			c.JSON(http.StatusOK, gin.H{
				"total":   0,
				"results": []interface{}{},
			})
			return
		}

		limit := 10
		offset := 0

		if l := c.Query("limit"); l != "" {
			if val, err := strconv.Atoi(l); err == nil && val > 0 {
				limit = val
			}
		}
		if o := c.Query("offset"); o != "" {
			if val, err := strconv.Atoi(o); err == nil && val >= 0 {
				offset = val
			}
		}

		type SearchResult struct {
			ID   uint   `json:"id"`
			Name string `json:"name"`
			Type string `json:"type"`
		}

		var results []SearchResult

		searchTerm := "%" + query + "%"

		var total int64
		countQuery := `
			SELECT COUNT(*) FROM (
				(SELECT users.id
				 FROM users
				 JOIN specialist_profiles ON users.id = specialist_profiles.user_id
				 WHERE users.name ILIKE ? OR users.username ILIKE ?)
				UNION ALL
				(SELECT users.id
				 FROM users
				 JOIN organization_profiles ON users.id = organization_profiles.user_id
				 WHERE users.name ILIKE ?)
			) AS combined
		`
		if err := db.Raw(countQuery, searchTerm, searchTerm, searchTerm).Scan(&total).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Ошибка подсчёта результатов: " + err.Error()})
			return
		}

		searchQuery := `
			(SELECT users.id, users.name, 'specialist' AS type
			 FROM users
			 JOIN specialist_profiles ON users.id = specialist_profiles.user_id
			 WHERE users.name ILIKE ? OR users.username ILIKE ?)

			UNION ALL

			(SELECT users.id, users.name, 'organization' AS type
			 FROM users
			 JOIN organization_profiles ON users.id = organization_profiles.user_id
			 WHERE users.name ILIKE ?)

			ORDER BY name
			LIMIT ? OFFSET ?
		`

		args := []interface{}{searchTerm, searchTerm, searchTerm, limit, offset}

		if err := db.Raw(searchQuery, args...).Scan(&results).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Ошибка при выполнении поиска: " + err.Error()})
			return
		}

		c.JSON(http.StatusOK, gin.H{
			"total":   total,
			"results": results,
		})
	}
}
