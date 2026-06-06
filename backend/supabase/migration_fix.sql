-- ============================================================
-- Migration: Fix signup issues
-- Run this SQL in your Supabase SQL Editor to apply the changes.
-- ============================================================

-- Step 1: Remove the UNIQUE constraint from employee_id
-- (multiple employees can share the same employee_id)
ALTER TABLE employees DROP CONSTRAINT IF EXISTS employees_employee_id_key;

-- Step 2: Drop the foreign key on checkins.employee_id
-- (can't FK to a non-unique column)
ALTER TABLE checkins DROP CONSTRAINT IF EXISTS checkins_employee_id_fkey;

-- Step 3: Clean up orphaned test data (optional — uncomment if needed)
-- DELETE FROM checkins WHERE employee_id = '12345678';
-- DELETE FROM employees WHERE employee_id = '12345678';