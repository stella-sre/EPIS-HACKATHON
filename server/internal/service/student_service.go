package service

import (
	"context"
	"database/sql"
	"errors"
	"time"

	"server/internal/domain"
	"server/internal/dto"
	"server/internal/repository"
)

var ErrStudentNotFound = errors.New("student not found")

type StudentService struct {
	repo repository.StudentRepository
	risk *RiskService
}

func NewStudentService(repo repository.StudentRepository) *StudentService {
	return &StudentService{repo: repo, risk: NewRiskService()}
}

func (s *StudentService) List(ctx context.Context) ([]dto.StudentListItem, error) {
	students, err := s.repo.List(ctx)
	if err != nil {
		return nil, err
	}

	result := make([]dto.StudentListItem, len(students))
	for i, st := range students {
		risk := s.risk.Calculate(st.Records)
		result[i] = toListItem(st, risk)
	}
	return result, nil
}

func (s *StudentService) GetByID(ctx context.Context, id string) (*dto.StudentDetail, error) {
	st, err := s.repo.FindDetail(ctx, id)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, ErrStudentNotFound
		}
		return nil, err
	}

	risk := s.risk.Calculate(st.Records)

	records := make([]dto.RecordDTO, len(st.Records))
	for i, r := range st.Records {
		records[i] = dto.RecordDTO{
			Term:          r.Term,
			AttendancePct: r.AttendancePct,
			GradeAvg:      r.GradeAvg,
			Participation: r.Participation,
		}
	}

	return &dto.StudentDetail{
		StudentListItem: toListItem(st.StudentSummary, risk),
		District: dto.DistrictDTO{
			Name:                 st.DistrictName,
			Department:           st.Department,
			PrimaryDropoutRate:   st.PrimaryDropoutRate,
			SecondaryDropoutRate: st.SecondaryDropoutRate,
		},
		Records: records,
	}, nil
}

func (s *StudentService) Assess(ctx context.Context, id string) (*dto.AssessResponse, error) {
	st, err := s.repo.FindDetail(ctx, id)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, ErrStudentNotFound
		}
		return nil, err
	}

	risk := s.risk.Calculate(st.Records)

	saved, err := s.repo.SaveAssessment(ctx, &domain.RiskAssessment{
		StudentID: id,
		Level:     risk.Level,
		Reasons:   risk.Reasons,
	})
	if err != nil {
		return nil, err
	}

	return &dto.AssessResponse{
		ID:         saved.ID,
		StudentID:  saved.StudentID,
		RiskLevel:  string(saved.Level),
		Reasons:    saved.Reasons,
		AssessedAt: saved.AssessedAt.Format(time.RFC3339),
	}, nil
}

func toListItem(st domain.StudentSummary, risk domain.RiskResult) dto.StudentListItem {
	return dto.StudentListItem{
		ID:             st.ID,
		Name:           st.Name,
		SchoolName:     st.SchoolName,
		Zone:           st.Zone,
		EducationLevel: st.EducationLevel,
		Grade:          st.Grade,
		NativeLanguage: st.NativeLanguage,
		Risk: dto.RiskDTO{
			Level:   string(risk.Level),
			Reasons: risk.Reasons,
		},
	}
}
