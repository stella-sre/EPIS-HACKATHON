-- reverse dependency order

DROP TABLE IF EXISTS recommendations;
DROP TABLE IF EXISTS risk_assessments;
DROP TABLE IF EXISTS academic_records;
DROP TABLE IF EXISTS students;
DROP TABLE IF EXISTS districts;
DROP TABLE IF EXISTS users;

DROP ROLE IF EXISTS education_readonly;
DROP ROLE IF EXISTS education_app;
