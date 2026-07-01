package repository

import (
	"context"

	"server/internal/domain"
)

type StudentRepository interface {
	List(ctx context.Context) ([]domain.StudentSummary, error)
	FindDetail(ctx context.Context, id string) (*domain.StudentDetail, error)
	SaveAssessment(ctx context.Context, a *domain.RiskAssessment) (*domain.RiskAssessment, error)
	Create(ctx context.Context, name, schoolName, zone, educationLevel, nativeLanguage string, grade int) (*domain.StudentSummary, error)
	UpsertRecord(ctx context.Context, studentID string, term int, attendancePct, gradeAvg float64, participation int) error
}
