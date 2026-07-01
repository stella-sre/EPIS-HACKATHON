package handler

import (
	"database/sql"
	"net/http"

	"github.com/rs/zerolog/log"
)

type HealthHandler struct {
	db *sql.DB
}

func NewHealthHandler(db *sql.DB) *HealthHandler {
	return &HealthHandler{db: db}
}

type healthResponse struct {
	Status  string `json:"status"`
	Service string `json:"service,omitempty"`
	DB      string `json:"db,omitempty"`
}

func (h *HealthHandler) Health(w http.ResponseWriter, r *http.Request) {
	writeJSON(w, http.StatusOK, healthResponse{
		Status:  "ok",
		Service: "education-api",
	})
}

func (h *HealthHandler) HealthDB(w http.ResponseWriter, r *http.Request) {
	res := healthResponse{Status: "ok"}

	if r.URL.Query().Get("db") == "true" {
		if err := h.db.PingContext(r.Context()); err != nil {
			log.Error().Err(err).Msg("db ping")
			res.Status = "degraded"
			res.DB = "unhealthy"
			writeJSON(w, http.StatusServiceUnavailable, res)
			return
		}
		res.DB = "healthy"
	}

	writeJSON(w, http.StatusOK, res)
}
