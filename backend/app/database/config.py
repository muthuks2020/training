"""
database/config.py
------------------
Database connection setup using SQLAlchemy.
SQLite is used for simplicity (easy for local training/demo).
"""

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, DeclarativeBase

# SQLite database file will be created in the project root
DATABASE_URL = "sqlite:///./appasamy_customers.db"

# Create the SQLAlchemy engine
# connect_args is required only for SQLite (thread safety)
engine = create_engine(
    DATABASE_URL,
    connect_args={"check_same_thread": False}
)

# SessionLocal is the database session factory
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


# Base class for all ORM models
class Base(DeclarativeBase):
    pass


def get_db():
    """
    Dependency function used by FastAPI route handlers.
    Yields a database session and ensures it's closed after use.
    
    Usage in routes:
        db: Session = Depends(get_db)
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
