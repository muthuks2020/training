/**
 * api/customerApi.js
 * ------------------
 * All HTTP calls to the FastAPI backend using the native browser Fetch API.
 * No third-party HTTP library — zero extra dependencies.
 *
 * Pattern used throughout:
 *   1. Build the full URL (base + path + optional query string).
 *   2. Call fetch() with method, headers, and optional JSON body.
 *   3. Parse the JSON response.
 *   4. If the HTTP status is not OK, throw a normalised error object
 *      so every caller can do: catch(err) => toast.error(err.message)
 *   5. Return the parsed data on success.
 */

// ── Base URL ──────────────────────────────────────────────────────────────────
// Read from the .env file (REACT_APP_API_URL=http://...) or fall back to the
// default local dev address.  Create React App exposes env vars that start
// with REACT_APP_ automatically.
const BASE_URL =
  process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000/api/v1';

// ── Shared headers ────────────────────────────────────────────────────────────
const JSON_HEADERS = {
  'Content-Type': 'application/json',
  Accept: 'application/json',
};

// ── Helper: build a query string from a plain object ─────────────────────────
// e.g. buildQuery({ page: 1, per_page: 10 }) → "?page=1&per_page=10"
// Skips keys whose value is undefined, null, or empty string so we never
// send ?keyword=&status= to the backend.
const buildQuery = (params = {}) => {
  const qs = Object.entries(params)
    .filter(([, v]) => v !== undefined && v !== null && v !== '')
    .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
    .join('&');
  return qs ? `?${qs}` : '';
};

// ── Core request wrapper ──────────────────────────────────────────────────────
// All six API functions delegate here.
//
// @param {string}  method   - HTTP verb: 'GET' | 'POST' | 'PUT' | 'DELETE'
// @param {string}  path     - Path relative to BASE_URL, e.g. '/customers/1'
// @param {Object}  [body]   - Request body (serialised to JSON for POST/PUT)
// @param {Object}  [query]  - URL query params (for GET requests)
// @returns {Promise<any>}   - The `data` field from the backend JSON envelope
//
// Backend response envelope:
//   { "status": "success"|"error", "message": "...", "data": {...} | null }
//
// On HTTP error (4xx / 5xx) we throw { message: string } so callers don't
// need to inspect response shapes — they just catch and read err.message.
const request = async (method, path, { body, query } = {}) => {
  const url = `${BASE_URL}${path}${buildQuery(query)}`;

  const options = {
    method,
    headers: JSON_HEADERS,
    // Only include a body for mutating requests
    ...(body !== undefined && { body: JSON.stringify(body) }),
  };

  let response;
  try {
    response = await fetch(url, options);
  } catch (networkError) {
    // fetch() itself throws only on network failure (no internet, CORS
    // preflight blocked, server completely down, etc.)
    throw {
      message:
        'Cannot reach the server. Please check that the backend is running.',
      raw: networkError,
    };
  }

  // Parse the JSON body regardless of status so we can read error messages
  let json;
  try {
    json = await response.json();
  } catch {
    // Non-JSON response (e.g. a plain 500 from a proxy)
    throw {
      message: `Unexpected response from server (HTTP ${response.status}).`,
    };
  }

  // If HTTP status is not in the 200-299 range, surface the backend's message
  if (!response.ok) {
    throw {
      message:
        json?.message ||
        json?.detail  ||
        `Request failed with status ${response.status}.`,
      raw: json,
    };
  }

  // Return the inner `data` payload from the success envelope
  return json;
};

// ── Customer API Functions ────────────────────────────────────────────────────

/**
 * Create a new customer.
 *
 * POST /customers/
 * Body: { customer_name, mobile_number, email, gender?, customer_type?,
 *         location?, address?, status? }
 */
export const createCustomer = (payload) =>
  request('POST', '/customers/', { body: payload });

/**
 * Retrieve a paginated list of all customers.
 *
 * GET /customers/?page=1&per_page=10
 */
export const getAllCustomers = (page = 1, perPage = 10) =>
  request('GET', '/customers/', { query: { page, per_page: perPage } });

/**
 * Retrieve a single customer by their numeric ID.
 *
 * GET /customers/{id}
 */
export const getCustomerById = (id) =>
  request('GET', `/customers/${id}`);

/**
 * Update an existing customer (partial update — only send changed fields).
 *
 * PUT /customers/{id}
 * Body: any subset of CustomerUpdate fields
 */
export const updateCustomer = (id, payload) =>
  request('PUT', `/customers/${id}`, { body: payload });

/**
 * Permanently delete a customer.
 *
 * DELETE /customers/{id}
 */
export const deleteCustomer = (id) =>
  request('DELETE', `/customers/${id}`);

/**
 * Search / filter customers.
 *
 * GET /customers/search?keyword=...&status=...&customer_type=...&page=1&per_page=10
 *
 * All params are optional — omit a key to skip that filter.
 */
export const searchCustomers = (params = {}) =>
  request('GET', '/customers/search', { query: params });
