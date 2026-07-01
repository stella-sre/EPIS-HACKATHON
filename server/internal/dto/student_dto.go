package dto

type RecordDTO struct {
	Term          int     `json:"term"`
	AttendancePct float64 `json:"attendance_pct"`
	GradeAvg      float64 `json:"grade_avg"`
	Participation int     `json:"participation"`
}

type RiskDTO struct {
	Level   string   `json:"level"`
	Reasons []string `json:"reasons"`
}

type StudentListItem struct {
	ID             string  `json:"id"`
	Name           string  `json:"name"`
	SchoolName     string  `json:"school_name"`
	Zone           string  `json:"zone"`
	EducationLevel string  `json:"education_level"`
	Grade          int     `json:"grade"`
	NativeLanguage string  `json:"native_language"`
	Risk           RiskDTO `json:"risk"`
}

type DistrictDTO struct {
	Name                 string  `json:"name"`
	Department           string  `json:"department"`
	PrimaryDropoutRate   float64 `json:"primary_dropout_rate"`
	SecondaryDropoutRate float64 `json:"secondary_dropout_rate"`
}

type StudentDetail struct {
	StudentListItem
	District DistrictDTO `json:"district"`
	Records  []RecordDTO `json:"records"`
}

type AssessResponse struct {
	ID         string   `json:"id"`
	StudentID  string   `json:"student_id"`
	RiskLevel  string   `json:"risk_level"`
	Reasons    []string `json:"reasons"`
	AssessedAt string   `json:"assessed_at"`
}

type CreateStudentInput struct {
	Name           string `json:"name"`
	SchoolName     string `json:"school_name"`
	Zone           string `json:"zone"`
	EducationLevel string `json:"education_level"`
	Grade          int    `json:"grade"`
	NativeLanguage string `json:"native_language"`
}

type UpsertRecordInput struct {
	Term          int     `json:"term"`
	AttendancePct float64 `json:"attendance_pct"`
	GradeAvg      float64 `json:"grade_avg"`
	Participation int     `json:"participation"`
}
