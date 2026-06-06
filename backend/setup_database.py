"""
Haven Database Setup Script
----------------------------
Reads backend/sql/setup.sql and executes it against the Supabase PostgreSQL database.
Loads credentials from backend/.env — never prints connection strings or passwords.

Usage:
    cd backend && python setup_database.py
"""

import os
import sys

from dotenv import load_dotenv
import psycopg2

# Load environment variables from backend/.env
load_dotenv(os.path.join(os.path.dirname(__file__), ".env"))

DATABASE_URL = os.getenv("DATABASE_URL")

if not DATABASE_URL:
    print("ERROR: DATABASE_URL is not set. Check your backend/.env file.")
    sys.exit(1)

# Read the SQL setup file
sql_path = os.path.join(os.path.dirname(__file__), "sql", "setup.sql")

try:
    with open(sql_path, "r") as f:
        sql = f.read()
except FileNotFoundError:
    print(f"ERROR: SQL file not found at {sql_path}")
    sys.exit(1)

# Connect and execute
try:
    conn = psycopg2.connect(DATABASE_URL)
    conn.autocommit = True
    cur = conn.cursor()
    cur.execute(sql)
    cur.close()
    conn.close()
    print("Database initialization completed successfully")
except Exception as e:
    # Print the error but never the connection string
    print(f"ERROR: Database setup failed — {e}")
    sys.exit(1)