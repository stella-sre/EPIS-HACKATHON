package domain

import "time"

type User struct {
	ID           string
	Email        string
	Name         string
	PasswordHash string
	IsActive     bool
	Roles        []string
	CreatedAt    time.Time
	UpdatedAt    time.Time
}
