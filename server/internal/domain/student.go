package domain

import "time"

type RiskLevel string

const (
	RiskLow    RiskLevel = "low"
	RiskMedium RiskLevel = "medium"
	RiskHigh   RiskLevel = "high"
)

type RiskResult struct {
	Level   RiskLevel
	Reasons []string
}

type AcademicRecord struct {
	Term          int
	AttendancePct float64
	GradeAvg      float64
	Participation int
}

type StudentSummary struct {
	ID             string
	Name           string
	SchoolName     string
	Zone           string
	EducationLevel string
	Grade          int
	NativeLanguage string
	Records        []AcademicRecord
}

type StudentDetail struct {
	StudentSummary
	Department           string
	DistrictName         string
	PrimaryDropoutRate   float64
	SecondaryDropoutRate float64
}

type RiskAssessment struct {
	ID         string
	StudentID  string
	Level      RiskLevel
	Reasons    []string
	AssessedAt time.Time
}
