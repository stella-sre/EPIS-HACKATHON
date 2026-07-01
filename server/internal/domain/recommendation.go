package domain

import "time"

type Recommendation struct {
	ID              string
	StudentID       string
	AssessmentID    string
	Explanation     string
	SuggestedAction string
	GeneratedAt     time.Time
}

type RecommendationListItem struct {
	ID              string
	StudentID       string
	StudentName     string
	Explanation     string
	SuggestedAction string
	RiskLevel       string
	Reasons         []string
	GeneratedAt     time.Time
}
