package health

import (
	"database/sql"
	"encoding/json"
	"net/http"

	"github.com/rs/zerolog/log"
)

type Handler struct {
	db *sql.DB
}

func NewHandler(db *sql.DB) *Handler {
	return &Handler{db: db}
}

type response struct {
	Status  string `json:"status"`
	Service string `json:"service,omitempty"`
	DB      string `json:"db,omitempty"`
}

func (h *Handler) Health(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response{
		Status:  "ok",
		Service: "education-api",
	})
}

func (h *Handler) HealthDB(w http.ResponseWriter, r *http.Request) {
	res := response{Status: "ok"}

	if r.URL.Query().Get("db") == "true" {
		if err := h.db.PingContext(r.Context()); err != nil {
			log.Error().Err(err).Msg("db ping failed")
			res.Status = "degraded"
			res.DB = "unhealthy"
			w.Header().Set("Content-Type", "application/json")
			w.WriteHeader(http.StatusServiceUnavailable)
			json.NewEncoder(w).Encode(res)
			return
		}
		res.DB = "healthy"
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(res)
}
