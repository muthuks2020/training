# Appasamy Customer Management Demo
### Internal Developer Training Documentation

> **Purpose:** This document is the complete technical reference for the Appasamy Customer Management Demo application. It is designed for internal training and onboarding of Appasamy development teams.

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Technology Stack](#2-technology-stack)
3. [Architecture Diagram](#3-architecture-diagram)
4. [Frontend Explanation](#4-frontend-explanation)
5. [Backend Explanation](#5-backend-explanation)
6. [Database Explanation](#6-database-explanation)
7. [Setup Instructions](#7-setup-instructions)
8. [API Reference & Testing](#8-api-reference--testing)
9. [Training Walkthrough](#9-training-walkthrough)
10. [Validation Reference](#10-validation-reference)
11. [Error Handling Reference](#11-error-handling-reference)

---

## 1. Project Overview

The **Appasamy Customer Management Demo** is a full-stack web application built for internal developer training. It demonstrates how to build a modern, enterprise-style CRUD (Create, Read, Update, Delete) application using React on the frontend and FastAPI + SQLite on the backend.

**What the application does:**
- Allows staff to **add** new customer records
- Allows staff to **search and browse** existing customers with filters and pagination
- Allows staff to **update** customer details
- Allows staff to **delete** customer records with confirmation

**Why this project exists:**
This demo is intentionally simple enough for beginners to follow, yet structured like a real enterprise application. Every file is commented, every layer has a clear responsibility, and the patterns used here are the same patterns used in production-grade systems.

**Intended audience:** Junior and mid-level developers joining the Appasamy engineering team who need to learn the team's stack, coding style, and architectural patterns.

---

## 2. Technology Stack

| Layer        | Technology              | Version    | Purpose                                     |
|--------------|-------------------------|------------|---------------------------------------------|
| Frontend     | React                   | 18         | UI component framework                      |
| HTTP Client  | Axios                   | Latest     | API calls from frontend to backend          |
| CSS          | Pure CSS (custom)       | —          | Styling and design system                   |
| Backend      | FastAPI                 | 0.111      | Python web framework for REST APIs          |
| ORM          | SQLAlchemy              | 2.0        | Python-to-SQL database interface            |
| Validation   | Pydantic v2             | 2.7        | Request/response data validation            |
| Database     | SQLite                  | 3.x        | Lightweight relational database             |
| ASGI Server  | Uvicorn                 | 0.29       | Runs the FastAPI application                |
| Language     | Python                  | 3.10       | Backend language                            |
| Language     | JavaScript (ES6+)       | —          | Frontend language                           |

---

## 3. Architecture Diagram

### High-Level System Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                         USER'S BROWSER                              │
│                                                                     │
│   ┌─────────────────────────────────────────────────────────┐       │
│   │               REACT FRONTEND (Port 3000)                │       │
│   │                                                         │       │
│   │   ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌───────┐ │       │
│   │   │ Sidebar  │  │  Pages   │  │  Forms   │  │ Toast │ │       │
│   │   └──────────┘  └──────────┘  └──────────┘  └───────┘ │       │
│   │                      │                                  │       │
│   │              ┌───────▼───────┐                          │       │
│   │              │ customerApi.js│  ← Axios HTTP Client     │       │
│   │              └───────┬───────┘                          │       │
│   └──────────────────────┼──────────────────────────────────┘       │
└──────────────────────────┼──────────────────────────────────────────┘
                           │  HTTP / JSON (REST API)
                           │  CORS enabled
                           ▼
┌─────────────────────────────────────────────────────────────────────┐
│                  FASTAPI BACKEND (Port 8000)                        │
│                                                                     │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │                       main.py                               │   │
│  │        (App entry, CORS middleware, error handlers)         │   │
│  └──────────────────────────┬──────────────────────────────────┘   │
│                             │                                       │
│  ┌──────────────────────────▼──────────────────────────────────┐   │
│  │               customer_routes.py  (API Layer)                │   │
│  │   POST /customers/   GET /customers/   GET /customers/search │   │
│  │   GET /customers/{id}  PUT /customers/{id}  DELETE /{id}    │   │
│  └──────────────────────────┬──────────────────────────────────┘   │
│                             │                                       │
│  ┌──────────────────────────▼──────────────────────────────────┐   │
│  │              customer_schemas.py  (Pydantic Layer)           │   │
│  │          Validates data types, formats, constraints          │   │
│  └──────────────────────────┬──────────────────────────────────┘   │
│                             │                                       │
│  ┌──────────────────────────▼──────────────────────────────────┐   │
│  │           customer_validators.py  (Business Rules)           │   │
│  │       Mobile format, email rules, name length checks        │   │
│  └──────────────────────────┬──────────────────────────────────┘   │
│                             │                                       │
│  ┌──────────────────────────▼──────────────────────────────────┐   │
│  │            customer_service.py  (Service Layer)              │   │
│  │    All DB queries: INSERT, SELECT, UPDATE, DELETE, SEARCH   │   │
│  └──────────────────────────┬──────────────────────────────────┘   │
│                             │                                       │
│  ┌──────────────────────────▼──────────────────────────────────┐   │
│  │              customer.py  (SQLAlchemy ORM Model)             │   │
│  │            Maps Python class ↔ SQL customers table           │   │
│  └──────────────────────────┬──────────────────────────────────┘   │
└──────────────────────────────┼──────────────────────────────────────┘
                               │  SQLAlchemy (ORM)
                               ▼
┌─────────────────────────────────────────────────────────────────────┐
│                  SQLITE DATABASE                                     │
│                  appasamy_customers.db                              │
│                                                                     │
│              ┌────────────────────────────┐                        │
│              │      customers table        │                        │
│              │  id, customer_name, mobile  │                        │
│              │  email, gender, type,       │                        │
│              │  location, address, status  │                        │
│              │  created_at                 │                        │
│              └────────────────────────────┘                        │
└─────────────────────────────────────────────────────────────────────┘
```

### Request Flow Summary

```
Browser clicks "Save Customer"
    │
    ├─► React validates the form (validators.js)
    │         If errors → show inline field errors, stop
    │
    ├─► customerApi.js sends HTTP POST to /api/v1/customers/
    │
    ├─► FastAPI receives request → customer_routes.py
    │
    ├─► Pydantic schema validates data types (schemas/customer.py)
    │         If invalid → return 422 Unprocessable Entity
    │
    ├─► Service layer runs business rules (customer_validators.py)
    │         e.g. mobile must be 10 digits, email must be unique
    │
    ├─► Service layer queries the database (customer_service.py)
    │         INSERT INTO customers ...
    │
    ├─► SQLAlchemy commits to SQLite DB
    │
    ├─► FastAPI returns JSON success response
    │
    └─► React shows toast notification "Customer created successfully"
```

---

## 4. Frontend Explanation

### Folder Structure

```
frontend/
├── public/
│   └── index.html              ← HTML entry point (single page)
│
├── src/
│   ├── api/
│   │   └── customerApi.js      ← All Axios HTTP calls to backend
│   │
│   ├── components/
│   │   ├── common/
│   │   │   ├── Badge.jsx         ← StatusBadge, TypeBadge display chips
│   │   │   ├── ConfirmDialog.jsx ← Delete confirmation modal popup
│   │   │   ├── CustomerForm.jsx  ← Reusable form (used by Insert + Update)
│   │   │   ├── Pagination.jsx    ← Page navigation controls
│   │   │   ├── Spinner.jsx       ← Loading indicator
│   │   │   └── Toast.jsx         ← Slide-in notification messages
│   │   │
│   │   └── layout/
│   │       ├── Header.jsx        ← Top bar showing current page title
│   │       └── Sidebar.jsx       ← Left navigation panel
│   │
│   ├── hooks/
│   │   ├── useCustomers.js       ← Customer data state + API integration
│   │   └── useToast.js           ← Toast notification state management
│   │
│   ├── pages/
│   │   ├── InsertCustomer.jsx    ← "Add Customer" page
│   │   ├── UpdateCustomer.jsx    ← "Update Customer" page
│   │   ├── DeleteCustomer.jsx    ← "Delete Customer" page
│   │   └── SearchCustomers.jsx   ← "Search Records" page
│   │
│   ├── styles/
│   │   └── globals.css           ← Design system: colours, fonts, layout
│   │
│   ├── utils/
│   │   ├── validators.js         ← All form validation functions
│   │   └── helpers.js            ← Utilities: date format, truncate, etc.
│   │
│   ├── App.js                    ← Root component: routing + layout shell
│   └── index.js                  ← ReactDOM.render entry point
│
├── .env.example                  ← Environment variable template
└── package.json                  ← Dependencies and scripts
```

### Components

#### Layout Components

**`Sidebar.jsx`**
The left navigation panel. Contains four navigation items: Insert Customer, Update Customer, Delete Customer, and Search Records. Uses `activePage` prop to highlight the current page. Calls `onNavigate` prop when a user clicks a menu item to switch pages.

**`Header.jsx`**
The top bar displayed above every page. Shows the current page title and any contextual information. Receives `activePage` as a prop.

#### Common Components

**`CustomerForm.jsx`**
A reusable form component shared between the Insert and Update pages. Contains all customer fields: name, mobile, email, gender (radio buttons), customer type (dropdown), location (multi-select), address (textarea), and status (toggle). Accepts `onSubmit`, `initialData`, and `errors` as props.

**`Badge.jsx`**
Contains two components:
- `StatusBadge` — renders a coloured chip for active / inactive / pending
- `TypeBadge` — renders a coloured chip for individual / business / government

**`ConfirmDialog.jsx`**
A modal popup used on the Delete page asking "Are you sure?" before permanently deleting a customer record.

**`Toast.jsx`**
A notification system. Displays slide-in messages at the top-right corner of the screen for success and error feedback. Works in combination with the `useToast` hook.

**`Spinner.jsx`**
A rotating loading indicator shown while API calls are in progress.

**`Pagination.jsx`**
Renders page navigation controls (Previous, page numbers, Next) for the search results table.

### Pages

| Page                  | Navigation Key | Description                                          |
|-----------------------|----------------|------------------------------------------------------|
| `SearchCustomers.jsx` | `search`       | Lists all customers with keyword search, status filter, and pagination |
| `InsertCustomer.jsx`  | `insert`       | Form to create a new customer record                 |
| `UpdateCustomer.jsx`  | `update`       | Load customer by ID, edit fields, save changes       |
| `DeleteCustomer.jsx`  | `delete`       | Load customer by ID, preview record, confirm deletion |

### Hooks

**`useToast.js`**
Manages the toast notification queue. Exposes `toasts` array and helper methods `showSuccess(message)` and `showError(message)`. Pages call these methods after API calls succeed or fail.

**`useCustomers.js`**
Encapsulates customer data state and API calls. Exposes `customers`, `loading`, `total`, `page`, `fetchCustomers()`, and related state. Keeps API logic out of page components.

### API Layer — `customerApi.js`

This file is the single point of contact between the frontend and the backend. All six API functions are defined here using Axios.

```javascript
// API base URL (from environment variable or default)
const BASE_URL = process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000/api/v1';

// The six API functions:
createCustomer(payload)              // POST   /customers/
getAllCustomers(page, perPage)        // GET    /customers/?page=1&per_page=10
getCustomerById(id)                  // GET    /customers/{id}
updateCustomer(id, payload)          // PUT    /customers/{id}
deleteCustomer(id)                   // DELETE /customers/{id}
searchCustomers(params)              // GET    /customers/search?keyword=...
```

The Axios instance is configured with:
- `baseURL` pointing to the FastAPI backend
- `Content-Type: application/json` header on all requests
- `timeout: 10000` (10 second timeout)
- A response interceptor that extracts clean error messages from any failed response

### Validation Flow (Frontend)

Validation is defined in `src/utils/validators.js`. Client-side validation runs **before** the API call is made, giving instant feedback without a network round-trip.

```
User fills form and clicks Submit
    │
    ├─► validateCreateForm(formData) is called
    │       validateName()    → checks required, min 2 chars, max 100 chars
    │       validateMobile()  → checks required, exactly 10 digits (/^\d{10}$/)
    │       validateEmail()   → checks required, valid email format
    │
    ├─► If errors exist → display under each field, do NOT call API
    │
    └─► If no errors → call createCustomer(payload) via customerApi.js
```

---

## 5. Backend Explanation

### Folder Structure

```
backend/
├── app/
│   ├── api/
│   │   └── customer_routes.py      ← HTTP endpoints (controllers)
│   │
│   ├── models/
│   │   └── customer.py             ← SQLAlchemy ORM model
│   │
│   ├── schemas/
│   │   └── customer.py             ← Pydantic request/response schemas
│   │
│   ├── services/
│   │   └── customer_service.py     ← Business logic & database queries
│   │
│   ├── database/
│   │   └── config.py               ← DB engine, session factory, Base
│   │
│   ├── validations/
│   │   └── customer_validators.py  ← Business rule validations
│   │
│   ├── utils/
│   │   └── response_helpers.py     ← success_response() and error_response()
│   │
│   └── main.py                     ← App entry point, CORS, error handlers
│
├── customer.sql                    ← SQL schema + sample INSERT data
└── requirements.txt                ← Python dependencies
```

### Layer Responsibilities

#### `main.py` — Application Entry Point

This is where the FastAPI application is created and configured. It does three things:

1. Creates all database tables on startup (`Base.metadata.create_all`)
2. Adds CORS middleware (allows the React frontend on port 3000 to call the API on port 8000)
3. Registers global exception handlers for validation errors and unexpected server errors
4. Registers the customer router under the `/api/v1` prefix

#### `api/customer_routes.py` — Route Handlers (Controllers)

This file defines all six HTTP endpoints. Each function is thin: it receives the request, passes data to the service layer, and returns a formatted response. Route handlers do **not** contain business logic or database queries directly.

```
POST   /api/v1/customers/           → create_customer_route()
GET    /api/v1/customers/           → get_all_customers_route()
GET    /api/v1/customers/search     → search_customers_route()
GET    /api/v1/customers/{id}       → get_customer_route()
PUT    /api/v1/customers/{id}       → update_customer_route()
DELETE /api/v1/customers/{id}       → delete_customer_route()
```

FastAPI uses **Dependency Injection** to provide a database session to each route:
```python
db: Session = Depends(get_db)
```
This means FastAPI automatically opens a DB session, passes it to the function, and closes it when done. The route handler never needs to manage the session itself.

#### `schemas/customer.py` — Pydantic Schemas

Schemas define the **shape** of data coming in (requests) and going out (responses). They are separate from the ORM model. Pydantic automatically validates types and formats before the route handler runs.

| Schema              | Used For                                          |
|---------------------|---------------------------------------------------|
| `CustomerCreate`    | POST body — required fields + validators          |
| `CustomerUpdate`    | PUT body — all fields optional (partial update)   |
| `CustomerResponse`  | What the API returns for a single customer        |
| `CustomerListResponse` | Wrapper for paginated list responses          |

Pydantic enforces:
- Field types (str, int, EmailStr)
- Field lengths (min_length, max_length)
- Enum values (only allowed strings)
- Email format (via `EmailStr`)

#### `validations/customer_validators.py` — Business Rule Validators

These functions run **after** Pydantic validation. They enforce rules that Pydantic cannot handle alone:

| Function                   | Rule Enforced                                              |
|----------------------------|------------------------------------------------------------|
| `validate_mobile_number()` | Must be exactly 10 digits (regex: `^\d{10}$`)             |
| `validate_email()`         | Must not be empty after stripping whitespace               |
| `validate_customer_name()` | Must not be blank, minimum 2 characters                    |
| `validate_create_payload()`| Composite: calls all three validators for new customers    |

These raise `HTTPException` with status 422 if validation fails, which is caught by the global error handler and returned as a clean JSON error response.

#### `services/customer_service.py` — Service Layer

This is where all database operations live. The service layer is the most important layer for trainee developers to study.

**`create_customer(db, payload)`**
1. Calls `validate_create_payload()` for business rule checks
2. Queries DB to check if mobile number already exists (uniqueness)
3. Queries DB to check if email already exists (case-insensitive)
4. Creates a `Customer` ORM object
5. `db.add()` → `db.commit()` → `db.refresh()` to persist and reload
6. Returns the saved customer object

**`get_all_customers(db, page, per_page)`**
1. Counts total records with `func.count()`
2. Calculates offset: `(page - 1) * per_page`
3. Queries with `.offset(offset).limit(per_page)`
4. Returns dict with total, page info, and customer list

**`get_customer_by_id(db, customer_id)`**
1. Queries by primary key with `.filter(Customer.id == customer_id).first()`
2. Raises `404 Not Found` if the record does not exist

**`update_customer(db, customer_id, payload)`**
1. Fetches the existing record (raises 404 if not found)
2. Extracts only non-None fields from payload using `model_dump(exclude_none=True)`
3. Checks for duplicate mobile/email conflicts (excluding the current record)
4. Loops through update fields with `setattr(customer, field, value)`
5. Commits and refreshes

**`delete_customer(db, customer_id)`**
1. Fetches the record (raises 404 if not found)
2. Calls `db.delete(customer)` → `db.commit()`
3. Returns a confirmation message

**`search_customers(db, keyword, status, customer_type, page, per_page)`**
1. Builds a base query
2. If keyword given → adds `.ilike()` filter across name, mobile, email, location with OR
3. If status filter given → adds `.filter(Customer.status == status)`
4. If type filter given → adds `.filter(Customer.customer_type == customer_type)`
5. Applies pagination and returns results

#### `models/customer.py` — SQLAlchemy ORM Model

The `Customer` class maps directly to the `customers` SQL table. Each `Column()` definition corresponds to one database column. SQLAlchemy translates Python operations on this class into SQL queries automatically.

```python
class Customer(Base):
    __tablename__ = "customers"
    id            = Column(Integer, primary_key=True, autoincrement=True)
    customer_name = Column(String(100), nullable=False)
    mobile_number = Column(String(15),  nullable=False, unique=True)
    email         = Column(String(150), nullable=False, unique=True)
    # ... etc
```

#### `utils/response_helpers.py` — Standard Response Format

All API responses use one of two wrappers to ensure consistency:

```python
success_response(data, message)
# Returns: { "status": "success", "message": "...", "data": { ... } }

error_response(message, detail)
# Returns: { "status": "error", "message": "...", "detail": [ ... ] }
```

This consistent format means the React frontend always knows where to find data and error messages.

---

## 6. Database Explanation

### Customer Table Schema

```sql
CREATE TABLE customers (
    id              INTEGER      PRIMARY KEY AUTOINCREMENT,
    customer_name   VARCHAR(100) NOT NULL,
    mobile_number   VARCHAR(15)  NOT NULL UNIQUE,
    email           VARCHAR(150) NOT NULL UNIQUE,
    gender          VARCHAR(10)  CHECK (gender IN ('male', 'female', 'other')),
    customer_type   VARCHAR(20)  DEFAULT 'individual'
                                 CHECK (customer_type IN ('individual', 'business', 'government')),
    location        VARCHAR(100),
    address         VARCHAR(255),
    status          VARCHAR(20)  DEFAULT 'active'
                                 CHECK (status IN ('active', 'inactive', 'pending')),
    created_at      DATETIME     DEFAULT CURRENT_TIMESTAMP
);
```

### Column Descriptions

| Column          | Type         | Required | Unique | Default       | Description                                         |
|-----------------|--------------|----------|--------|---------------|-----------------------------------------------------|
| `id`            | INTEGER      | Yes      | Yes    | Auto          | Primary key. Auto-incremented. Never set manually.  |
| `customer_name` | VARCHAR(100) | Yes      | No     | —             | Full name of the customer. Min 2 chars.             |
| `mobile_number` | VARCHAR(15)  | Yes      | Yes    | —             | 10-digit mobile. No spaces or country codes.        |
| `email`         | VARCHAR(150) | Yes      | Yes    | —             | Email address. Stored in lowercase.                 |
| `gender`        | VARCHAR(10)  | No       | No     | NULL          | One of: `male`, `female`, `other`                  |
| `customer_type` | VARCHAR(20)  | No       | No     | `individual`  | One of: `individual`, `business`, `government`     |
| `location`      | VARCHAR(100) | No       | No     | NULL          | City or region name                                 |
| `address`       | VARCHAR(255) | No       | No     | NULL          | Full mailing address                                |
| `status`        | VARCHAR(20)  | No       | No     | `active`      | One of: `active`, `inactive`, `pending`            |
| `created_at`    | DATETIME     | Yes      | No     | `NOW()`       | Timestamp set automatically when record is created  |

### Database Indexes

```sql
CREATE INDEX idx_customers_mobile ON customers (mobile_number);
CREATE INDEX idx_customers_email  ON customers (email);
CREATE INDEX idx_customers_status ON customers (status);
```

Indexes are created on the three most-searched columns. They speed up `WHERE` lookups significantly on larger datasets.

### Relationships

The current schema has **no foreign keys or relationships**. The `customers` table is standalone. In a production extension, you might add tables like `orders`, `invoices`, or `contacts` that reference `customers.id`.

### Database File

SQLite stores everything in a single file: `appasamy_customers.db`

This file is created automatically when you run the backend for the first time. You can inspect it using any SQLite browser tool (e.g. [DB Browser for SQLite](https://sqlitebrowser.org/)).

---

## 7. Setup Instructions

### Prerequisites

| Requirement      | Minimum Version | Check Command        |
|------------------|-----------------|----------------------|
| Python           | 3.10            | `python --version`   |
| Node.js          | 18              | `node --version`     |
| npm              | 8               | `npm --version`      |
| pip              | Latest          | `pip --version`      |

---

### Step 1 — Backend Setup

```bash
# Navigate to backend folder
cd backend

# Create a virtual environment
python -m venv venv

# Activate the virtual environment
# On Mac / Linux:
source venv/bin/activate

# On Windows (Command Prompt):
venv\Scripts\activate

# On Windows (PowerShell):
venv\Scripts\Activate.ps1

# Install Python dependencies
pip install -r requirements.txt

# Start the backend server
uvicorn app.main:app --reload
```

**Expected output:**
```
INFO:     Uvicorn running on http://127.0.0.1:8000 (Press CTRL+C to quit)
INFO:     Started reloader process
INFO:     Application startup complete.
```

The file `appasamy_customers.db` will be created automatically in the `backend/` folder.

**Verify the backend is running:**
Open your browser and navigate to: `http://127.0.0.1:8000/docs`

You should see the Swagger UI with all API endpoints listed.

---

### Step 2 — Frontend Setup

Open a **new terminal window** (keep the backend terminal running).

```bash
# Navigate to frontend folder
cd frontend

# Install Node.js dependencies
npm install

# Configure the API URL (optional — defaults to http://127.0.0.1:8000)
cp .env.example .env
# Edit .env only if your backend runs on a different port or host

# Start the React development server
npm start
```

**Expected output:**
```
Compiled successfully!

You can now view the app in the browser.

  Local:            http://localhost:3000
  On Your Network:  http://192.168.x.x:3000
```

Your browser should automatically open `http://localhost:3000`.

---

### Step 3 — Load Sample Data (Optional)

To pre-populate the database with 9 sample customers for testing:

```bash
# From the backend/ folder, with the virtual environment active
cd backend

# Open the SQLite database and run the SQL file
sqlite3 appasamy_customers.db < customer.sql
```

Or paste the INSERT statements from `customer.sql` directly into any SQLite browser.

---

### Quick Reference: Run Commands

| What to Run         | Command                              | Port  |
|---------------------|--------------------------------------|-------|
| Backend             | `uvicorn app.main:app --reload`      | 8000  |
| Frontend            | `npm start`                          | 3000  |
| Swagger UI          | Open browser: `http://127.0.0.1:8000/docs`  | —     |
| ReDoc UI            | Open browser: `http://127.0.0.1:8000/redoc` | —     |

---

## 8. API Reference & Testing

### Base URL

```
http://127.0.0.1:8000/api/v1
```

### Endpoint Summary

| Method | Endpoint                  | Description                             | Status Code |
|--------|---------------------------|-----------------------------------------|-------------|
| POST   | `/customers/`             | Create a new customer                   | 201         |
| GET    | `/customers/`             | Get all customers (paginated)           | 200         |
| GET    | `/customers/search`       | Search and filter customers             | 200         |
| GET    | `/customers/{id}`         | Get one customer by ID                  | 200         |
| PUT    | `/customers/{id}`         | Update a customer (partial update)      | 200         |
| DELETE | `/customers/{id}`         | Delete a customer                       | 200         |
| GET    | `/`                       | Health check — confirms API is running  | 200         |

---

### CREATE — POST `/customers/`

**Request:**
```http
POST http://127.0.0.1:8000/api/v1/customers/
Content-Type: application/json

{
  "customer_name": "Rajesh Kumar",
  "mobile_number": "9876543210",
  "email": "rajesh.kumar@email.com",
  "gender": "male",
  "customer_type": "individual",
  "location": "Chennai",
  "address": "12, Anna Nagar, Chennai - 600040",
  "status": "active"
}
```

**Success Response (201 Created):**
```json
{
  "status": "success",
  "message": "Customer created successfully.",
  "data": {
    "id": 1,
    "customer_name": "Rajesh Kumar",
    "mobile_number": "9876543210",
    "email": "rajesh.kumar@email.com",
    "gender": "male",
    "customer_type": "individual",
    "location": "Chennai",
    "address": "12, Anna Nagar, Chennai - 600040",
    "status": "active",
    "created_at": "2025-01-15T10:30:00"
  }
}
```

**Error — Duplicate Mobile (409 Conflict):**
```json
{
  "status": "error",
  "message": "A customer with mobile number '9876543210' already exists.",
  "detail": null
}
```

**Error — Validation Failure (422 Unprocessable Entity):**
```json
{
  "status": "error",
  "message": "Validation failed. Please check your input.",
  "detail": [
    { "field": "body → mobile_number", "issue": "Mobile must be exactly 10 digits" }
  ]
}
```

---

### READ ALL — GET `/customers/`

**Request:**
```http
GET http://127.0.0.1:8000/api/v1/customers/?page=1&per_page=10
```

**Success Response (200 OK):**
```json
{
  "status": "success",
  "message": "Customers retrieved successfully.",
  "data": {
    "total": 25,
    "page": 1,
    "per_page": 10,
    "customers": [
      {
        "id": 1,
        "customer_name": "Rajesh Kumar",
        "mobile_number": "9876543210",
        "email": "rajesh.kumar@email.com",
        "gender": "male",
        "customer_type": "individual",
        "location": "Chennai",
        "address": "12, Anna Nagar, Chennai - 600040",
        "status": "active",
        "created_at": "2025-01-15T10:30:00"
      }
    ]
  }
}
```

---

### READ ONE — GET `/customers/{id}`

**Request:**
```http
GET http://127.0.0.1:8000/api/v1/customers/1
```

**Success Response (200 OK):**
```json
{
  "status": "success",
  "message": "Customer retrieved successfully.",
  "data": {
    "id": 1,
    "customer_name": "Rajesh Kumar",
    "mobile_number": "9876543210",
    "email": "rajesh.kumar@email.com",
    "gender": "male",
    "customer_type": "individual",
    "location": "Chennai",
    "address": "12, Anna Nagar, Chennai - 600040",
    "status": "active",
    "created_at": "2025-01-15T10:30:00"
  }
}
```

**Error — Not Found (404):**
```json
{
  "detail": "Customer with id 999 not found."
}
```

---

### SEARCH — GET `/customers/search`

**Request — Keyword Search:**
```http
GET http://127.0.0.1:8000/api/v1/customers/search?keyword=Chennai
```

**Request — Filter by Status:**
```http
GET http://127.0.0.1:8000/api/v1/customers/search?status=active
```

**Request — Combined Filter:**
```http
GET http://127.0.0.1:8000/api/v1/customers/search?keyword=Chennai&status=active&customer_type=individual&page=1&per_page=10
```

**Success Response (200 OK):**
```json
{
  "status": "success",
  "message": "Search results retrieved.",
  "data": {
    "total": 3,
    "page": 1,
    "per_page": 10,
    "customers": [ ... ]
  }
}
```

---

### UPDATE — PUT `/customers/{id}`

Only include the fields you want to change. Other fields remain unchanged.

**Request — Update status only:**
```http
PUT http://127.0.0.1:8000/api/v1/customers/1
Content-Type: application/json

{
  "status": "inactive"
}
```

**Request — Update multiple fields:**
```http
PUT http://127.0.0.1:8000/api/v1/customers/1
Content-Type: application/json

{
  "location": "Coimbatore",
  "address": "45, RS Puram, Coimbatore - 641002",
  "status": "inactive"
}
```

**Success Response (200 OK):**
```json
{
  "status": "success",
  "message": "Customer updated successfully.",
  "data": {
    "id": 1,
    "customer_name": "Rajesh Kumar",
    "mobile_number": "9876543210",
    "email": "rajesh.kumar@email.com",
    "location": "Coimbatore",
    "status": "inactive",
    "created_at": "2025-01-15T10:30:00"
  }
}
```

---

### DELETE — DELETE `/customers/{id}`

**Request:**
```http
DELETE http://127.0.0.1:8000/api/v1/customers/1
```

**Success Response (200 OK):**
```json
{
  "status": "success",
  "message": "Customer deleted successfully.",
  "data": {
    "message": "Customer 'Rajesh Kumar' (id=1) has been deleted successfully."
  }
}
```

---

## 9. Training Walkthrough

This section explains every concept in beginner-friendly language for developers who are new to full-stack development.

---

### Concept 1 — How Data Moves from Frontend to Backend

**Scenario:** A user opens the "Add Customer" page, fills in the form, and clicks Save.

**Step-by-step:**

**Step 1 — User fills the form in React**
The form is rendered by `InsertCustomer.jsx` which uses the `CustomerForm.jsx` component. Each field is controlled by React's `useState`. As the user types, the state updates.

```javascript
const [form, setForm] = useState({
  customer_name: '',
  mobile_number: '',
  email: '',
  ...
});
```

**Step 2 — User clicks "Save Customer"**
The `handleSubmit` function runs. It first calls `validateCreateForm(form)` from `validators.js`.

**Step 3 — Frontend validation runs**
```javascript
const errors = validateCreateForm(form);
if (hasErrors(errors)) {
  setErrors(errors);  // Show errors under each field
  return;             // Stop! Don't call API
}
```

**Step 4 — If validation passes, call the API**
```javascript
const result = await createCustomer(form);
```
This calls `customerApi.js` which uses Axios to send an HTTP POST request:
```
POST http://127.0.0.1:8000/api/v1/customers/
Content-Type: application/json
Body: { "customer_name": "Rajesh", "mobile_number": "9876543210", ... }
```

**Step 5 — FastAPI receives the request**
FastAPI's router in `customer_routes.py` matches the POST method and `/customers/` path. The `create_customer_route()` function runs.

**Step 6 — Pydantic validates the incoming data**
The `CustomerCreate` schema automatically parses the JSON body. If any field has wrong type or format, FastAPI immediately returns a 422 error without calling the route function.

**Step 7 — Route handler calls the service layer**
```python
customer = create_customer(db, payload)
```

**Step 8 — Service layer validates business rules**
```python
validate_create_payload(customer_name, mobile_number, email)
```
This checks the mobile is 10 digits, email is valid, name is not blank.

**Step 9 — Service layer checks for duplicates**
```python
existing = db.query(Customer).filter(Customer.mobile_number == payload.mobile_number).first()
if existing:
    raise HTTPException(status_code=409, detail="Mobile already exists")
```

**Step 10 — Service layer inserts into the database**
```python
new_customer = Customer(customer_name=..., mobile_number=..., ...)
db.add(new_customer)
db.commit()
db.refresh(new_customer)
```
SQLAlchemy translates this into:
```sql
INSERT INTO customers (customer_name, mobile_number, email, ...)
VALUES ('Rajesh Kumar', '9876543210', 'rajesh@email.com', ...);
```

**Step 11 — Backend returns success response**
```json
{ "status": "success", "message": "Customer created successfully.", "data": { "id": 1, ... } }
```

**Step 12 — React shows toast notification**
```javascript
toast.showSuccess("Customer created successfully.");
```
The green toast slides in at the top right of the screen.

---

### Concept 2 — How Validation Works

Validation happens at **three different layers** in this application:

```
Layer 1: React Frontend (validators.js)
  ↓  Catches obvious errors before network call
  ↓  Purpose: fast feedback, saves API round-trips

Layer 2: FastAPI + Pydantic (schemas/customer.py)
  ↓  Catches type errors, format errors, missing fields
  ↓  Purpose: protects API from malformed data

Layer 3: Service Layer (customer_validators.py)
  ↓  Catches business rule violations
  ↓  Purpose: enforces domain rules (10-digit mobile, uniqueness)
```

**Example — What happens when a user enters a 9-digit mobile number:**

- **Frontend:** `validateMobile("987654321")` → returns `"Mobile must be exactly 10 digits"` → red error under the mobile field → API call never made
- **Backend (if someone bypasses the frontend):** `validate_mobile_number("987654321")` → raises `HTTPException(422, "Must be exactly 10 digits")`
- **Result:** The invalid data never reaches the database

**Validation Rules Summary:**

| Field           | Frontend Rule                    | Backend Rule                        |
|-----------------|----------------------------------|-------------------------------------|
| customer_name   | Required, 2–100 chars            | Required, not blank, min 2 chars    |
| mobile_number   | Required, regex `^\d{10}$`       | Required, regex `^\d{10}$`          |
| email           | Required, valid email format     | Required, valid format, unique in DB|
| gender          | Optional, no validation needed   | Enum: male/female/other             |
| customer_type   | Optional, from fixed list        | Enum: individual/business/government|
| status          | Optional, from fixed list        | Enum: active/inactive/pending       |

---

### Concept 3 — How APIs Work

An API (Application Programming Interface) is a set of rules that lets two software programs talk to each other. In this application, React and FastAPI communicate using a **REST API** over HTTP.

**The key concepts:**

**HTTP Methods** — tell the server what operation to perform:
- `GET` → Retrieve data (read only, no body)
- `POST` → Create new data (send a body with the new record)
- `PUT` → Update existing data (send a body with updated fields)
- `DELETE` → Remove data

**URL Structure:**
```
http://127.0.0.1:8000/api/v1/customers/1
│                    │       │         │
│                    │       │         └── Resource ID
│                    │       └──────────── Resource name
│                    └──────────────────── Version prefix
└───────────────────────────────────────── Server address and port
```

**Status Codes** — the server's answer about what happened:
- `200` → OK, success
- `201` → Created (a new record was successfully created)
- `404` → Not Found (the ID you asked for doesn't exist)
- `409` → Conflict (duplicate mobile or email)
- `422` → Unprocessable Entity (your input failed validation)
- `500` → Server Error (something unexpected went wrong)

**JSON** — the data format used to send and receive information:
```json
{
  "customer_name": "Rajesh Kumar",
  "mobile_number": "9876543210",
  "email": "rajesh@email.com"
}
```

**CORS (Cross-Origin Resource Sharing):** The React app runs on port 3000. The FastAPI backend runs on port 8000. By default, browsers block requests between different ports (for security). FastAPI's CORS middleware in `main.py` explicitly allows the React frontend to make API calls.

---

### Concept 4 — How SQL Operations Happen

When the service layer runs Python code like `db.query(Customer).filter(...).all()`, SQLAlchemy translates it into SQL automatically. Here are the four CRUD operations mapped to SQL:

**CREATE — Inserting a new customer:**
```python
# Python (SQLAlchemy)
new_customer = Customer(customer_name="Rajesh", mobile_number="9876543210", ...)
db.add(new_customer)
db.commit()

# Equivalent SQL
INSERT INTO customers (customer_name, mobile_number, email, gender, customer_type, location, address, status)
VALUES ('Rajesh', '9876543210', 'rajesh@email.com', 'male', 'individual', 'Chennai', '...', 'active');
```

**READ — Fetching all customers with pagination:**
```python
# Python (SQLAlchemy)
customers = db.query(Customer).offset(0).limit(10).all()

# Equivalent SQL
SELECT * FROM customers LIMIT 10 OFFSET 0;
```

**READ — Fetching one customer by ID:**
```python
# Python (SQLAlchemy)
customer = db.query(Customer).filter(Customer.id == 1).first()

# Equivalent SQL
SELECT * FROM customers WHERE id = 1 LIMIT 1;
```

**READ — Search with keyword:**
```python
# Python (SQLAlchemy)
query = db.query(Customer).filter(
    or_(
        Customer.customer_name.ilike("%Chennai%"),
        Customer.email.ilike("%Chennai%"),
        Customer.location.ilike("%Chennai%"),
    )
)

# Equivalent SQL
SELECT * FROM customers
WHERE customer_name LIKE '%Chennai%'
   OR email LIKE '%Chennai%'
   OR location LIKE '%Chennai%';
```

**UPDATE — Changing specific fields:**
```python
# Python (SQLAlchemy)
customer.status = "inactive"
customer.location = "Coimbatore"
db.commit()

# Equivalent SQL
UPDATE customers SET status = 'inactive', location = 'Coimbatore' WHERE id = 1;
```

**DELETE — Removing a record:**
```python
# Python (SQLAlchemy)
db.delete(customer)
db.commit()

# Equivalent SQL
DELETE FROM customers WHERE id = 1;
```

**Why use SQLAlchemy instead of writing SQL directly?**
- Python objects are easier to work with than raw SQL strings
- SQLAlchemy prevents SQL injection attacks
- The same Python code works with SQLite, PostgreSQL, and MySQL — just change the connection string
- It handles session management, connection pooling, and transaction commits automatically

---

### Concept 5 — How Pagination Works

Pagination breaks large datasets into manageable pages so the browser does not have to load thousands of records at once.

**The math:**
```
Total records: 47
Records per page: 10

Page 1: records 1–10    (offset=0,  limit=10)
Page 2: records 11–20   (offset=10, limit=10)
Page 3: records 21–30   (offset=20, limit=10)
Page 4: records 31–40   (offset=30, limit=10)
Page 5: records 41–47   (offset=40, limit=7)

Formula: offset = (page - 1) * per_page
```

**Backend calculates:**
```python
offset = (page - 1) * per_page
total  = db.query(func.count(Customer.id)).scalar()
customers = db.query(Customer).offset(offset).limit(per_page).all()
```

**Response includes pagination metadata:**
```json
{
  "total": 47,
  "page": 2,
  "per_page": 10,
  "customers": [ ... 10 records ... ]
}
```

**Frontend uses this metadata to render page controls:** The `Pagination.jsx` component renders Previous/Next buttons and page number links based on `total`, `page`, and `per_page` values from the API response.

---

## 10. Validation Reference

### Frontend Validation Rules (`validators.js`)

```javascript
validateName(value)
  // Required
  // Minimum 2 characters after trim
  // Maximum 100 characters

validateMobile(value)
  // Required
  // Must match /^\d{10}$/ — exactly 10 digits, no spaces, no dashes

validateEmail(value)
  // Required
  // Must match /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  // Maximum 150 characters

validateCreateForm(form)
  // Runs all three validators
  // Returns { field: "error message" } object
  // Empty object means no errors

validateUpdateForm(form)
  // Same as Create but all fields are optional
  // Only validates fields that are present and not empty
```

### Backend Validation Rules

**Pydantic (automatic — `schemas/customer.py`):**
- `customer_name`: `min_length=2`, `max_length=100`
- `mobile_number`: `str` type (no automatic format check — that's done by validators)
- `email`: `EmailStr` — Pydantic's built-in email validator
- `gender`: Enum — must be `male`, `female`, or `other`
- `customer_type`: Enum — must be `individual`, `business`, or `government`
- `status`: Enum — must be `active`, `inactive`, or `pending`

**Custom validators (`customer_validators.py`):**
- `validate_mobile_number()`: regex `^\d{10}$` — exactly 10 digits
- `validate_customer_name()`: not blank after strip, min 2 chars
- `validate_email()`: not blank after strip

**Service layer (duplicate checks):**
- Mobile number must be unique across all customers
- Email must be unique (case-insensitive comparison)

---

## 11. Error Handling Reference

### HTTP Status Codes Used

| Code | Meaning                | When It Happens                                           |
|------|------------------------|-----------------------------------------------------------|
| 200  | OK                     | Successful GET, PUT, DELETE                               |
| 201  | Created                | Successful POST (new customer created)                    |
| 400  | Bad Request            | Update sent with no fields (nothing to update)            |
| 404  | Not Found              | Customer ID does not exist in the database                |
| 409  | Conflict               | Duplicate mobile number or email address                  |
| 422  | Unprocessable Entity   | Pydantic or custom validator rejected the input           |
| 500  | Internal Server Error  | Unexpected error (bug in the code)                        |

### Global Error Handlers (`main.py`)

Two handlers catch errors before they reach the client:

**`RequestValidationError` handler:** Catches all Pydantic validation failures and formats them into a readable list:
```json
{
  "status": "error",
  "message": "Validation failed. Please check your input.",
  "detail": [
    { "field": "body → mobile_number", "issue": "value is not a valid..." }
  ]
}
```

**Generic `Exception` handler:** Catches any unhandled Python exception:
```json
{
  "status": "error",
  "message": "An unexpected error occurred.",
  "detail": "error message here"
}
```

### Frontend Error Handling (`customerApi.js`)

The Axios response interceptor normalises all API errors into a consistent `{ message: "..." }` format:
```javascript
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const msg =
      error?.response?.data?.message ||
      error?.response?.data?.detail  ||
      error?.message                 ||
      'An unexpected error occurred.';
    return Promise.reject({ message: msg, raw: error });
  }
);
```

This means every page component can handle errors with a simple `catch(err) => toast.showError(err.message)` without needing to inspect the error shape.

---

## Quick Reference Card

```
PROJECT STRUCTURE AT A GLANCE
══════════════════════════════════════════════════════════════════

  FRONTEND (React)                    BACKEND (FastAPI)
  ─────────────────                   ──────────────────
  src/api/customerApi.js              app/api/customer_routes.py
    └─ 6 Axios functions                └─ 6 HTTP endpoints

  src/pages/                          app/services/customer_service.py
    InsertCustomer.jsx                  └─ create, read, update, delete, search
    UpdateCustomer.jsx
    DeleteCustomer.jsx                app/models/customer.py
    SearchCustomers.jsx                 └─ ORM → customers table

  src/utils/validators.js             app/schemas/customer.py
    └─ validateName()                   └─ CustomerCreate, CustomerUpdate
    └─ validateMobile()                     CustomerResponse
    └─ validateEmail()
                                      app/validations/customer_validators.py
  src/components/                       └─ mobile regex, email, name checks
    layout/Sidebar.jsx
    layout/Header.jsx                 app/database/config.py
    common/CustomerForm.jsx             └─ SQLite engine + session
    common/Toast.jsx

DATABASE
─────────────
  File: appasamy_customers.db
  Table: customers (10 columns)
  Key constraints: mobile_number UNIQUE, email UNIQUE
  Auto fields: id (autoincrement), created_at (timestamp)

API BASE URL
────────────
  http://127.0.0.1:8000/api/v1

SWAGGER DOCS
────────────
  http://127.0.0.1:8000/docs

FRONTEND
────────
  http://localhost:3000
```

---

*Appasamy Associates — Internal Developer Training Documentation*
*Customer Management Demo v1.0 | FastAPI + React | Training Purpose Only*
