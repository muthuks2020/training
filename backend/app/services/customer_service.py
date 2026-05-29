"""
services/customer_service.py
-----------------------------
The service layer contains all business logic and database operations.
API route handlers (controllers) call these functions — they do NOT
talk to the database directly. This separation makes the code testable
and easy to maintain.
"""

from sqlalchemy.orm import Session
from sqlalchemy import or_, func
from fastapi import HTTPException, status

from app.models.customer import Customer
from app.schemas.customer import CustomerCreate, CustomerUpdate
from app.validations.customer_validators import (
    validate_create_payload,
    validate_mobile_number,
    validate_email,
)


# ─── CREATE ───────────────────────────────────────────────────────────────────

def create_customer(db: Session, payload: CustomerCreate) -> Customer:
    """
    Creates a new customer record.
    
    Steps:
      1. Run business-rule validations
      2. Check for duplicate mobile / email
      3. Insert and commit to DB
      4. Return the new ORM object
    """
    # Step 1 — validate required fields
    validate_create_payload(
        customer_name  = payload.customer_name,
        mobile_number  = payload.mobile_number,
        email          = payload.email,
    )

    # Step 2 — uniqueness checks
    existing_mobile = db.query(Customer).filter(
        Customer.mobile_number == payload.mobile_number
    ).first()
    if existing_mobile:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"A customer with mobile number '{payload.mobile_number}' already exists."
        )

    existing_email = db.query(Customer).filter(
        func.lower(Customer.email) == payload.email.lower()
    ).first()
    if existing_email:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"A customer with email '{payload.email}' already exists."
        )

    # Step 3 — create ORM object and save
    new_customer = Customer(
        customer_name = payload.customer_name.strip(),
        mobile_number = payload.mobile_number.strip(),
        email         = payload.email.strip().lower(),
        gender        = payload.gender,
        customer_type = payload.customer_type or "individual",
        location      = payload.location,
        address       = payload.address,
        status        = payload.status or "active",
    )

    db.add(new_customer)
    db.commit()
    db.refresh(new_customer)   # reload to get auto-generated id & created_at

    return new_customer


# ─── READ — Get All (with pagination) ────────────────────────────────────────

def get_all_customers(db: Session, page: int = 1, per_page: int = 10):
    """
    Returns a paginated list of all customers.
    
    Args:
        page     - current page number (starts at 1)
        per_page - number of records per page
    
    Returns:
        dict with total count, page info, and list of customers
    """
    if page < 1:
        page = 1
    if per_page < 1 or per_page > 100:
        per_page = 10

    offset = (page - 1) * per_page

    total     = db.query(func.count(Customer.id)).scalar()
    customers = db.query(Customer).offset(offset).limit(per_page).all()

    return {
        "total"    : total,
        "page"     : page,
        "per_page" : per_page,
        "customers": customers,
    }


# ─── READ — Get by ID ─────────────────────────────────────────────────────────

def get_customer_by_id(db: Session, customer_id: int) -> Customer:
    """Fetch a single customer by primary key. Raises 404 if not found."""
    customer = db.query(Customer).filter(Customer.id == customer_id).first()
    if not customer:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Customer with id {customer_id} not found."
        )
    return customer


# ─── UPDATE ───────────────────────────────────────────────────────────────────

def update_customer(db: Session, customer_id: int, payload: CustomerUpdate) -> Customer:
    """
    Partially updates a customer record.
    Only the fields provided (not None) are updated — other fields stay unchanged.
    """
    customer = get_customer_by_id(db, customer_id)

    # Build a dict of fields to update (skip None values)
    update_data = payload.model_dump(exclude_none=True)

    if not update_data:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No update data provided. Please supply at least one field to update."
        )

    # Extra validation for fields being updated
    if "mobile_number" in update_data:
        validate_mobile_number(update_data["mobile_number"])
        # Check uniqueness (exclude the current record)
        conflict = db.query(Customer).filter(
            Customer.mobile_number == update_data["mobile_number"],
            Customer.id != customer_id
        ).first()
        if conflict:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail=f"Mobile number '{update_data['mobile_number']}' is already used by another customer."
            )

    if "email" in update_data:
        update_data["email"] = update_data["email"].strip().lower()
        conflict = db.query(Customer).filter(
            func.lower(Customer.email) == update_data["email"],
            Customer.id != customer_id
        ).first()
        if conflict:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail=f"Email '{update_data['email']}' is already used by another customer."
            )

    # Apply updates
    for field, value in update_data.items():
        setattr(customer, field, value)

    db.commit()
    db.refresh(customer)
    return customer


# ─── DELETE ───────────────────────────────────────────────────────────────────

def delete_customer(db: Session, customer_id: int) -> dict:
    """
    Permanently deletes a customer record.
    Returns a confirmation message.
    """
    customer = get_customer_by_id(db, customer_id)
    name = customer.customer_name

    db.delete(customer)
    db.commit()

    return {"message": f"Customer '{name}' (id={customer_id}) has been deleted successfully."}


# ─── SEARCH ───────────────────────────────────────────────────────────────────

def search_customers(
    db       : Session,
    keyword  : str  = "",
    status   : str  = None,
    customer_type: str = None,
    page     : int  = 1,
    per_page : int  = 10,
):
    """
    Search customers by:
      - keyword → matches customer_name, mobile_number, email, location (case-insensitive)
      - status  → filter by status value
      - customer_type → filter by customer_type value

    Returns paginated results.
    """
    query = db.query(Customer)

    # Keyword search (partial match across multiple columns)
    if keyword and keyword.strip():
        kw = f"%{keyword.strip()}%"
        query = query.filter(
            or_(
                Customer.customer_name.ilike(kw),
                Customer.mobile_number.ilike(kw),
                Customer.email.ilike(kw),
                Customer.location.ilike(kw),
            )
        )

    # Filter by status
    if status:
        query = query.filter(Customer.status == status)

    # Filter by customer type
    if customer_type:
        query = query.filter(Customer.customer_type == customer_type)

    total     = query.with_entities(func.count(Customer.id)).scalar()
    offset    = (page - 1) * per_page
    customers = query.offset(offset).limit(per_page).all()

    return {
        "total"    : total,
        "page"     : page,
        "per_page" : per_page,
        "customers": customers,
    }
