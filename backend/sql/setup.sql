-- Haven Database Setup Script
-- Run via backend/setup_database.py or directly in Supabase SQL Editor.

-- 1. Enable pgcrypto for gen_random_uuid()
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- 2. Employees table (drop and recreate for a clean slate)
DROP TABLE IF EXISTS public.checkins;   -- drop child table first due to FK
DROP TABLE IF EXISTS public.employees;

CREATE TABLE public.employees (
    id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    company     text NOT NULL,
    department  text NOT NULL,
    first_name  text NOT NULL,
    last_name   text NOT NULL,
    employee_id text NOT NULL UNIQUE,
    email       text NOT NULL UNIQUE,
    created_at  timestamptz NOT NULL DEFAULT now()
);

-- 3. Checkins table (create only if it doesn't already exist)
CREATE TABLE IF NOT EXISTS public.checkins (
    id                   uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    employee_id          text NOT NULL REFERENCES public.employees(employee_id) ON DELETE CASCADE,
    submitted_at         timestamptz NOT NULL DEFAULT now(),
    q1                   integer NOT NULL,
    q2                   integer NOT NULL,
    q3                   integer NOT NULL,
    q4                   integer NOT NULL,
    q5                   integer NOT NULL,
    q6                   integer NOT NULL,
    q7                   integer NOT NULL,
    q8                   integer NOT NULL,
    sleep_score          float NOT NULL,
    workload_score       float NOT NULL,
    relationships_score  float NOT NULL,
    motivation_score     float NOT NULL,
    total_score          float NOT NULL,
    avg_score            float NOT NULL,
    burnout_risk         text NOT NULL,
    -- Ensure all q1–q8 scores are between 1 and 5
    CONSTRAINT chk_q1_range CHECK (q1 BETWEEN 1 AND 5),
    CONSTRAINT chk_q2_range CHECK (q2 BETWEEN 1 AND 5),
    CONSTRAINT chk_q3_range CHECK (q3 BETWEEN 1 AND 5),
    CONSTRAINT chk_q4_range CHECK (q4 BETWEEN 1 AND 5),
    CONSTRAINT chk_q5_range CHECK (q5 BETWEEN 1 AND 5),
    CONSTRAINT chk_q6_range CHECK (q6 BETWEEN 1 AND 5),
    CONSTRAINT chk_q7_range CHECK (q7 BETWEEN 1 AND 5),
    CONSTRAINT chk_q8_range CHECK (q8 BETWEEN 1 AND 5)
);

-- 4. Fix the Supabase Auth trigger that fails because it references
--    columns that no longer exist. Our backend handles employee creation,
--    so the trigger just needs to return the new user without doing anything.
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN NEW;
END;
$$;

-- 5. Indexes for common queries
CREATE INDEX IF NOT EXISTS idx_checkins_employee_id  ON public.checkins (employee_id);
CREATE INDEX IF NOT EXISTS idx_checkins_submitted_at ON public.checkins (submitted_at DESC);