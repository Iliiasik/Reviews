package search

import (
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
	"net/http"
	"strconv"
	"strings"
)

type ExploreResult struct {
	ID          uint    `json:"id"`
	Name        string  `json:"name"`
	Type        string  `json:"type"`
	Rating      float64 `json:"rating"`
	IsConfirmed bool    `json:"is_confirmed"`
	ReviewCount int64   `json:"review_count"`
}

type ExploreResponse struct {
	Results []ExploreResult `json:"results"`
	Total   int64           `json:"total"`
	Page    int             `json:"page"`
	HasMore bool            `json:"hasMore"`
}

func ExploreHandler(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		params, err := parseQueryParams(c)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		results, total := queryExploreResults(db, params)

		c.JSON(http.StatusOK, ExploreResponse{
			Results: results,
			Total:   total,
			Page:    params.Page,
			HasMore: int64(params.Page*params.Limit) < total,
		})
	}
}

type ExploreQuery struct {
	Type   string
	Rating *float64
	Page   int
	Limit  int
	Offset int
}

func parseQueryParams(c *gin.Context) (*ExploreQuery, error) {
	queryType := strings.ToLower(c.DefaultQuery("type", "all"))
	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	if page < 1 {
		page = 1
	}
	limit, _ := strconv.Atoi(c.DefaultQuery("limit", "6"))
	if limit < 1 {
		limit = 6
	}
	offset := (page - 1) * limit

	var rating *float64
	if ratingStr := c.DefaultQuery("rating", ""); ratingStr != "" {
		if parsed, err := strconv.ParseFloat(ratingStr, 64); err == nil {
			rating = &parsed
		} else {
			return nil, err
		}
	}

	return &ExploreQuery{
		Type:   queryType,
		Rating: rating,
		Page:   page,
		Limit:  limit,
		Offset: offset,
	}, nil
}

func queryExploreResults(db *gorm.DB, q *ExploreQuery) ([]ExploreResult, int64) {
	var results []ExploreResult
	var total int64
	tx := db.Session(&gorm.Session{})

	specQuery := tx.Table("users").
		Select(`users.id, users.name, 'specialist' as type,
        specialist_profiles.rating, specialist_profiles.is_confirmed,
        (SELECT COUNT(*) FROM reviews WHERE reviews.profile_user_id = users.id) AS review_count`).
		Joins("JOIN specialist_profiles ON users.id = specialist_profiles.user_id")

	if q.Rating != nil {
		specQuery = specQuery.Where("ROUND(specialist_profiles.rating) = ?", *q.Rating)
	}

	orgQuery := tx.Table("users").
		Select(`users.id, users.name, 'organization' as type,
        organization_profiles.rating, organization_profiles.is_confirmed,
        (SELECT COUNT(*) FROM reviews WHERE reviews.profile_user_id = users.id) AS review_count`).
		Joins("JOIN organization_profiles ON users.id = organization_profiles.user_id")

	if q.Rating != nil {
		orgQuery = orgQuery.Where("ROUND(organization_profiles.rating) = ?", *q.Rating)
	}

	switch q.Type {
	case "specialist":
		specQuery.Count(&total)
		specQuery.Order("users.name ASC").Limit(q.Limit).Offset(q.Offset).Scan(&results)
	case "organization":
		orgQuery.Count(&total)
		orgQuery.Order("users.name ASC").Limit(q.Limit).Offset(q.Offset).Scan(&results)
	default:
		subSQL := `
			(SELECT users.id FROM users
			JOIN specialist_profiles ON users.id = specialist_profiles.user_id
			` + ratingCondition(q, "specialist_profiles") + `)
			UNION ALL
			(SELECT users.id FROM users
			JOIN organization_profiles ON users.id = organization_profiles.user_id
			` + ratingCondition(q, "organization_profiles") + `)
		`
		countArgs := ratingArgsUnion(q)
		db.Raw("SELECT COUNT(*) FROM ("+subSQL+") AS total", countArgs...).Scan(&total)

		unionSQL := `
			(SELECT users.id, users.name, 'specialist' AS type, specialist_profiles.rating, specialist_profiles.is_confirmed,
    	(SELECT COUNT(*) FROM reviews WHERE reviews.profile_user_id = users.id) AS review_count
 		FROM users
 		JOIN specialist_profiles ON users.id = specialist_profiles.user_id
		 ` + ratingCondition(q, "specialist_profiles") + `)
		UNION ALL
		(SELECT users.id, users.name, 'organization' AS type, organization_profiles.rating, organization_profiles.is_confirmed,
    	(SELECT COUNT(*) FROM reviews WHERE reviews.profile_user_id = users.id) AS review_count
 		FROM users
 		JOIN organization_profiles ON users.id = organization_profiles.user_id` + ratingCondition(q, "organization_profiles") + `)
		ORDER BY name ASC
		LIMIT ? OFFSET ?

		`
		args := append(ratingArgsUnion(q), q.Limit, q.Offset)
		db.Raw(unionSQL, args...).Scan(&results)
	}

	return results, total
}

func ratingCondition(q *ExploreQuery, table string) string {
	if q.Rating != nil {
		return " WHERE " + table + ".rating >= ?"
	}
	return ""
}

func ratingArgsUnion(q *ExploreQuery) []interface{} {
	if q.Rating != nil {
		return []interface{}{*q.Rating, *q.Rating}
	}
	return []interface{}{}
}
