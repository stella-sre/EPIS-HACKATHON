-- ─── Roles ───────────────────────────────────────────────────────────────────

DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'education_app') THEN
        CREATE ROLE education_app LOGIN PASSWORD 'stella-dev';
    END IF;
    IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'education_readonly') THEN
        CREATE ROLE education_readonly;
    END IF;
END
$$;

-- ─── users ───────────────────────────────────────────────────────────────────
-- Application users (teachers / admins). password_hash stores bcrypt digest.

CREATE TABLE IF NOT EXISTS users (
    id            UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    email         TEXT        NOT NULL UNIQUE,
    name          TEXT        NOT NULL,
    password_hash TEXT        NOT NULL,
    role          TEXT        NOT NULL DEFAULT 'teacher'
                              CHECK (role IN ('admin', 'teacher')),
    created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ─── districts ───────────────────────────────────────────────────────────────
-- Populated by the seed from server/data CSV files (MINEDU-SIAGIE 2023/2024).
-- Provides real geographic and dropout-rate context for fictional students.

CREATE TABLE IF NOT EXISTS districts (
    ubigeo                 CHAR(6)      PRIMARY KEY,
    department             TEXT         NOT NULL,
    province               TEXT         NOT NULL,
    district_name          TEXT         NOT NULL,
    primary_dropout_count  INT,
    primary_enrollment     INT,
    primary_dropout_rate   NUMERIC(10,6),
    secondary_dropout_count INT,
    secondary_enrollment   INT,
    secondary_dropout_rate NUMERIC(10,6)
);

-- ─── students ────────────────────────────────────────────────────────────────
-- Fictional students generated from real district statistics.

CREATE TABLE IF NOT EXISTS students (
    id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    name            TEXT        NOT NULL,
    school_name     TEXT        NOT NULL,
    zone            TEXT        NOT NULL CHECK (zone IN ('rural', 'urban')),
    native_language TEXT,
    ubigeo          CHAR(6)     REFERENCES districts(ubigeo),
    education_level TEXT        NOT NULL CHECK (education_level IN ('primary', 'secondary')),
    grade           INT         NOT NULL,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT chk_grade CHECK (
        (education_level = 'primary'   AND grade BETWEEN 1 AND 6) OR
        (education_level = 'secondary' AND grade BETWEEN 1 AND 5)
    )
);

-- ─── academic_records ────────────────────────────────────────────────────────
-- Per-term tracking data used by the risk engine.
-- grade_avg scale: 0–20 (Peruvian grading system).

CREATE TABLE IF NOT EXISTS academic_records (
    id             UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id     UUID         NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    term           INT          NOT NULL CHECK (term BETWEEN 1 AND 4),
    attendance_pct NUMERIC(5,2) NOT NULL CHECK (attendance_pct BETWEEN 0 AND 100),
    grade_avg      NUMERIC(4,2) NOT NULL CHECK (grade_avg  BETWEEN 0 AND 20),
    participation  INT          NOT NULL CHECK (participation BETWEEN 1 AND 5),
    UNIQUE (student_id, term)
);

-- ─── risk_assessments ────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS risk_assessments (
    id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id  UUID        NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    risk_level  TEXT        NOT NULL CHECK (risk_level IN ('low', 'medium', 'high')),
    reasons     TEXT[]      NOT NULL,
    assessed_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ─── recommendations ─────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS recommendations (
    id               UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id       UUID        NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    assessment_id    UUID        REFERENCES risk_assessments(id) ON DELETE SET NULL,
    explanation      TEXT        NOT NULL,
    suggested_action TEXT        NOT NULL,
    generated_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ─── Indexes ─────────────────────────────────────────────────────────────────

CREATE INDEX IF NOT EXISTS idx_users_email              ON users             (email);
CREATE INDEX IF NOT EXISTS idx_students_ubigeo          ON students          (ubigeo);
CREATE INDEX IF NOT EXISTS idx_academic_student         ON academic_records  (student_id);
CREATE INDEX IF NOT EXISTS idx_risk_student             ON risk_assessments  (student_id);
CREATE INDEX IF NOT EXISTS idx_recommendations_student  ON recommendations   (student_id);
CREATE INDEX IF NOT EXISTS idx_recommendations_assess   ON recommendations   (assessment_id);

-- ─── Grants ──────────────────────────────────────────────────────────────────

GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO education_app;
GRANT SELECT                         ON ALL TABLES IN SCHEMA public TO education_readonly;
