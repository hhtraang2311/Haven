"""
Haven Backend API
-----------------
FastAPI application that handles authentication and daily check-ins
for the Haven employee wellbeing app. Uses Supabase Auth for user management
and Supabase REST (via the Python SDK) for database access.
"""

import os

import httpx
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException, Depends, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from supabase import create_client, Client

# Load environment variables from .env file (resolve path relative to this file)
_dotenv_path = os.path.join(os.path.dirname(__file__), '..', '.env')
load_dotenv(dotenv_path=_dotenv_path)
# Also try loading from the backend directory
load_dotenv()

# Supabase credentials
SUPABASE_URL: str = os.getenv("SUPABASE_URL", "")
SUPABASE_KEY: str = os.getenv("SUPABASE_PUBLISHABLE_KEY", "")


def get_supabase() -> Client:
    """Create a Supabase client for database operations."""
    if not SUPABASE_URL or not SUPABASE_KEY:
        raise HTTPException(
            status_code=500,
            detail="Supabase credentials are not configured.",
        )
    return create_client(SUPABASE_URL, SUPABASE_KEY)


# Create FastAPI app
app = FastAPI(title="Haven API", version="2.0.0")

# CORS — allow local dev and Vercel deployments
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:3000",
    ],
    # Allow any *.vercel.app origin at runtime
    allow_origin_regex=r"https://.*\.vercel\.app",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ──────────────────────────────────────────────
# Request Models
# ──────────────────────────────────────────────

class SignupRequest(BaseModel):
    company: str
    department: str
    first_name: str
    last_name: str
    employee_id: str
    email: str
    password: str


class LoginRequest(BaseModel):
    email: str
    password: str


class CheckinRequest(BaseModel):
    employee_id: str
    q1: int
    q2: int
    q3: int
    q4: int
    q5: int
    q6: int
    q7: int
    q8: int


# ──────────────────────────────────────────────
# Auth helper — verify Supabase access_token
# ──────────────────────────────────────────────

async def verify_token(request: Request) -> dict:
    """
    Extract and verify the Supabase access_token from the Authorization header.
    Returns the user object from Supabase Auth if valid.
    """
    auth_header = request.headers.get("Authorization")
    if not auth_header or not auth_header.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing or invalid token.")

    token = auth_header.split(" ", 1)[1]

    async with httpx.AsyncClient() as client:
        resp = await client.get(
            f"{SUPABASE_URL}/auth/v1/user",
            headers={
                "Authorization": f"Bearer {token}",
                "apikey": SUPABASE_KEY,
            },
        )

    if resp.status_code != 200:
        raise HTTPException(status_code=401, detail="Invalid or expired token.")

    return resp.json()


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
    Register a new employee via Supabase Auth, then save profile to the employees table.
    """
    if not SUPABASE_URL or not SUPABASE_KEY:
        raise HTTPException(
            status_code=500,
            detail="Server configuration error: Supabase credentials are not set.",
        )

    db = get_supabase()

    # ── 1. Check if email already exists in employees table ──
    try:
        existing = (
            db.table("employees")
            .select("id")
            .eq("email", req.email)
            .limit(1)
            .execute()
        )
        if existing and existing.data:
            raise HTTPException(
                status_code=409,
                detail="This email is already registered. Please try logging in.",
            )
    except HTTPException:
        raise
    except Exception:
        pass  # If the query fails, proceed with signup

    # ── 2. Create user in Supabase Auth ──
    try:
        auth_resp = httpx.post(
            f"{SUPABASE_URL}/auth/v1/signup",
            headers={
                "apikey": SUPABASE_KEY,
                "Content-Type": "application/json",
            },
            json={
                "email": req.email,
                "password": req.password,
                "data": {"first_name": req.first_name, "last_name": req.last_name},
            },
            timeout=30.0,
        )
    except httpx.RequestError as exc:
        raise HTTPException(
            status_code=502,
            detail=f"Failed to connect to authentication service: {exc}",
        )

    if auth_resp.status_code not in (200, 201):
        # Supabase Auth rejected the signup (e.g. 422 = user already in Auth)
        raise HTTPException(
            status_code=409,
            detail="This email is already registered. Please try logging in.",
        )

    # ── 3. Save employee profile to the employees table ──
    try:
        result = db.table("employees").insert(
            {
                "company": req.company,
                "department": req.department,
                "first_name": req.first_name,
                "last_name": req.last_name,
                "employee_id": req.employee_id,
                "email": req.email,
            }
        ).execute()

        if not result.data:
            raise HTTPException(
                status_code=500,
                detail="Failed to save employee profile. Please try again.",
            )
    except HTTPException:
        raise
    except Exception as exc:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to save employee profile: {exc}",
        )

    return {"success": True, "first_name": req.first_name, "email": req.email}


@app.post("/api/auth/login")
def login(req: LoginRequest):
    """
    Log in via Supabase Auth and return access_token + employee info.
    """
    if not SUPABASE_URL or not SUPABASE_KEY:
        raise HTTPException(
            status_code=500,
            detail="Server configuration error: Supabase credentials are not set.",
        )

    # 1. Authenticate with Supabase Auth
    try:
        auth_resp = httpx.post(
            f"{SUPABASE_URL}/auth/v1/token?grant_type=password",
            headers={
                "apikey": SUPABASE_KEY,
                "Content-Type": "application/json",
            },
            json={"email": req.email, "password": req.password},
            timeout=30.0,
        )
    except httpx.RequestError as exc:
        raise HTTPException(
            status_code=502,
            detail=f"Failed to connect to authentication service: {exc}",
        )

    if auth_resp.status_code != 200:
        raise HTTPException(status_code=401, detail="Invalid email or password.")

    auth_data = auth_resp.json()
    access_token = auth_data.get("access_token")

    # 2. Look up employee profile
    try:
        db = get_supabase()
        result = (
            db.table("employees")
            .select("first_name, employee_id")
            .eq("email", req.email)
            .execute()
        )
    except Exception as exc:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to look up employee profile: {exc}",
        )

    if not result.data:
        raise HTTPException(status_code=404, detail="Employee profile not found.")

    employee = result.data[0]

    return {
        "success": True,
        "access_token": access_token,
        "refresh_token": auth_data.get("refresh_token"),
        "expires_in": auth_data.get("expires_in"),
        "token_type": auth_data.get("token_type", "bearer"),
        "first_name": employee["first_name"],
        "email": req.email,
        "employee_id": employee["employee_id"],
    }


@app.post("/api/checkin")
async def submit_checkin(req: CheckinRequest, user: dict = Depends(verify_token)):
    """
    Submit a weekly check-in. Requires a valid access token.
    Scores are calculated on the server — the frontend only sends q1–q8.
    """
    # Validate q1–q8 are between 1 and 5
    for i, val in enumerate([req.q1, req.q2, req.q3, req.q4, req.q5, req.q6, req.q7, req.q8], 1):
        if not (1 <= val <= 5):
            raise HTTPException(status_code=400, detail=f"q{i} must be between 1 and 5.")

    # Calculate scores server-side
    sleep_score = (req.q1 + req.q2) / 2
    workload_score = (req.q3 + req.q4) / 2
    relationships_score = (req.q5 + req.q6) / 2
    motivation_score = (req.q7 + req.q8) / 2
    total_score = req.q1 + req.q2 + req.q3 + req.q4 + req.q5 + req.q6 + req.q7 + req.q8
    avg_score = total_score / 8

    # Determine burnout risk
    if avg_score >= 4.0:
        burnout_risk = "low"
    elif avg_score >= 2.8:
        burnout_risk = "medium"
    else:
        burnout_risk = "high"

    # Save to database
    db = get_supabase()
    result = db.table("checkins").insert(
        {
            "employee_id": req.employee_id,
            "q1": req.q1, "q2": req.q2, "q3": req.q3, "q4": req.q4,
            "q5": req.q5, "q6": req.q6, "q7": req.q7, "q8": req.q8,
            "sleep_score": sleep_score,
            "workload_score": workload_score,
            "relationships_score": relationships_score,
            "motivation_score": motivation_score,
            "total_score": total_score,
            "avg_score": avg_score,
            "burnout_risk": burnout_risk,
        }
    ).execute()

    if not result.data:
        raise HTTPException(status_code=500, detail="Failed to save check-in.")

    return {"success": True}
