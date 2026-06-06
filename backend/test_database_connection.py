"""
Haven Database Connection Test
-------------------------------
Connects to the Supabase PostgreSQL database and verifies that both
the employees and checkins tables exist.

Usage:
    cd backend && python test_database_connection.py
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

# Tables we expect to find
REQUIRED_TABLES = ["public.employees", "public.checkins"]

try:
    conn = psycopg2.connect(DATABASE_URL)
    cur = conn.cursor()

    print("Database connection successful")

    for table in REQUIRED_TABLES:
        schema, name = table.split(".")
        cur.execute(
            "SELECT EXISTS ("
            "  SELECT 1 FROM information_schema.tables "
            "  WHERE table_schema = %s AND table_name = %s"
            ");",
            (schema, name),
        )
        exists = cur.fetchone()[0]
        if exists:
            print(f"Table found: {table}")
        else:
            print(f"Table MISSING: {table}")
            sys.exit(1)

    cur.close()
    conn.close()

except Exception as e:
    # Print the error but never the connection string
    print(f"ERROR: Database test failed — {e}")
    sys.exit(1)