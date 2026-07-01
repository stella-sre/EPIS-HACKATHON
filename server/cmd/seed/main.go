package main

import (
	"database/sql"
	"encoding/csv"
	"fmt"
	"math/rand"
	"os"
	"path/filepath"
	"strconv"
	"strings"

	_ "github.com/jackc/pgx/v5/stdlib"
	"github.com/rs/zerolog"
	"github.com/rs/zerolog/log"
	"github.com/spf13/viper"

	"server/pkg/argon2id"
)

func main() {
	log.Logger = log.Output(zerolog.ConsoleWriter{Out: os.Stderr})
	zerolog.SetGlobalLevel(zerolog.InfoLevel)

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
		log.Fatal().Err(err).Msg("db unreachable — run make db/start first")
	}

	runMigrations(db)
	seedRoles(db)
	seedUsers(db)
	seedDistricts(db)
	seedStudents(db)

	log.Info().Msg("seed complete")
}

func runMigrations(db *sql.DB) {
	log.Info().Msg("running migrations...")
	content, err := os.ReadFile(filepath.Join("migrations", "init.up.sql"))
	if err != nil {
		log.Fatal().Err(err).Msg("cannot read init.up.sql")
	}
	if _, err := db.Exec(string(content)); err != nil {
		log.Fatal().Err(err).Msg("migration failed")
	}
	log.Info().Msg("migrations applied")
}

func seedRoles(db *sql.DB) {
	log.Info().Msg("seeding roles...")
	for _, name := range []string{"admin", "teacher"} {
		db.Exec(`INSERT INTO auth.roles (name) VALUES ($1) ON CONFLICT (name) DO NOTHING`, name)
	}
	log.Info().Msg("roles ready")
}

func seedUsers(db *sql.DB) {
	log.Info().Msg("seeding users...")

	adminID := upsertUser(db, "admin@education.pe", "Admin Demo", "admin123")
	teacherID := upsertUser(db, "teacher@education.pe", "Docente Demo", "teacher123")

	assignRole(db, adminID, "admin")
	assignRole(db, teacherID, "teacher")

	log.Info().Msg("users ready")
}

func upsertUser(db *sql.DB, email, name, password string) string {
	hash, err := argon2id.Hash(password)
	if err != nil {
		log.Fatal().Err(err).Msg("argon2id hash failed")
	}

	var id string
	db.QueryRow(`
		INSERT INTO auth.users (email, name, password_hash)
		VALUES ($1, $2, $3)
		ON CONFLICT (email) DO UPDATE SET name = EXCLUDED.name
		RETURNING id`,
		email, name, hash,
	).Scan(&id)

	return id
}

func assignRole(db *sql.DB, userID, roleName string) {
	db.Exec(`
		INSERT INTO auth.user_roles (user_id, role_id)
		SELECT $1, id FROM auth.roles WHERE name = $2
		ON CONFLICT DO NOTHING`,
		userID, roleName)
}

func seedDistricts(db *sql.DB) {
	log.Info().Msg("seeding districts from CSV...")
	loadDistrictCSV(db, filepath.Join("data", "desertores_Ed_Prim_2023-2024.csv"), "primary")
	loadDistrictCSV(db, filepath.Join("data", "desertores_Ed_Sec_2023-2024.csv"), "secondary")

	var n int
	db.QueryRow("SELECT COUNT(*) FROM academic.districts").Scan(&n)
	log.Info().Int("total", n).Msg("districts ready")
}

func loadDistrictCSV(db *sql.DB, path, level string) {
	f, err := os.Open(path)
	if err != nil {
		log.Fatal().Err(err).Str("file", path).Msg("cannot open CSV")
	}
	defer f.Close()

	rows, err := csv.NewReader(f).ReadAll()
	if err != nil {
		log.Fatal().Err(err).Str("file", path).Msg("CSV read error")
	}

	for _, row := range rows[1:] {
		ubigeoInt, _ := strconv.Atoi(strings.TrimSpace(row[0]))
		ubigeo := fmt.Sprintf("%06d", ubigeoInt)
		dept := strings.TrimSpace(row[1])
		prov := strings.TrimSpace(row[2])
		dist := strings.TrimSpace(row[3])
		dropouts, _ := strconv.Atoi(strings.TrimSpace(row[4]))
		enrollment, _ := strconv.Atoi(strings.TrimSpace(row[5]))
		rate, _ := strconv.ParseFloat(strings.TrimSpace(row[6]), 64)

		if level == "primary" {
			db.Exec(`
				INSERT INTO academic.districts
					(ubigeo, department, province, district_name,
					 primary_dropout_count, primary_enrollment, primary_dropout_rate)
				VALUES ($1,$2,$3,$4,$5,$6,$7)
				ON CONFLICT (ubigeo) DO UPDATE SET
					primary_dropout_count = EXCLUDED.primary_dropout_count,
					primary_enrollment    = EXCLUDED.primary_enrollment,
					primary_dropout_rate  = EXCLUDED.primary_dropout_rate`,
				ubigeo, dept, prov, dist, dropouts, enrollment, rate)
		} else {
			db.Exec(`
				INSERT INTO academic.districts
					(ubigeo, department, province, district_name,
					 secondary_dropout_count, secondary_enrollment, secondary_dropout_rate)
				VALUES ($1,$2,$3,$4,$5,$6,$7)
				ON CONFLICT (ubigeo) DO UPDATE SET
					secondary_dropout_count = EXCLUDED.secondary_dropout_count,
					secondary_enrollment    = EXCLUDED.secondary_enrollment,
					secondary_dropout_rate  = EXCLUDED.secondary_dropout_rate`,
				ubigeo, dept, prov, dist, dropouts, enrollment, rate)
		}
	}
}

type districtRow struct {
	ubigeo        string
	department    string
	districtName  string
	primaryRate   float64
	secondaryRate float64
}

var firstNames = []string{
	"Carlos", "María", "Juan", "Ana", "Luis", "Rosa", "Pedro", "Carmen",
	"Jorge", "Lucía", "Miguel", "Teresa", "Roberto", "Elena", "Fernando",
	"Patricia", "Alberto", "Daniela", "Ricardo", "Sandra",
}

var lastNames = []string{
	"Quispe", "Mamani", "Condori", "Flores", "García", "López", "Martínez",
	"Huanca", "Ccapa", "Apaza", "Ramos", "Torres", "Vargas", "Mendoza",
	"Gutiérrez", "Chávez", "Rojas", "Morales", "Suárez", "Díaz",
}

var quechuaDepts = map[string]bool{
	"AYACUCHO": true, "CUSCO": true, "APURIMAC": true,
	"PUNO": true, "HUANCAVELICA": true,
}

func seedStudents(db *sql.DB) {
	var existing int
	db.QueryRow("SELECT COUNT(*) FROM academic.students").Scan(&existing)
	if existing > 0 {
		log.Info().Int("existing", existing).Msg("students already seeded — skipping")
		return
	}

	log.Info().Msg("seeding students...")

	rows, err := db.Query(`
		SELECT ubigeo, department, district_name,
		       COALESCE(primary_dropout_rate, 0),
		       COALESCE(secondary_dropout_rate, 0)
		FROM   academic.districts
		WHERE  primary_dropout_rate > 0 OR secondary_dropout_rate > 0
		ORDER  BY RANDOM()
		LIMIT  20`)
	if err != nil {
		log.Fatal().Err(err).Msg("query districts")
	}
	defer rows.Close()

	var districts []districtRow
	for rows.Next() {
		var d districtRow
		rows.Scan(&d.ubigeo, &d.department, &d.districtName, &d.primaryRate, &d.secondaryRate)
		districts = append(districts, d)
	}

	rng := rand.New(rand.NewSource(42))

	for _, d := range districts {
		level, rate := "primary", d.primaryRate
		if rng.Float64() > 0.5 {
			level, rate = "secondary", d.secondaryRate
		}

		zone := "urban"
		if rate > 2.0 {
			zone = "rural"
		}

		schoolName := fmt.Sprintf("IE N° %d %s", 10000+rng.Intn(90000), d.districtName)
		var schoolID string
		db.QueryRow(`
			INSERT INTO academic.schools (name, ubigeo, zone, level)
			VALUES ($1,$2,$3,$4) RETURNING id`,
			schoolName, d.ubigeo, zone, level,
		).Scan(&schoolID)

		grade := rng.Intn(6) + 1
		if level == "secondary" {
			grade = rng.Intn(5) + 1
		}

		name := fmt.Sprintf("%s %s %s",
			firstNames[rng.Intn(len(firstNames))],
			lastNames[rng.Intn(len(lastNames))],
			lastNames[rng.Intn(len(lastNames))],
		)
		lang := "Español"
		if quechuaDepts[d.department] && rng.Float64() > 0.4 {
			lang = "Quechua"
		}

		var studentID string
		err := db.QueryRow(`
			INSERT INTO academic.students (name, school_id, native_language, education_level, grade)
			VALUES ($1,$2,$3,$4,$5) RETURNING id`,
			name, schoolID, lang, level, grade,
		).Scan(&studentID)
		if err != nil {
			log.Error().Err(err).Str("name", name).Msg("insert student")
			continue
		}

		seedAcademicRecords(db, studentID, rate, rng)
	}

	var total int
	db.QueryRow("SELECT COUNT(*) FROM academic.students").Scan(&total)
	log.Info().Int("total", total).Msg("students ready")
}

func seedAcademicRecords(db *sql.DB, studentID string, dropoutRate float64, rng *rand.Rand) {
	baseAttendance := clamp(95.0-(dropoutRate*3), 50, 100)
	baseGrade := clamp(17.0-(dropoutRate*1.2), 8, 20)

	for term := 1; term <= 4; term++ {
		attendance := clamp(baseAttendance+(rng.Float64()*10-5), 0, 100)
		grade := clamp(baseGrade+(rng.Float64()*4-2), 0, 20)
		participation := rng.Intn(3) + 2
		if dropoutRate > 5 {
			participation = rng.Intn(3) + 1
		}

		db.Exec(`
			INSERT INTO academic.academic_records
				(student_id, term, attendance_pct, grade_avg, participation)
			VALUES ($1,$2,$3,$4,$5)
			ON CONFLICT (student_id, term) DO NOTHING`,
			studentID, term, attendance, grade, participation)
	}
}

func clamp(v, min, max float64) float64 {
	if v < min {
		return min
	}
	if v > max {
		return max
	}
	return v
}
