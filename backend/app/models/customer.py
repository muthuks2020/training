"""
models/customer.py
------------------
SQLAlchemy ORM model for the Customer table.
Each field maps directly to a column in the database.
"""

from sqlalchemy import Column, Integer, String, DateTime, Enum
from sqlalchemy.sql import func
import enum

from app.database.config import Base


class GenderEnum(str, enum.Enum):
    """Allowed values for the gender field."""
    male   = "male"
    female = "female"
    other  = "other"


class CustomerTypeEnum(str, enum.Enum):
    """Allowed values for customer_type field."""
    individual  = "individual"
    business    = "business"
    government  = "government"


class StatusEnum(str, enum.Enum):
    """Allowed values for the status field."""
    active   = "active"
    inactive = "inactive"
    pending  = "pending"


class Customer(Base):
    """
    ORM model representing the 'customers' table.
    
    Columns:
        id              - Auto-incremented primary key
        customer_name   - Full name of the customer (required)
        mobile_number   - 10-digit mobile number (required, unique)
        email           - Valid email address (required, unique)
        gender          - Enum: male / female / other
        customer_type   - Enum: individual / business / government
        location        - City or region name
        address         - Full mailing address
        status          - Enum: active / inactive / pending
        created_at      - Auto-set timestamp on record creation
    """

    __tablename__ = "customers"

    id            = Column(Integer, primary_key=True, index=True, autoincrement=True)
    customer_name = Column(String(100), nullable=False)
    mobile_number = Column(String(15),  nullable=False, unique=True, index=True)
    email         = Column(String(150), nullable=False, unique=True, index=True)
    gender        = Column(Enum(GenderEnum),       nullable=True)
    customer_type = Column(Enum(CustomerTypeEnum), nullable=True, default="individual")
    location      = Column(String(100), nullable=True)
    address       = Column(String(255), nullable=True)
    status        = Column(Enum(StatusEnum), nullable=True, default="active")
    created_at    = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    def __repr__(self):
        return f"<Customer id={self.id} name='{self.customer_name}' mobile='{self.mobile_number}'>"
