-- Haven Database Schema
-- Run this SQL in your Supabase SQL Editor to create the required tables.

-- Stores employee sign-up information
-- employee_id is NOT unique — multiple employees can share the same ID.
-- Users are differentiated by email (Supabase Auth).
CREATE TABLE employees (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    company text,
    department text,
    first_name text,
    last_name text,
    employee_id text,
    email text UNIQUE,
    created_at timestamp DEFAULT now()
);

-- Stores daily wellbeing check-in responses
-- No FK to employees(employee_id) since employee_id is not unique.
CREATE TABLE checkins (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    employee_id text,
    submitted_at timestamp DEFAULT now(),
    q1 int, q2 int, q3 int, q4 int,
    q5 int, q6 int, q7 int, q8 int,
    sleep_score float,
    workload_score float,
    relationships_score float,
    motivation_score float,
    total_score float,
    avg_score float,
    burnout_risk text
);