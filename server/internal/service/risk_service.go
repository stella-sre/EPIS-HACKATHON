package service

import "server/internal/domain"

type RiskService struct{}

func NewRiskService() *RiskService { return &RiskService{} }

func (s *RiskService) Calculate(records []domain.AcademicRecord) domain.RiskResult {
	if len(records) == 0 {
		return domain.RiskResult{Level: domain.RiskLow, Reasons: []string{}}
	}

	var reasons []string

	var totalAtt float64
	for _, r := range records {
		totalAtt += r.AttendancePct
	}
	if totalAtt/float64(len(records)) < 75 {
		reasons = append(reasons, "asistencia_critica")
	}

	var totalGrade float64
	for _, r := range records {
		totalGrade += r.GradeAvg
	}
	if totalGrade/float64(len(records)) < 11 {
		reasons = append(reasons, "rendimiento_bajo")
	}

	if len(records) >= 2 {
		if records[len(records)-1].GradeAvg < records[0].GradeAvg-2.0 {
			reasons = append(reasons, "tendencia_negativa")
		}
	}

	var totalPart int
	for _, r := range records {
		totalPart += r.Participation
	}
	if float64(totalPart)/float64(len(records)) <= 2.0 {
		reasons = append(reasons, "baja_participacion")
	}

	level := domain.RiskLow
	switch {
	case len(reasons) >= 3:
		level = domain.RiskHigh
	case len(reasons) >= 1:
		level = domain.RiskMedium
	}

	if reasons == nil {
		reasons = []string{}
	}

	return domain.RiskResult{Level: level, Reasons: reasons}
}
