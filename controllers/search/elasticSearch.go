package search

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"github.com/elastic/go-elasticsearch/v8"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
	"log"
	"net/http"
	"os"
	"strconv"
	"strings"
)

func InitES() (*elasticsearch.Client, error) {
	esURL := os.Getenv("ES_URL")
	if esURL == "" {
		esURL = "http://localhost:9200"
	}

	es, err := elasticsearch.NewClient(elasticsearch.Config{
		Addresses: []string{esURL},
	})
	if err != nil {
		return nil, fmt.Errorf("ошибка подключения к Elasticsearch: %w", err)
	}

	res, err := es.Info()
	if err != nil || res.IsError() {
		return nil, fmt.Errorf("Elasticsearch ping failed: %w", err)
	}
	return es, nil
}

type Document struct {
	ID   uint   `json:"id"`
	Name string `json:"name"`
	Type string `json:"type"`
}

func ElasticSearch(es *elasticsearch.Client, fallback gin.HandlerFunc) gin.HandlerFunc {
	return func(c *gin.Context) {
		if es == nil {
			log.Println("Elasticsearch не инициализирован — fallback на SQL-поиск")
			fallback(c)
			return
		}
		query := strings.TrimSpace(c.Query("q"))
		if query == "" {
			c.JSON(http.StatusOK, []interface{}{})
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

		var buf bytes.Buffer
		searchQuery := map[string]interface{}{
			"from": offset,
			"size": limit,
			"query": map[string]interface{}{
				"match_phrase_prefix": map[string]interface{}{
					"name": query,
				},
			},
		}

		if err := json.NewEncoder(&buf).Encode(searchQuery); err != nil {
			log.Println("Не удалось собрать тело запроса — fallback на SQL-поиск")
			fallback(c)
			return
		}

		res, err := es.Search(
			es.Search.WithContext(context.Background()),
			es.Search.WithIndex("users"),
			es.Search.WithBody(&buf),
			es.Search.WithTrackTotalHits(true),
		)
		if err != nil || res.IsError() {
			if res != nil && res.Body != nil {
				defer res.Body.Close()
				var errBody map[string]interface{}
				if decodeErr := json.NewDecoder(res.Body).Decode(&errBody); decodeErr == nil {
					log.Printf("Elasticsearch ошибка: %v — fallback на SQL-поиск\n", errBody)
				} else {
					log.Printf("Ошибка Elasticsearch и не удалось распарсить тело ошибки: %v\n", decodeErr)
				}
			} else {
				log.Printf("Elasticsearch ошибка: %v — fallback на SQL-поиск\n", err)
			}
			fallback(c)
			return
		}
		defer res.Body.Close()

		var r struct {
			Hits struct {
				Total struct {
					Value int `json:"value"`
				} `json:"total"`
				Hits []struct {
					Source Document `json:"_source"`
				} `json:"hits"`
			} `json:"hits"`
		}
		if err := json.NewDecoder(res.Body).Decode(&r); err != nil {
			log.Println("Ошибка декодирования ответа ES — fallback на SQL-поиск")
			fallback(c)
			return
		}

		log.Println("Используется поиск через Elasticsearch")

		results := make([]Document, 0, len(r.Hits.Hits))
		for _, hit := range r.Hits.Hits {
			results = append(results, hit.Source)
		}

		c.JSON(http.StatusOK, gin.H{
			"total":   r.Hits.Total.Value,
			"results": results,
		})
	}
}

func LoadDataToES(ctx context.Context, es *elasticsearch.Client, db *gorm.DB) error {
	indexMapping := `{
		"mappings": {
			"properties": {
				"id":   { "type": "integer" },
				"name": { "type": "text" },
				"type": { "type": "keyword" }
			}
		}
	}`

	res, err := es.Indices.Create("users", es.Indices.Create.WithBody(strings.NewReader(indexMapping)))
	if err != nil {
		return fmt.Errorf("ошибка создания индекса: %w", err)
	}
	defer res.Body.Close()

	if res.IsError() {
		log.Printf("Ответ при создании индекса: %s\n", res.String())
	}

	var results []Document

	rawSQL := `
		SELECT users.id, users.name, 'specialist' AS type
		FROM users
		JOIN specialist_profiles ON users.id = specialist_profiles.user_id
		UNION ALL
		SELECT users.id, users.name, 'organization' AS type
		FROM users
		JOIN organization_profiles ON users.id = organization_profiles.user_id
	`

	if err := db.Raw(rawSQL).Scan(&results).Error; err != nil {
		return fmt.Errorf("ошибка выборки из Postgres: %w", err)
	}

	if len(results) == 0 {
		log.Println("Нет данных для загрузки в Elasticsearch")
		return nil
	}

	bulkBody := &strings.Builder{}

	for _, doc := range results {
		meta := fmt.Sprintf(`{ "index" : { "_index" : "users", "_id" : "%d" } }%s`, doc.ID, "\n")
		data, err := json.Marshal(doc)
		if err != nil {
			return fmt.Errorf("ошибка маршалинга JSON: %w", err)
		}

		bulkBody.WriteString(meta)
		bulkBody.Write(data)
		bulkBody.WriteString("\n")
	}

	res, err = es.Bulk(strings.NewReader(bulkBody.String()), es.Bulk.WithContext(ctx))
	if err != nil {
		return fmt.Errorf("ошибка bulk-запроса: %w", err)
	}
	defer res.Body.Close()

	if res.IsError() {
		return fmt.Errorf("bulk-запрос завершился ошибкой: %s", res.String())
	}

	log.Printf("Успешно загружено %d документов в Elasticsearch", len(results))
	return nil
}
