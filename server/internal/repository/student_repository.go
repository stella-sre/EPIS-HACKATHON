package repository

import (
	"context"

	"server/internal/domain"
)

type StudentRepository interface {
	List(ctx context.Context) ([]domain.StudentSummary, error)
	FindDetail(ctx context.Context, id string) (*domain.StudentDetail, error)
	SaveAssessment(ctx context.Context, a *domain.RiskAssessment) (*domain.RiskAssessment, error)
}
