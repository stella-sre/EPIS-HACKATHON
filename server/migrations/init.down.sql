-- metrics (reverse dependency order)
DROP TABLE IF EXISTS metrics.outcome_tracking;
DROP TABLE IF EXISTS metrics.alert_events;
DROP TABLE IF EXISTS metrics.recommendation_feedback;
DROP TABLE IF EXISTS metrics.risk_snapshots;
DROP TABLE IF EXISTS metrics.api_requests;

-- academic
DROP TABLE IF EXISTS academic.recommendations;
DROP TABLE IF EXISTS academic.risk_assessments;
DROP TABLE IF EXISTS academic.academic_records;
DROP TABLE IF EXISTS academic.students;
DROP TABLE IF EXISTS academic.schools;
DROP TABLE IF EXISTS academic.districts;

-- auth
DROP TABLE IF EXISTS auth.user_roles;
DROP TABLE IF EXISTS auth.users;
DROP TABLE IF EXISTS auth.roles;

-- schemas
DROP SCHEMA IF EXISTS metrics;
DROP SCHEMA IF EXISTS academic;
DROP SCHEMA IF EXISTS auth;

-- db roles
DROP ROLE IF EXISTS education_readonly;
DROP ROLE IF EXISTS education_app;
