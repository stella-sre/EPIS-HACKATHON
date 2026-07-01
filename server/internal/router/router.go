package router

import (
	"database/sql"
	"net/http"

	"server/internal/handler"
	"server/internal/middleware"
	pg "server/internal/repository/postgres"
	"server/internal/service"
	"server/pkg/config"
	"server/pkg/llm"
)

func New(db *sql.DB, cfg *config.Config) http.Handler {
	mux := http.NewServeMux()

	userRepo    := pg.NewUserRepository(db)
	studentRepo := pg.NewStudentRepository(db)
	recRepo     := pg.NewRecommendationRepository(db)

	minimaxClient := llm.NewMinimaxClient(cfg.MinimaxAPIKey)

	authSvc    := service.NewAuthService(userRepo, cfg.JWTSecret)
	studentSvc := service.NewStudentService(studentRepo)
	recSvc     := service.NewRecommendationService(studentRepo, recRepo, minimaxClient)

	authH    := handler.NewAuthHandler(authSvc)
	healthH  := handler.NewHealthHandler(db)
	studentH := handler.NewStudentHandler(studentSvc)
	recH     := handler.NewRecommendationHandler(recSvc)

	mux.HandleFunc("POST /api/v1/auth/signin",              authH.SignIn)
	mux.HandleFunc("GET /api/v1/health",                     healthH.Health)
	mux.HandleFunc("GET /api/v1/health/health",              healthH.HealthDB)
	mux.HandleFunc("GET /api/v1/students",                   studentH.List)
	mux.HandleFunc("GET /api/v1/students/{id}",              studentH.GetByID)
	mux.HandleFunc("POST /api/v1/students/{id}/assess",      studentH.Assess)
	mux.HandleFunc("POST /api/v1/students/{id}/recommend",   recH.Generate)

	return middleware.Logger(mux)
}
