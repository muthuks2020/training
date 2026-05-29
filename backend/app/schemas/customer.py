"""
schemas/customer.py
-------------------
Pydantic schemas define the shape of request bodies and response data.
They are separate from ORM models — schemas handle HTTP layer validation,
ORM models handle database layer.
"""

from pydantic import BaseModel, EmailStr, Field, field_validator
from typing import Optional
from datetime import datetime
from enum import Enum


# ─── Enum definitions (mirror the ORM enums) ──────────────────────────────────

class GenderEnum(str, Enum):
    male   = "male"
    female = "female"
    other  = "other"


class CustomerTypeEnum(str, Enum):
    individual  = "individual"
    business    = "business"
    government  = "government"


class StatusEnum(str, Enum):
    active   = "active"
    inactive = "inactive"
    pending  = "pending"


# ─── Base Schema (shared fields) ──────────────────────────────────────────────

class CustomerBase(BaseModel):
    """
    Shared fields used by both Create and Update schemas.
    All fields here are optional so Update can do partial updates.
    """
    customer_name : Optional[str]             = Field(None, min_length=2, max_length=100,  description="Full name of the customer")
    mobile_number : Optional[str]             = Field(None, description="10-digit mobile number")
    email         : Optional[EmailStr]        = Field(None, description="Valid email address")
    gender        : Optional[GenderEnum]      = Field(None, description="male / female / other")
    customer_type : Optional[CustomerTypeEnum]= Field(None, description="individual / business / government")
    location      : Optional[str]             = Field(None, max_length=100, description="City or region")
    address       : Optional[str]             = Field(None, max_length=255, description="Full mailing address")
    status        : Optional[StatusEnum]      = Field(None, description="active / inactive / pending")


# ─── Create Schema ────────────────────────────────────────────────────────────

class CustomerCreate(CustomerBase):
    """
    Schema for POST /customers — all required fields must be provided.
    """
    customer_name : str      = Field(..., min_length=2, max_length=100)
    mobile_number : str      = Field(..., description="10-digit mobile number")
    email         : EmailStr = Field(..., description="Valid email address")

    @field_validator("customer_name")
    @classmethod
    def name_must_not_be_blank(cls, v: str) -> str:
        """Reject names that are only whitespace."""
        if not v.strip():
            raise ValueError("customer_name cannot be blank or only spaces")
        return v.strip()


# ─── Update Schema ────────────────────────────────────────────────────────────

class CustomerUpdate(CustomerBase):
    """
    Schema for PUT /customers/{id} — all fields are optional (partial update).
    Only the fields provided will be updated in the database.
    """
    pass


# ─── Response Schema ──────────────────────────────────────────────────────────

class CustomerResponse(BaseModel):
    """
    Schema for responses — what the API returns to the client.
    Includes the auto-generated id and created_at timestamp.
    """
    id            : int
    customer_name : str
    mobile_number : str
    email         : str
    gender        : Optional[GenderEnum]
    customer_type : Optional[CustomerTypeEnum]
    location      : Optional[str]
    address       : Optional[str]
    status        : Optional[StatusEnum]
    created_at    : datetime

    model_config = {"from_attributes": True}   # enables ORM mode (SQLAlchemy → Pydantic)


# ─── List / Paginated Response ────────────────────────────────────────────────

class CustomerListResponse(BaseModel):
    """Wrapper for paginated list responses."""
    total    : int
    page     : int
    per_page : int
    customers: list[CustomerResponse]
