package config

import (
	"fmt"

	"github.com/spf13/viper"
)

type Config struct {
	AppName        string
	Env            string
	Host           string
	Port           string
	PgURL          string
	JWTSecret      string
	MinimaxAPIKey string
}

func Load() (*Config, error) {
	viper.SetConfigFile(".env")
	viper.SetConfigType("env")
	viper.AutomaticEnv()

	if err := viper.ReadInConfig(); err != nil {
		return nil, fmt.Errorf("reading config: %w", err)
	}

	return &Config{
		AppName:       viper.GetString("APP_NAME"),
		Env:           viper.GetString("ENV"),
		Host:          viper.GetString("HOST"),
		Port:          viper.GetString("PORT"),
		PgURL:         viper.GetString("PG_URL"),
		JWTSecret:     viper.GetString("JWT_SECRET"),
		MinimaxAPIKey: viper.GetString("MINIMAX_API_KEY"),
	}, nil
}
