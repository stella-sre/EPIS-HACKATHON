package repository

import (
	"context"

	"server/internal/domain"
)

type RecommendationRepository interface {
	Save(ctx context.Context, r *domain.Recommendation) (*domain.Recommendation, error)
	FindLatest(ctx context.Context, studentID string) (*domain.Recommendation, error)
	ListAll(ctx context.Context) ([]domain.RecommendationListItem, error)
}
