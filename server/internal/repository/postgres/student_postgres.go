package postgres

import (
	"context"
	"database/sql"
	"encoding/json"
	"strings"
	"time"

	"server/internal/domain"
)

type studentRepository struct {
	db *sql.DB
}

func NewStudentRepository(db *sql.DB) *studentRepository {
	return &studentRepository{db: db}
}

func (r *studentRepository) List(ctx context.Context) ([]domain.StudentSummary, error) {
	rows, err := r.db.QueryContext(ctx, `
		SELECT
			s.id,
			s.name,
			s.native_language,
			s.education_level,
			s.grade,
			sc.name  AS school_name,
			sc.zone,
			COALESCE(
				json_agg(
					json_build_object(
						'term',           ar.term,
						'attendance_pct', ar.attendance_pct,
						'grade_avg',      ar.grade_avg,
						'participation',  ar.participation
					) ORDER BY ar.term
				) FILTER (WHERE ar.id IS NOT NULL),
				'[]'
			)::text AS records
		FROM   academic.students s
		JOIN   academic.schools sc ON sc.id = s.school_id
		LEFT   JOIN academic.academic_records ar ON ar.student_id = s.id
		GROUP  BY s.id, s.name, s.native_language, s.education_level, s.grade, sc.name, sc.zone
		ORDER  BY s.name`)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var result []domain.StudentSummary
	for rows.Next() {
		var st domain.StudentSummary
		var recordsJSON string

		if err := rows.Scan(
			&st.ID, &st.Name, &st.NativeLanguage, &st.EducationLevel, &st.Grade,
			&st.SchoolName, &st.Zone, &recordsJSON,
		); err != nil {
			return nil, err
		}

		if err := json.Unmarshal([]byte(recordsJSON), &st.Records); err != nil {
			return nil, err
		}

		result = append(result, st)
	}
	return result, rows.Err()
}

func (r *studentRepository) FindDetail(ctx context.Context, id string) (*domain.StudentDetail, error) {
	var st domain.StudentDetail
	var recordsJSON string

	err := r.db.QueryRowContext(ctx, `
		SELECT
			s.id,
			s.name,
			s.native_language,
			s.education_level,
			s.grade,
			sc.name  AS school_name,
			sc.zone,
			COALESCE(d.department,    '')  AS department,
			COALESCE(d.district_name, '')  AS district_name,
			COALESCE(d.primary_dropout_rate,   0) AS primary_dropout_rate,
			COALESCE(d.secondary_dropout_rate, 0) AS secondary_dropout_rate,
			COALESCE(
				json_agg(
					json_build_object(
						'term',           ar.term,
						'attendance_pct', ar.attendance_pct,
						'grade_avg',      ar.grade_avg,
						'participation',  ar.participation
					) ORDER BY ar.term
				) FILTER (WHERE ar.id IS NOT NULL),
				'[]'
			)::text AS records
		FROM   academic.students s
		JOIN   academic.schools sc ON sc.id = s.school_id
		LEFT   JOIN academic.districts d ON d.ubigeo = sc.ubigeo
		LEFT   JOIN academic.academic_records ar ON ar.student_id = s.id
		WHERE  s.id = $1
		GROUP  BY s.id, s.name, s.native_language, s.education_level, s.grade,
		          sc.name, sc.zone,
		          d.department, d.district_name,
		          d.primary_dropout_rate, d.secondary_dropout_rate`,
		id,
	).Scan(
		&st.ID, &st.Name, &st.NativeLanguage, &st.EducationLevel, &st.Grade,
		&st.SchoolName, &st.Zone,
		&st.Department, &st.DistrictName,
		&st.PrimaryDropoutRate, &st.SecondaryDropoutRate,
		&recordsJSON,
	)
	if err != nil {
		return nil, err
	}

	if err := json.Unmarshal([]byte(recordsJSON), &st.Records); err != nil {
		return nil, err
	}

	return &st, nil
}

func (r *studentRepository) SaveAssessment(ctx context.Context, a *domain.RiskAssessment) (*domain.RiskAssessment, error) {
	var id string
	var assessedAt time.Time

	err := r.db.QueryRowContext(ctx, `
		INSERT INTO academic.risk_assessments (student_id, risk_level, reasons)
		VALUES ($1, $2, $3::text[])
		RETURNING id, assessed_at`,
		a.StudentID,
		string(a.Level),
		pgTextArray(a.Reasons),
	).Scan(&id, &assessedAt)
	if err != nil {
		return nil, err
	}

	return &domain.RiskAssessment{
		ID:         id,
		StudentID:  a.StudentID,
		Level:      a.Level,
		Reasons:    a.Reasons,
		AssessedAt: assessedAt,
	}, nil
}

func pgTextArray(arr []string) string {
	if len(arr) == 0 {
		return "{}"
	}
	return "{" + strings.Join(arr, ",") + "}"
}
