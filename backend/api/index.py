"""
Haven Backend API
-----------------
FastAPI application that handles authentication and daily check-ins
for the Haven employee wellbeing app. Connects to Supabase for data storage.
"""

import os

from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from passlib.context import CryptContext
from supabase import create_client, Client

# Load environment variables from .env file
load_dotenv()

# Supabase credentials (loaded from .env)
SUPABASE_URL: str = os.getenv("SUPABASE_URL", "")
SUPABASE_KEY: str = os.getenv("SUPABASE_PUBLISHABLE_KEY", "")

# Password hashing context — uses bcrypt under the hood
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def get_supabase() -> Client:
    """
    Lazily create and return a Supabase client.
    This avoids crashing at startup when .env is not configured yet.
    """
    if not SUPABASE_URL or not SUPABASE_KEY:
        raise HTTPException(
            status_code=500,
            detail="Supabase credentials are not configured. Copy .env.example to .env and fill in your keys.",
        )
    return create_client(SUPABASE_URL, SUPABASE_KEY)

# Create FastAPI app
app = FastAPI(title="Haven API", version="1.0.0")

# Allow the frontend dev server to call this API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, restrict to your frontend domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ──────────────────────────────────────────────
# Request Models (Pydantic)
# ──────────────────────────────────────────────

class SignupRequest(BaseModel):
    company: str
    department: str
    firstName: str
    lastName: str
    employeeId: str
    email: str
    password: str


class LoginRequest(BaseModel):
    email: str
    password: str


class CheckinRequest(BaseModel):
    employeeId: str
    q1: int
    q2: int
    q3: int
    q4: int
    q5: int
    q6: int
    q7: int
    q8: int
    sleep_score: float
    workload_score: float
    relationships_score: float
    motivation_score: float
    total_score: float
    avg_score: float


# ──────────────────────────────────────────────
# Routes
# ──────────────────────────────────────────────

@app.get("/api/health")
def health_check():
    """Simple endpoint to verify the API is running."""
    return {"status": "ok"}


@app.post("/api/auth/signup")
def signup(req: SignupRequest):
    """
    Register a new employee.
    Hashes the password before storing it in the Supabase employees table.
    """
    # Get a Supabase client
    db = get_supabase()

    # Hash the password so we never store plain text
    hashed_password = pwd_context.hash(req.password)

    # Check if employee already exists
    existing = (
        db.table("employees")
        .select("employee_id")
        .eq("email", req.email)
        .execute()
    )
    if existing.data:
        raise HTTPException(
            status_code=400,
            detail="An account with this email already exists.",
        )

    # Insert the new employee into Supabase
    result = db.table("employees").insert(
        {
            "company": req.company,
            "department": req.department,
            "first_name": req.firstName,
            "last_name": req.lastName,
            "employee_id": req.employeeId,
            "email": req.email,
            "password_hash": hashed_password,
        }
    ).execute()

    if not result.data:
        raise HTTPException(status_code=500, detail="Failed to create account.")

    return {"success": True, "employeeId": req.employeeId}


@app.post("/api/auth/login")
def login(req: LoginRequest):
    """
    Log in an existing employee.
    Verifies the password against the stored hash.
    """
    # Get a Supabase client
    db = get_supabase()

    # Look up employee by email
    result = (
        db.table("employees")
        .select("*")
        .eq("email", req.email)
        .execute()
    )

    if not result.data:
        raise HTTPException(status_code=401, detail="Invalid email or password.")

    employee = result.data[0]

    # Verify the password against the stored hash
    if not pwd_context.verify(req.password, employee["password_hash"]):
        raise HTTPException(status_code=401, detail="Invalid email or password.")

    return {
        "success": True,
        "firstName": employee["first_name"],
        "email": employee["email"],
    }


@app.post("/api/checkin")
def submit_checkin(req: CheckinRequest):
    """
    Save a daily wellbeing check-in for an employee.
    """
    db = get_supabase()

    result = db.table("checkins").insert(
        {
            "employee_id": req.employeeId,
            "q1": req.q1,
            "q2": req.q2,
            "q3": req.q3,
            "q4": req.q4,
            "q5": req.q5,
            "q6": req.q6,
            "q7": req.q7,
            "q8": req.q8,
            "sleep_score": req.sleep_score,
            "workload_score": req.workload_score,
            "relationships_score": req.relationships_score,
            "motivation_score": req.motivation_score,
            "total_score": req.total_score,
            "avg_score": req.avg_score,
        }
    ).execute()

    if not result.data:
        raise HTTPException(status_code=500, detail="Failed to save check-in.")

    return {"success": True}


@app.get("/api/checkin/{employeeId}")
def get_checkins(employeeId: str):
    """
    Retrieve all past check-ins for a given employee, ordered newest first.
    """
    db = get_supabase()

    result = (
        db.table("checkins")
        .select("*")
        .eq("employee_id", employeeId)
        .order("submitted_at", desc=True)
        .execute()
    )

    return {"success": True, "checkins": result.data}