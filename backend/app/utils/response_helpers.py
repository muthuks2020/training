"""
utils/response_helpers.py
--------------------------
Standardised API response wrappers.
Using consistent response shapes makes the API predictable for frontend teams.
"""

from typing import Any, Optional


def success_response(data: Any, message: str = "Success") -> dict:
    """
    Standard success wrapper.
    
    Example output:
    {
        "status": "success",
        "message": "Customer created successfully.",
        "data": { ... }
    }
    """
    return {
        "status" : "success",
        "message": message,
        "data"   : data,
    }


def error_response(message: str, detail: Optional[Any] = None) -> dict:
    """
    Standard error wrapper — used in custom exception handlers.
    
    Example output:
    {
        "status": "error",
        "message": "Validation failed.",
        "detail": [ ... ]
    }
    """
    return {
        "status" : "error",
        "message": message,
        "detail" : detail,
    }
