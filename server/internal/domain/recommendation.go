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
