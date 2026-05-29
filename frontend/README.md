# Appasamy Customer Management — Frontend

Enterprise React application for managing customer data, connected to the FastAPI backend.

---

## Tech Stack

| Layer         | Technology                       |
|---------------|----------------------------------|
| Framework     | React 18 (Create React App)      |
| HTTP Client   | Native Fetch API (built-in)      |
| Styling       | Pure CSS (custom design system)  |
| Fonts         | Playfair Display + DM Sans       |
| State         | React useState / custom hooks    |

---

## Project Structure

```
frontend/
├── public/
│   └── index.html
├── src/
│   ├── api/
│   │   └── customerApi.js        ← All Fetch API calls
│   ├── components/
│   │   ├── common/
│   │   │   ├── Badge.jsx         ← StatusBadge, TypeBadge
│   │   │   ├── ConfirmDialog.jsx ← Delete confirmation modal
│   │   │   ├── CustomerForm.jsx  ← Reusable form (Insert + Update)
│   │   │   ├── Pagination.jsx    ← Page controls
│   │   │   ├── Spinner.jsx       ← Loading indicators
│   │   │   └── Toast.jsx         ← Notification toasts
│   │   └── layout/
│   │       ├── Header.jsx        ← Top bar with page title
│   │       └── Sidebar.jsx       ← Navigation sidebar
│   ├── hooks/
│   │   ├── useCustomers.js       ← Customers state + API
│   │   └── useToast.js           ← Toast notification state
│   ├── pages/
│   │   ├── InsertCustomer.jsx    ← Create new customer
│   │   ├── UpdateCustomer.jsx    ← Edit existing customer
│   │   ├── DeleteCustomer.jsx    ← Remove customer
│   │   └── SearchCustomers.jsx   ← Browse + filter + paginate
│   ├── styles/
│   │   └── globals.css           ← Complete design system
│   ├── utils/
│   │   └── validators.js         ← All validation functions
│   ├── App.js                    ← Root with routing + toast
│   └── index.js                  ← React DOM entry point
├── .env.example
├── package.json
└── README.md
```

---

## Setup

### Prerequisites
- Node.js 18+ and npm

### Step 1 — Install
```bash
cd frontend
npm install
```

### Step 2 — Configure API URL
```bash
cp .env.example .env
# Edit .env if your backend is not on http://127.0.0.1:8000
```

### Step 3 — Start
```bash
npm start
# Opens at http://localhost:3000
```

> Make sure the FastAPI backend is running on port 8000 first.

---

## Pages

| Page             | Route (tab)  | Description                              |
|------------------|--------------|------------------------------------------|
| Search Customers | `search`     | Browse all, keyword search, filter       |
| Insert Customer  | `insert`     | Create a new customer record             |
| Update Customer  | `update`     | Load by ID and edit fields               |
| Delete Customer  | `delete`     | Load by ID, preview, confirm delete      |

---

## Form Fields

| Field          | Input Type    | Validation                        |
|----------------|---------------|-----------------------------------|
| customer_name  | Text          | Required, min 2 chars             |
| mobile_number  | Text          | Required, exactly 10 digits       |
| email          | Email         | Required, valid email format      |
| gender         | Radio buttons | Optional: male / female / other   |
| customer_type  | Dropdown      | individual / business / government|
| location       | Multi-select  | Optional, multiple cities         |
| address        | Text          | Optional, free text               |
| status         | Toggle        | active / inactive / pending       |

---

## API Integration

All calls are in `src/api/customerApi.js`. Axios is configured with:
- Base URL from `REACT_APP_API_URL` env var
- 10-second timeout
- Response interceptor that normalises error messages

```js
// Example usage
import { createCustomer, searchCustomers } from './api/customerApi';

const result = await createCustomer({ customer_name: 'John', ... });
const list   = await searchCustomers({ keyword: 'Chennai', status: 'active' });
```

---

## Validation

Client-side validation in `src/utils/validators.js` mirrors backend rules:
- Required field checks
- Mobile: exactly 10 digits (`/^\d{10}$/`)
- Email: standard email format regex

Errors appear inline under each field and as toast notifications.

---

## Design System

- **Colors**: Deep Navy (`#0D1B2A`) + Gold (`#C9A84C`) + Clean whites
- **Typography**: Playfair Display (headings) + DM Sans (body)
- **Branding**: Consistent Appasamy enterprise identity
- **Animations**: Fade-in entrances, toast slide-in, dialog pop
