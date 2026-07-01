package postgres

import (
	"context"
	"database/sql"

	"server/internal/domain"
)

type userRepository struct {
	db *sql.DB
}

func NewUserRepository(db *sql.DB) *userRepository {
	return &userRepository{db: db}
}

func (r *userRepository) FindByEmail(ctx context.Context, email string) (*domain.User, error) {
	u := &domain.User{}

	err := r.db.QueryRowContext(ctx, `
		SELECT id, email, name, password_hash, is_active, created_at, updated_at
		FROM   auth.users
		WHERE  email = $1 AND is_active = true`,
		email,
	).Scan(&u.ID, &u.Email, &u.Name, &u.PasswordHash, &u.IsActive, &u.CreatedAt, &u.UpdatedAt)
	if err != nil {
		return nil, err
	}

	rows, err := r.db.QueryContext(ctx, `
		SELECT r.name
		FROM   auth.user_roles ur
		JOIN   auth.roles r ON r.id = ur.role_id
		WHERE  ur.user_id = $1`,
		u.ID,
	)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	for rows.Next() {
		var role string
		rows.Scan(&role)
		u.Roles = append(u.Roles, role)
	}

	return u, rows.Err()
}
