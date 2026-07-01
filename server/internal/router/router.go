package router

import (
	"database/sql"
	"net/http"

	"server/internal/features/health"
	"server/internal/middleware"
)

func New(db *sql.DB) http.Handler {
	mux := http.NewServeMux()

	health.RegisterRoutes(mux, db)

	return middleware.Logger(mux)
}
