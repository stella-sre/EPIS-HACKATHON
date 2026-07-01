package postgres

import (
	"context"
	"database/sql"
	"time"

	"server/internal/domain"
)

type recommendationRepository struct {
	db *sql.DB
}

func NewRecommendationRepository(db *sql.DB) *recommendationRepository {
	return &recommendationRepository{db: db}
}

func (r *recommendationRepository) Save(ctx context.Context, rec *domain.Recommendation) (*domain.Recommendation, error) {
	var id string
	var generatedAt time.Time

	var assessmentID interface{}
	if rec.AssessmentID != "" {
		assessmentID = rec.AssessmentID
	}

	err := r.db.QueryRowContext(ctx, `
		INSERT INTO academic.recommendations (student_id, assessment_id, explanation, suggested_action)
		VALUES ($1, $2, $3, $4)
		RETURNING id, generated_at`,
		rec.StudentID, assessmentID, rec.Explanation, rec.SuggestedAction,
	).Scan(&id, &generatedAt)
	if err != nil {
		return nil, err
	}

	return &domain.Recommendation{
		ID:              id,
		StudentID:       rec.StudentID,
		AssessmentID:    rec.AssessmentID,
		Explanation:     rec.Explanation,
		SuggestedAction: rec.SuggestedAction,
		GeneratedAt:     generatedAt,
	}, nil
}

func (r *recommendationRepository) FindLatest(ctx context.Context, studentID string) (*domain.Recommendation, error) {
	var rec domain.Recommendation
	var assessmentID sql.NullString

	err := r.db.QueryRowContext(ctx, `
		SELECT id, student_id, assessment_id, explanation, suggested_action, generated_at
		FROM   academic.recommendations
		WHERE  student_id = $1
		ORDER  BY generated_at DESC
		LIMIT  1`,
		studentID,
	).Scan(&rec.ID, &rec.StudentID, &assessmentID, &rec.Explanation, &rec.SuggestedAction, &rec.GeneratedAt)
	if err != nil {
		return nil, err
	}

	if assessmentID.Valid {
		rec.AssessmentID = assessmentID.String
	}

	return &rec, nil
}
