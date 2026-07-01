package health

import (
	"database/sql"
	"net/http"
)

func RegisterRoutes(mux *http.ServeMux, db *sql.DB) {
	h := NewHandler(db)
	mux.HandleFunc("GET /api/v1/health", h.Health)
	mux.HandleFunc("GET /api/v1/health/health", h.HealthDB)
}
