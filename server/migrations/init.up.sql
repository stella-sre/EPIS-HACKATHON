-- ─── Schemas ─────────────────────────────────────────────────────────────────

CREATE SCHEMA IF NOT EXISTS auth;
CREATE SCHEMA IF NOT EXISTS academic;
CREATE SCHEMA IF NOT EXISTS metrics;

-- ─── DB roles ────────────────────────────────────────────────────────────────

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

-- ═══════════════════════════════════════════════════════════════════════════════
-- auth
-- ═══════════════════════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS auth.roles (
    id   SMALLINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    name TEXT     NOT NULL UNIQUE CHECK (name IN ('admin', 'teacher'))
);

CREATE TABLE IF NOT EXISTS auth.users (
    id            UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    email         TEXT        NOT NULL UNIQUE,
    name          TEXT        NOT NULL,
    password_hash TEXT        NOT NULL,
    is_active     BOOLEAN     NOT NULL DEFAULT true,
    created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- many-to-many: a user can hold several roles
CREATE TABLE IF NOT EXISTS auth.user_roles (
    user_id    UUID        NOT NULL REFERENCES auth.users(id)  ON DELETE CASCADE,
    role_id    SMALLINT    NOT NULL REFERENCES auth.roles(id)  ON DELETE RESTRICT,
    granted_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    granted_by UUID                 REFERENCES auth.users(id)  ON DELETE SET NULL,
    PRIMARY KEY (user_id, role_id)
);

-- ═══════════════════════════════════════════════════════════════════════════════
-- academic
-- ═══════════════════════════════════════════════════════════════════════════════

-- Reference table loaded from MINEDU-SIAGIE CSV files (server/data/)
CREATE TABLE IF NOT EXISTS academic.districts (
    ubigeo                  CHAR(6)      PRIMARY KEY,
    department              TEXT         NOT NULL,
    province                TEXT         NOT NULL,
    district_name           TEXT         NOT NULL,
    primary_dropout_count   INT,
    primary_enrollment      INT,
    primary_dropout_rate    NUMERIC(10,6),
    secondary_dropout_count INT,
    secondary_enrollment    INT,
    secondary_dropout_rate  NUMERIC(10,6)
);

-- Normalized: school belongs to a district
CREATE TABLE IF NOT EXISTS academic.schools (
    id     UUID    PRIMARY KEY DEFAULT gen_random_uuid(),
    name   TEXT    NOT NULL,
    ubigeo CHAR(6) REFERENCES academic.districts(ubigeo),
    zone   TEXT    NOT NULL CHECK (zone IN ('rural', 'urban')),
    level  TEXT    NOT NULL CHECK (level IN ('primary', 'secondary', 'both'))
);

-- Fictional students — name is a pseudonym, no real minors
CREATE TABLE IF NOT EXISTS academic.students (
    id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    name            TEXT        NOT NULL,
    school_id       UUID        REFERENCES academic.schools(id),
    native_language TEXT        NOT NULL DEFAULT 'Español',
    education_level TEXT        NOT NULL CHECK (education_level IN ('primary', 'secondary')),
    grade           INT         NOT NULL,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT chk_grade CHECK (
        (education_level = 'primary'   AND grade BETWEEN 1 AND 6) OR
        (education_level = 'secondary' AND grade BETWEEN 1 AND 5)
    )
);

-- Per-term academic tracking (Peruvian scale 0–20)
CREATE TABLE IF NOT EXISTS academic.academic_records (
    id             UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id     UUID         NOT NULL REFERENCES academic.students(id) ON DELETE CASCADE,
    term           INT          NOT NULL CHECK (term BETWEEN 1 AND 4),
    attendance_pct NUMERIC(5,2) NOT NULL CHECK (attendance_pct BETWEEN 0 AND 100),
    grade_avg      NUMERIC(4,2) NOT NULL CHECK (grade_avg     BETWEEN 0 AND 20),
    participation  INT          NOT NULL CHECK (participation  BETWEEN 1 AND 5),
    recorded_at    TIMESTAMPTZ  NOT NULL DEFAULT now(),
    UNIQUE (student_id, term)
);

-- Explainable risk engine output
CREATE TABLE IF NOT EXISTS academic.risk_assessments (
    id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id  UUID        NOT NULL REFERENCES academic.students(id) ON DELETE CASCADE,
    risk_level  TEXT        NOT NULL CHECK (risk_level IN ('low', 'medium', 'high')),
    reasons     TEXT[]      NOT NULL,
    assessed_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- LLM-generated recommendations linked to a specific assessment
CREATE TABLE IF NOT EXISTS academic.recommendations (
    id               UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id       UUID        NOT NULL REFERENCES academic.students(id)       ON DELETE CASCADE,
    assessment_id    UUID                 REFERENCES academic.risk_assessments(id) ON DELETE SET NULL,
    explanation      TEXT        NOT NULL,
    suggested_action TEXT        NOT NULL,
    generated_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ═══════════════════════════════════════════════════════════════════════════════
-- metrics
-- ═══════════════════════════════════════════════════════════════════════════════

-- API request log — latency and usage tracking
CREATE TABLE IF NOT EXISTS metrics.api_requests (
    id          BIGINT      PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    method      TEXT        NOT NULL,
    path        TEXT        NOT NULL,
    status_code INT         NOT NULL,
    latency_ms  INT         NOT NULL,
    ip          TEXT,
    user_id     UUID        REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Point-in-time risk snapshots for trend charts
CREATE TABLE IF NOT EXISTS metrics.risk_snapshots (
    id         BIGINT      PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    student_id UUID        NOT NULL REFERENCES academic.students(id) ON DELETE CASCADE,
    risk_level TEXT        NOT NULL CHECK (risk_level IN ('low', 'medium', 'high')),
    snapped_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Teacher feedback loop: was the AI recommendation useful?
CREATE TABLE IF NOT EXISTS metrics.recommendation_feedback (
    id                UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    recommendation_id UUID        NOT NULL REFERENCES academic.recommendations(id) ON DELETE CASCADE,
    user_id           UUID        NOT NULL REFERENCES auth.users(id)               ON DELETE CASCADE,
    was_useful        BOOLEAN     NOT NULL,
    comment           TEXT,
    submitted_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE (recommendation_id, user_id)
);

-- Early-warning events triggered by the risk engine
CREATE TABLE IF NOT EXISTS metrics.alert_events (
    id           BIGINT      PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    student_id   UUID        NOT NULL REFERENCES academic.students(id) ON DELETE CASCADE,
    alert_type   TEXT        NOT NULL CHECK (alert_type IN (
                                 'high_risk',
                                 'attendance_drop',
                                 'grade_drop',
                                 'participation_drop'
                             )),
    detail       TEXT,
    triggered_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    resolved_at  TIMESTAMPTZ
);

-- Model accuracy tracker: predicted risk vs actual outcome
CREATE TABLE IF NOT EXISTS metrics.outcome_tracking (
    id                UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id        UUID        NOT NULL REFERENCES academic.students(id) ON DELETE CASCADE,
    assessment_id     UUID        NOT NULL REFERENCES academic.risk_assessments(id) ON DELETE CASCADE,
    predicted_level   TEXT        NOT NULL CHECK (predicted_level IN ('low', 'medium', 'high')),
    actual_dropped_out BOOLEAN,
    evaluated_at      TIMESTAMPTZ,
    created_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE (student_id, assessment_id)
);

-- ─── Indexes ─────────────────────────────────────────────────────────────────

-- auth
CREATE INDEX IF NOT EXISTS idx_users_email         ON auth.users      (email);
CREATE INDEX IF NOT EXISTS idx_user_roles_user     ON auth.user_roles (user_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_role     ON auth.user_roles (role_id);

-- academic
CREATE INDEX IF NOT EXISTS idx_schools_ubigeo      ON academic.schools          (ubigeo);
CREATE INDEX IF NOT EXISTS idx_students_school     ON academic.students         (school_id);
CREATE INDEX IF NOT EXISTS idx_records_student     ON academic.academic_records (student_id);
CREATE INDEX IF NOT EXISTS idx_risk_student        ON academic.risk_assessments (student_id);
CREATE INDEX IF NOT EXISTS idx_risk_level          ON academic.risk_assessments (risk_level);
CREATE INDEX IF NOT EXISTS idx_recom_student       ON academic.recommendations  (student_id);
CREATE INDEX IF NOT EXISTS idx_recom_assessment    ON academic.recommendations  (assessment_id);

-- metrics
CREATE INDEX IF NOT EXISTS idx_api_created         ON metrics.api_requests           (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_api_path            ON metrics.api_requests           (path, method);
CREATE INDEX IF NOT EXISTS idx_snapshots_student   ON metrics.risk_snapshots         (student_id, snapped_at DESC);
CREATE INDEX IF NOT EXISTS idx_alerts_student      ON metrics.alert_events           (student_id);
CREATE INDEX IF NOT EXISTS idx_alerts_type         ON metrics.alert_events           (alert_type, triggered_at DESC);
CREATE INDEX IF NOT EXISTS idx_outcome_student     ON metrics.outcome_tracking       (student_id);

-- ─── Grants ──────────────────────────────────────────────────────────────────

GRANT USAGE ON SCHEMA auth, academic, metrics TO education_app;
GRANT USAGE ON SCHEMA auth, academic, metrics TO education_readonly;

GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA auth     TO education_app;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA academic TO education_app;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA metrics  TO education_app;

GRANT SELECT ON ALL TABLES IN SCHEMA auth     TO education_readonly;
GRANT SELECT ON ALL TABLES IN SCHEMA academic TO education_readonly;
GRANT SELECT ON ALL TABLES IN SCHEMA metrics  TO education_readonly;
