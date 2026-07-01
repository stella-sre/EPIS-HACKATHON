package dto

type RecommendationResponse struct {
	ID              string  `json:"id"`
	StudentID       string  `json:"student_id"`
	AssessmentID    string  `json:"assessment_id,omitempty"`
	Explanation     string  `json:"explanation"`
	SuggestedAction string  `json:"suggested_action"`
	GeneratedAt     string  `json:"generated_at"`
	Risk            RiskDTO `json:"risk"`
}

type RecommendationListItem struct {
	ID              string  `json:"id"`
	StudentID       string  `json:"student_id"`
	StudentName     string  `json:"student_name"`
	Explanation     string  `json:"explanation"`
	SuggestedAction string  `json:"suggested_action"`
	GeneratedAt     string  `json:"generated_at"`
	Risk            RiskDTO `json:"risk"`
}
