package service

import (
	"context"
	"database/sql"
	"errors"
	"time"

	"github.com/golang-jwt/jwt/v5"

	"server/internal/domain"
	"server/internal/dto"
	"server/internal/repository"
	"server/pkg/argon2id"
)

var (
	ErrInvalidCredentials = errors.New("invalid email or password")
	ErrInactiveAccount    = errors.New("account is not active")
)

type AuthService struct {
	users     repository.UserRepository
	jwtSecret []byte
	jwtTTL    time.Duration
}

func NewAuthService(users repository.UserRepository, jwtSecret string) *AuthService {
	return &AuthService{
		users:     users,
		jwtSecret: []byte(jwtSecret),
		jwtTTL:    24 * time.Hour,
	}
}

type claims struct {
	Email string   `json:"email"`
	Roles []string `json:"roles"`
	jwt.RegisteredClaims
}

func (s *AuthService) SignIn(ctx context.Context, req dto.SignInRequest) (*dto.SignInResponse, error) {
	user, err := s.users.FindByEmail(ctx, req.Email)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, ErrInvalidCredentials
		}
		return nil, err
	}

	if !user.IsActive {
		return nil, ErrInactiveAccount
	}

	ok, err := argon2id.Verify(req.Password, user.PasswordHash)
	if err != nil || !ok {
		return nil, ErrInvalidCredentials
	}

	token, err := s.issueToken(user)
	if err != nil {
		return nil, err
	}

	return &dto.SignInResponse{
		Token: token,
		User: dto.UserDTO{
			ID:    user.ID,
			Email: user.Email,
			Name:  user.Name,
			Roles: user.Roles,
		},
	}, nil
}

func (s *AuthService) issueToken(u *domain.User) (string, error) {
	now := time.Now()
	t := jwt.NewWithClaims(jwt.SigningMethodHS256, claims{
		Email: u.Email,
		Roles: u.Roles,
		RegisteredClaims: jwt.RegisteredClaims{
			Subject:   u.ID,
			IssuedAt:  jwt.NewNumericDate(now),
			ExpiresAt: jwt.NewNumericDate(now.Add(s.jwtTTL)),
		},
	})
	return t.SignedString(s.jwtSecret)
}
