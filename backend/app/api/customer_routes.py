"""
api/customer_routes.py
-----------------------
FastAPI route handlers (controllers) for customer CRUD operations.
Each function handles one HTTP endpoint and delegates logic to the service layer.
"""

from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session

from app.database.config import get_db
from app.schemas.customer import (
    CustomerCreate,
    CustomerUpdate,
    CustomerResponse,
    CustomerListResponse,
)
from app.services.customer_service import (
    create_customer,
    get_all_customers,
    get_customer_by_id,
    update_customer,
    delete_customer,
    search_customers,
)
from app.utils.response_helpers import success_response

# Create the router — all routes in this file will be prefixed with /customers
router = APIRouter(
    prefix="/customers",
    tags=["Customers"],
)


# ─── POST /customers ──────────────────────────────────────────────────────────

@router.post(
    "/",
    status_code=status.HTTP_201_CREATED,
    summary="Create a new customer",
    description=(
        "Creates a new customer record. "
        "**Required fields:** customer_name, mobile_number, email. "
        "Mobile must be exactly 10 digits. Email must be valid format."
    ),
)
def create_customer_route(
    payload: CustomerCreate,
    db     : Session = Depends(get_db),
):
    """
    Create a new customer.
    
    - **customer_name**: Full name (min 2 chars, required)
    - **mobile_number**: 10-digit number, e.g. `9876543210` (required)
    - **email**: Valid email, e.g. `john@example.com` (required)
    - **gender**: `male` / `female` / `other` (optional)
    - **customer_type**: `individual` / `business` / `government` (optional, default: individual)
    - **location**: City or region (optional)
    - **address**: Full address (optional)
    - **status**: `active` / `inactive` / `pending` (optional, default: active)
    """
    customer = create_customer(db, payload)
    return success_response(
        data    = CustomerResponse.model_validate(customer),
        message = "Customer created successfully."
    )


# ─── GET /customers ───────────────────────────────────────────────────────────

@router.get(
    "/",
    response_model=None,
    summary="Get all customers (paginated)",
    description="Returns a paginated list of all customers. Use `page` and `per_page` query params.",
)
def get_all_customers_route(
    page    : int     = Query(default=1,  ge=1,  description="Page number (starts at 1)"),
    per_page: int     = Query(default=10, ge=1, le=100, description="Records per page (max 100)"),
    db      : Session = Depends(get_db),
):
    result = get_all_customers(db, page=page, per_page=per_page)
    result["customers"] = [CustomerResponse.model_validate(c) for c in result["customers"]]
    return success_response(data=result, message="Customers retrieved successfully.")


# ─── GET /customers/search ────────────────────────────────────────────────────

@router.get(
    "/search",
    response_model=None,
    summary="Search customers",
    description=(
        "Search by keyword (name, mobile, email, location) "
        "and/or filter by status / customer_type."
    ),
)
def search_customers_route(
    keyword      : str  = Query(default="",   description="Search term (name, mobile, email, location)"),
    status_filter: str  = Query(default=None, alias="status",        description="Filter: active / inactive / pending"),
    type_filter  : str  = Query(default=None, alias="customer_type", description="Filter: individual / business / government"),
    page         : int  = Query(default=1,  ge=1),
    per_page     : int  = Query(default=10, ge=1, le=100),
    db           : Session = Depends(get_db),
):
    result = search_customers(
        db            = db,
        keyword       = keyword,
        status        = status_filter,
        customer_type = type_filter,
        page          = page,
        per_page      = per_page,
    )
    result["customers"] = [CustomerResponse.model_validate(c) for c in result["customers"]]
    return success_response(data=result, message="Search results retrieved.")


# ─── GET /customers/{id} ──────────────────────────────────────────────────────

@router.get(
    "/{customer_id}",
    response_model=None,
    summary="Get a single customer by ID",
)
def get_customer_route(
    customer_id: int,
    db         : Session = Depends(get_db),
):
    customer = get_customer_by_id(db, customer_id)
    return success_response(
        data    = CustomerResponse.model_validate(customer),
        message = "Customer retrieved successfully."
    )


# ─── PUT /customers/{id} ──────────────────────────────────────────────────────

@router.put(
    "/{customer_id}",
    response_model=None,
    summary="Update an existing customer",
    description=(
        "Partially updates a customer. Only send the fields you want to change — "
        "all other fields remain unchanged."
    ),
)
def update_customer_route(
    customer_id: int,
    payload    : CustomerUpdate,
    db         : Session = Depends(get_db),
):
    customer = update_customer(db, customer_id, payload)
    return success_response(
        data    = CustomerResponse.model_validate(customer),
        message = "Customer updated successfully."
    )


# ─── DELETE /customers/{id} ───────────────────────────────────────────────────

@router.delete(
    "/{customer_id}",
    response_model=None,
    summary="Delete a customer",
)
def delete_customer_route(
    customer_id: int,
    db         : Session = Depends(get_db),
):
    result = delete_customer(db, customer_id)
    return success_response(data=None, message=result["message"])
