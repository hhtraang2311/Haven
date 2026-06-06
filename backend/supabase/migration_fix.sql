-- ============================================================
-- Migration: Fix signup issues
-- Run this SQL in your Supabase SQL Editor.
-- ============================================================

-- Step 1: Remove UNIQUE constraint from employee_id
-- (multiple employees can share the same employee_id)
ALTER TABLE employees DROP CONSTRAINT IF EXISTS employees_employee_id_key;

-- Step 2: Drop foreign key on checkins.employee_id
-- (can't FK to a non-unique column)
ALTER TABLE checkins DROP CONSTRAINT IF EXISTS checkins_employee_id_fkey;

-- Step 3: Clean up all test data (start fresh)
DELETE FROM checkins;
DELETE FROM employees;

-- Step 4: After running this, go to Authentication → Users
-- and delete all test users manually.