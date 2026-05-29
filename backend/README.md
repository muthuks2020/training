# Appasamy Customer Management API

A clean, enterprise-style **FastAPI** backend for managing customer data.  
Built for internal training purposes — beginner-friendly, well-commented, production-like structure.

---

## Tech Stack

| Layer        | Technology              |
|--------------|-------------------------|
| Language     | Python 3.10             |
| Framework    | FastAPI 0.111           |
| ORM          | SQLAlchemy 2.0          |
| Database     | SQLite (default)        |
| Validation   | Pydantic v2             |
| Server       | Uvicorn (ASGI)          |

---

## Project Structure

```
backend/
├── app/
│   ├── api/
│   │   └── customer_routes.py     ← HTTP route handlers (controllers)
│   ├── models/
│   │   └── customer.py            ← SQLAlchemy ORM model (DB table)
│   ├── schemas/
│   │   └── customer.py            ← Pydantic schemas (request/response shapes)
│   ├── services/
│   │   └── customer_service.py    ← Business logic & DB operations
│   ├── database/
│   │   └── config.py              ← DB engine, session, Base
│   ├── validations/
│   │   └── customer_validators.py ← Custom validation rules
│   ├── utils/
│   │   └── response_helpers.py    ← Standard response wrappers
│   └── main.py                    ← App entry point, middleware, error handlers
├── requirements.txt
├── customer.sql                   ← SQL schema + sample data
└── README.md
```

---

## Setup Instructions

### Prerequisites
- Python 3.10 or higher installed
- `pip` package manager

### Step 1 — Clone or unzip the project

```bash
cd backend
```

### Step 2 — Create a virtual environment

```bash
# Create venv
python -m venv venv

# Activate (Mac/Linux)
source venv/bin/activate

# Activate (Windows)
venv\Scripts\activate
```

### Step 3 — Install dependencies

```bash
pip install -r requirements.txt
```

### Step 4 — Run the server

```bash
uvicorn app.main:app --reload
```

The server will start at: **http://127.0.0.1:8000**

> The SQLite database file (`appasamy_customers.db`) will be created automatically on first run.

---

## API Documentation (Auto-generated)

| UI      | URL                               |
|---------|-----------------------------------|
| Swagger | http://127.0.0.1:8000/docs        |
| ReDoc   | http://127.0.0.1:8000/redoc       |

---

## API Endpoints

### Base URL: `/api/v1`

| Method | Endpoint                  | Description                |
|--------|---------------------------|----------------------------|
| POST   | `/customers/`             | Create a new customer      |
| GET    | `/customers/`             | Get all customers (paged)  |
| GET    | `/customers/search`       | Search/filter customers    |
| GET    | `/customers/{id}`         | Get customer by ID         |
| PUT    | `/customers/{id}`         | Update a customer          |
| DELETE | `/customers/{id}`         | Delete a customer          |

---

## Example Requests

### Create Customer
```http
POST /api/v1/customers/
Content-Type: application/json

{
  "customer_name": "Rajesh Kumar",
  "mobile_number": "9876543210",
  "email": "rajesh@email.com",
  "gender": "male",
  "customer_type": "individual",
  "location": "Chennai",
  "address": "12, Anna Nagar, Chennai",
  "status": "active"
}
```

### Get All Customers (page 1, 10 per page)
```http
GET /api/v1/customers/?page=1&per_page=10
```

### Search Customers
```http
GET /api/v1/customers/search?keyword=Chennai&status=active
```

### Update Customer
```http
PUT /api/v1/customers/1
Content-Type: application/json

{
  "status": "inactive",
  "location": "Coimbatore"
}
```

### Delete Customer
```http
DELETE /api/v1/customers/1
```

---

## Validation Rules

| Field          | Rule                                              |
|----------------|---------------------------------------------------|
| customer_name  | Required, min 2 chars, cannot be blank            |
| mobile_number  | Required, exactly 10 digits                       |
| email          | Required, valid email format, unique              |
| gender         | Optional: `male` / `female` / `other`             |
| customer_type  | Optional: `individual` / `business` / `government`|
| status         | Optional: `active` / `inactive` / `pending`       |

---

## Standard Response Format

All responses follow this structure:

**Success:**
```json
{
  "status": "success",
  "message": "Customer created successfully.",
  "data": { ... }
}
```

**Error:**
```json
{
  "status": "error",
  "message": "Validation failed.",
  "detail": [ ... ]
}
```

---

## Customer Table Schema

```sql
CREATE TABLE customers (
    id              INTEGER     PRIMARY KEY AUTOINCREMENT,
    customer_name   VARCHAR(100) NOT NULL,
    mobile_number   VARCHAR(15)  NOT NULL UNIQUE,
    email           VARCHAR(150) NOT NULL UNIQUE,
    gender          VARCHAR(10),
    customer_type   VARCHAR(20)  DEFAULT 'individual',
    location        VARCHAR(100),
    address         VARCHAR(255),
    status          VARCHAR(20)  DEFAULT 'active',
    created_at      DATETIME     DEFAULT CURRENT_TIMESTAMP
);
```

---

## Architecture Notes (for Trainees)

```
HTTP Request
    ↓
FastAPI Route Handler  (api/customer_routes.py)   — receives & validates input shape
    ↓
Pydantic Schema        (schemas/customer.py)       — validates data types & formats
    ↓
Validator Functions    (validations/)              — business rules (mobile format, etc.)
    ↓
Service Layer          (services/customer_service.py) — DB queries & business logic
    ↓
ORM Model              (models/customer.py)        — maps Python ↔ SQL table
    ↓
SQLite Database        (appasamy_customers.db)
```

---

## Training Topics Covered

- ✅ FastAPI project structure
- ✅ SQLAlchemy ORM (models, sessions, queries)
- ✅ Pydantic schemas for request/response validation
- ✅ Dependency Injection (`Depends`)
- ✅ CRUD operations (Create, Read, Update, Delete)
- ✅ Custom validators
- ✅ Global exception handlers
- ✅ Pagination
- ✅ Search with multiple filters
- ✅ Standardised API response format
- ✅ CORS middleware
