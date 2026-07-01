package service

import (
	"context"
	"database/sql"
	"encoding/json"
	"errors"
	"fmt"
	"strings"
	"time"

	"github.com/rs/zerolog/log"

	"server/internal/domain"
	"server/internal/dto"
	"server/internal/repository"
	"server/pkg/llm"
)

var reasonLabels = map[string]string{
	"asistencia_critica": "asistencia promedio menor al 75%",
	"rendimiento_bajo":   "promedio de notas menor a 11/20",
	"tendencia_negativa": "tendencia descendente en sus calificaciones",
	"baja_participacion": "baja participación en clase (≤ 2/5)",
}

var riskLabels = map[domain.RiskLevel]string{
	domain.RiskLow:    "BAJO",
	domain.RiskMedium: "MEDIO",
	domain.RiskHigh:   "ALTO",
}

type RecommendationService struct {
	students repository.StudentRepository
	recRepo  repository.RecommendationRepository
	risk     *RiskService
	llm      llm.Client
}

func NewRecommendationService(
	students repository.StudentRepository,
	recRepo repository.RecommendationRepository,
	client llm.Client,
) *RecommendationService {
	return &RecommendationService{
		students: students,
		recRepo:  recRepo,
		risk:     NewRiskService(),
		llm:      client,
	}
}

func (s *RecommendationService) List(ctx context.Context) ([]dto.RecommendationListItem, error) {
	items, err := s.recRepo.ListAll(ctx)
	if err != nil {
		return nil, err
	}

	result := make([]dto.RecommendationListItem, len(items))
	for i, item := range items {
		result[i] = dto.RecommendationListItem{
			ID:              item.ID,
			StudentID:       item.StudentID,
			StudentName:     item.StudentName,
			Explanation:     item.Explanation,
			SuggestedAction: item.SuggestedAction,
			GeneratedAt:     item.GeneratedAt.Format(time.RFC3339),
			Risk: dto.RiskDTO{
				Level:   item.RiskLevel,
				Reasons: item.Reasons,
			},
		}
	}
	return result, nil
}

func (s *RecommendationService) Generate(ctx context.Context, studentID string) (*dto.RecommendationResponse, error) {
	st, err := s.students.FindDetail(ctx, studentID)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, ErrStudentNotFound
		}
		return nil, err
	}

	riskResult := s.risk.Calculate(st.Records)

	assessment, err := s.students.SaveAssessment(ctx, &domain.RiskAssessment{
		StudentID: studentID,
		Level:     riskResult.Level,
		Reasons:   riskResult.Reasons,
	})
	if err != nil {
		return nil, fmt.Errorf("saving assessment: %w", err)
	}

	prompt := buildPrompt(st, riskResult)

	raw, tokens, err := s.llm.Complete(ctx, prompt)
	if err != nil {
		return nil, fmt.Errorf("llm: %w", err)
	}

	log.Info().
		Str("student_id", studentID).
		Str("risk_level", string(riskResult.Level)).
		Int("tokens_used", tokens).
		Msg("recommendation generated")

	explanation, suggestedAction, err := parseResponse(raw)
	if err != nil {
		return nil, fmt.Errorf("parsing llm response: %w", err)
	}

	rec, err := s.recRepo.Save(ctx, &domain.Recommendation{
		StudentID:       studentID,
		AssessmentID:    assessment.ID,
		Explanation:     explanation,
		SuggestedAction: suggestedAction,
	})
	if err != nil {
		return nil, fmt.Errorf("saving recommendation: %w", err)
	}

	return &dto.RecommendationResponse{
		ID:              rec.ID,
		StudentID:       rec.StudentID,
		AssessmentID:    rec.AssessmentID,
		Explanation:     rec.Explanation,
		SuggestedAction: rec.SuggestedAction,
		GeneratedAt:     rec.GeneratedAt.Format(time.RFC3339),
		Risk: dto.RiskDTO{
			Level:   string(riskResult.Level),
			Reasons: riskResult.Reasons,
		},
	}, nil
}

func buildPrompt(st *domain.StudentDetail, risk domain.RiskResult) string {
	zoneLabel := "urbana"
	if st.Zone == "rural" {
		zoneLabel = "rural"
	}

	levelLabel := "primaria"
	if st.EducationLevel == "secondary" {
		levelLabel = "secundaria"
	}

	var reasonLines []string
	for _, r := range risk.Reasons {
		if label, ok := reasonLabels[r]; ok {
			reasonLines = append(reasonLines, "- "+label)
		}
	}
	reasonsText := "Ningún factor de riesgo detectado."
	if len(reasonLines) > 0 {
		reasonsText = strings.Join(reasonLines, "\n")
	}

	return fmt.Sprintf(`Eres un asistente pedagógico para docentes de escuelas peruanas. Ayudas a identificar y apoyar a estudiantes en riesgo de deserción o bajo rendimiento.

Datos del estudiante (ficticios, solo para demostración):
- Nombre: %s
- Nivel: %s · %d° grado
- Institución: %s
- Zona: %s
- Lengua materna: %s
- Departamento: %s · Distrito: %s
- Tasa de deserción distrital 2023/24: primaria %.2f%%, secundaria %.2f%%

Nivel de riesgo detectado: %s
Factores:
%s

Responde ÚNICAMENTE con un objeto JSON con exactamente dos campos:
{
  "explanation": "2 a 3 oraciones dirigidas al docente explicando por qué este estudiante muestra señales de riesgo, contextualizando su situación (zona, idioma, factores). Tono cálido y profesional.",
  "suggested_action": "2 a 3 oraciones con una intervención concreta y adaptada al contexto. Si el estudiante tiene lengua materna indígena o vive en zona rural, incluye estrategias pertinentes."
}`,
		st.Name,
		levelLabel, st.Grade,
		st.SchoolName,
		zoneLabel,
		st.NativeLanguage,
		st.Department, st.DistrictName,
		st.PrimaryDropoutRate, st.SecondaryDropoutRate,
		riskLabels[risk.Level],
		reasonsText,
	)
}

func parseResponse(raw string) (explanation, suggestedAction string, err error) {
	raw = strings.TrimSpace(raw)

	start := strings.Index(raw, "{")
	end := strings.LastIndex(raw, "}")
	if start == -1 || end == -1 || end <= start {
		return "", "", fmt.Errorf("no JSON object found in response")
	}
	raw = raw[start : end+1]

	var parsed struct {
		Explanation     string `json:"explanation"`
		SuggestedAction string `json:"suggested_action"`
	}
	if err := json.Unmarshal([]byte(raw), &parsed); err != nil {
		return "", "", err
	}

	if parsed.Explanation == "" || parsed.SuggestedAction == "" {
		return "", "", fmt.Errorf("missing fields in llm response")
	}

	return parsed.Explanation, parsed.SuggestedAction, nil
}
