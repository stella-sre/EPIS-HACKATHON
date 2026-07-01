package main

import (
	"database/sql"
	"fmt"
	"os"
	"path/filepath"

	_ "github.com/jackc/pgx/v5/stdlib"
	"github.com/rs/zerolog"
	"github.com/rs/zerolog/log"
	"github.com/spf13/viper"
)

var tables = []string{
	"users",
	"districts",
	"students",
	"academic_records",
	"risk_assessments",
	"recommendations",
}

func main() {
	log.Logger = log.Output(zerolog.ConsoleWriter{Out: os.Stderr})
	zerolog.SetGlobalLevel(zerolog.InfoLevel)

	if len(os.Args) < 2 {
		log.Fatal().Msg("usage: migrate <up|down|status>")
	}

	viper.SetConfigFile(".env")
	viper.SetConfigType("env")
	viper.AutomaticEnv()
	if err := viper.ReadInConfig(); err != nil {
		log.Fatal().Err(err).Msg("failed to read .env")
	}

	pgURL := viper.GetString("PG_URL")
	if pgURL == "" {
		log.Fatal().Msg("PG_URL not set")
	}

	db, err := sql.Open("pgx", pgURL)
	if err != nil {
		log.Fatal().Err(err).Msg("failed to open db")
	}
	defer db.Close()

	if err := db.Ping(); err != nil {
		log.Fatal().Err(err).Msg("db unreachable")
	}

	switch os.Args[1] {
	case "up":
		execFile(db, filepath.Join("migrations", "init.up.sql"))
	case "down":
		execFile(db, filepath.Join("migrations", "init.down.sql"))
	case "status":
		status(db)
	default:
		log.Fatal().Str("cmd", os.Args[1]).Msg("unknown command — use up, down or status")
	}
}

func execFile(db *sql.DB, path string) {
	content, err := os.ReadFile(path)
	if err != nil {
		log.Fatal().Err(err).Str("file", path).Msg("cannot read migration file")
	}
	if _, err := db.Exec(string(content)); err != nil {
		log.Fatal().Err(err).Str("file", path).Msg("migration failed")
	}
	log.Info().Str("file", path).Msg("done")
}

func status(db *sql.DB) {
	fmt.Println()
	for _, t := range tables {
		var exists bool
		db.QueryRow(`
			SELECT EXISTS (
				SELECT FROM information_schema.tables
				WHERE table_schema = 'public' AND table_name = $1
			)`, t).Scan(&exists)

		mark := "✗ missing"
		if exists {
			mark = "✓ ok     "
		}
		fmt.Printf("  %s  %s\n", mark, t)
	}
	fmt.Println()
}
