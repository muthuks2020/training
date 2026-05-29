"""
validations/customer_validators.py
-----------------------------------
Centralised business-rule validations for customer data.
These are called from the service layer — not from Pydantic schemas —
so that complex or cross-field rules stay in one place.
"""

import re
from fastapi import HTTPException, status


# ─── Constants ────────────────────────────────────────────────────────────────

MOBILE_REGEX   = re.compile(r"^\d{10}$")          # exactly 10 digits
EMAIL_REGEX    = re.compile(r"^[\w.\-+]+@[\w\-]+\.[a-zA-Z]{2,}$")


# ─── Individual validators ────────────────────────────────────────────────────

def validate_mobile_number(mobile: str) -> str:
    """
    Rules:
      - Must not be empty / None
      - Must be exactly 10 digits (no spaces, dashes, country codes)
    
    Returns the cleaned number or raises HTTPException 422.
    """
    if not mobile or not mobile.strip():
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="mobile_number is required and cannot be empty."
        )
    
    cleaned = mobile.strip()
    if not MOBILE_REGEX.match(cleaned):
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=f"Invalid mobile_number '{cleaned}'. Must be exactly 10 digits (e.g. 9876543210)."
        )
    return cleaned


def validate_email(email: str) -> str:
    """
    Basic email format check as a second layer (Pydantic's EmailStr is the first).
    Raises 422 if the format looks wrong.
    """
    if not email or not email.strip():
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="email is required and cannot be empty."
        )
    return email.strip().lower()


def validate_customer_name(name: str) -> str:
    """
    Rules:
      - Must not be empty
      - At least 2 characters after stripping whitespace
    """
    if not name or not name.strip():
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="customer_name is required and cannot be blank."
        )
    cleaned = name.strip()
    if len(cleaned) < 2:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="customer_name must be at least 2 characters long."
        )
    return cleaned


# ─── Composite validator (used for Create) ────────────────────────────────────

def validate_create_payload(customer_name: str, mobile_number: str, email: str):
    """
    Runs all required-field validators for a new customer.
    Call this once at the start of the create service function.
    """
    validate_customer_name(customer_name)
    validate_mobile_number(mobile_number)
    validate_email(email)
