package router

import (
	"database/sql"
	"net/http"

	"server/internal/handler"
	"server/internal/middleware"
	pg "server/internal/repository/postgres"
	"server/internal/service"
	"server/pkg/config"
)

func New(db *sql.DB, cfg *config.Config) http.Handler {
	mux := http.NewServeMux()

	// repositories
	userRepo := pg.NewUserRepository(db)

	// services
	authSvc := service.NewAuthService(userRepo, cfg.JWTSecret)

	// handlers
	authH   := handler.NewAuthHandler(authSvc)
	healthH := handler.NewHealthHandler(db)

	// routes
	mux.HandleFunc("POST /api/v1/auth/signin",     authH.SignIn)
	mux.HandleFunc("GET /api/v1/health",            healthH.Health)
	mux.HandleFunc("GET /api/v1/health/health",     healthH.HealthDB)

	return middleware.Logger(mux)
}
