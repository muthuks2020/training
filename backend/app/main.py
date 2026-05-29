"""
app/main.py
-----------
FastAPI application entry point.
This file wires together the database, routes, and middleware.
Run with: uvicorn app.main:app --reload
"""

from fastapi import FastAPI, Request, status
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi.exceptions import RequestValidationError
from pydantic import ValidationError

from app.database.config import engine, Base
from app.api.customer_routes import router as customer_router
from app.utils.response_helpers import error_response

# ─── Create all database tables on startup ────────────────────────────────────
# In production you'd use Alembic migrations instead.
Base.metadata.create_all(bind=engine)


# ─── Initialise FastAPI app ───────────────────────────────────────────────────

app = FastAPI(
    title       = "Appasamy Customer Management API",
    description = (
        "A beginner-friendly REST API for managing customers. "
        "Built with FastAPI + SQLAlchemy for internal training purposes at **Appasamy**."
    ),
    version     = "1.0.0",
    docs_url    = "/docs",      # Swagger UI
    redoc_url   = "/redoc",     # ReDoc UI
)


# ─── CORS Middleware ──────────────────────────────────────────────────────────
# Allow all origins for local development / training.
# Restrict origins in production.

app.add_middleware(
    CORSMiddleware,
    allow_origins     = ["*"],
    allow_credentials = True,
    allow_methods     = ["*"],
    allow_headers     = ["*"],
)


# ─── Global Exception Handlers ───────────────────────────────────────────────

@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    """
    Catches Pydantic validation errors (e.g. missing required fields, wrong types)
    and returns a clean 422 response with a readable error list.
    """
    errors = []
    for error in exc.errors():
        field  = " → ".join(str(e) for e in error["loc"])
        errors.append({"field": field, "issue": error["msg"]})
    
    return JSONResponse(
        status_code = status.HTTP_422_UNPROCESSABLE_ENTITY,
        content     = error_response("Validation failed. Please check your input.", errors),
    )


@app.exception_handler(Exception)
async def generic_exception_handler(request: Request, exc: Exception):
    """Catch-all handler for unexpected server errors."""
    return JSONResponse(
        status_code = status.HTTP_500_INTERNAL_SERVER_ERROR,
        content     = error_response("An unexpected error occurred.", str(exc)),
    )


# ─── Register Routers ─────────────────────────────────────────────────────────

app.include_router(customer_router, prefix="/api/v1")


# ─── Health Check ─────────────────────────────────────────────────────────────

@app.get("/", tags=["Health"])
def root():
    """Root endpoint — confirms the API is running."""
    return {
        "status"     : "ok",
        "service"    : "Appasamy Customer Management API",
        "version"    : "1.0.0",
        "docs"       : "/docs",
        "api_prefix" : "/api/v1",
    }


@app.get("/health", tags=["Health"])
def health_check():
    """Health check endpoint for monitoring / load balancers."""
    return {"status": "healthy"}
