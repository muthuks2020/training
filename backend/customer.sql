-- =============================================================================
-- customer.sql
-- Appasamy Customer Management — Database Schema
-- Compatible with: SQLite (default) | PostgreSQL | MySQL
-- =============================================================================

-- Drop table if it exists (useful during development / reset)
DROP TABLE IF EXISTS customers;

-- =============================================================================
-- TABLE: customers
-- =============================================================================
CREATE TABLE customers (
    id              INTEGER         PRIMARY KEY AUTOINCREMENT,   -- Unique identifier (auto-incremented)
    customer_name   VARCHAR(100)    NOT NULL,                    -- Full name of the customer
    mobile_number   VARCHAR(15)     NOT NULL UNIQUE,             -- 10-digit mobile (must be unique)
    email           VARCHAR(150)    NOT NULL UNIQUE,             -- Email address (must be unique)
    gender          VARCHAR(10)     CHECK (gender IN ('male', 'female', 'other')),
    customer_type   VARCHAR(20)     DEFAULT 'individual'
                                    CHECK (customer_type IN ('individual', 'business', 'government')),
    location        VARCHAR(100),                                -- City or region
    address         VARCHAR(255),                                -- Full mailing address
    status          VARCHAR(20)     DEFAULT 'active'
                                    CHECK (status IN ('active', 'inactive', 'pending')),
    created_at      DATETIME        DEFAULT CURRENT_TIMESTAMP    -- Auto-set on insert
);

-- =============================================================================
-- INDEXES — speed up common lookups
-- =============================================================================
CREATE INDEX IF NOT EXISTS idx_customers_mobile ON customers (mobile_number);
CREATE INDEX IF NOT EXISTS idx_customers_email  ON customers (email);
CREATE INDEX IF NOT EXISTS idx_customers_status ON customers (status);

-- =============================================================================
-- SAMPLE INSERT STATEMENTS
-- =============================================================================

INSERT INTO customers (customer_name, mobile_number, email, gender, customer_type, location, address, status)
VALUES
    ('Rajesh Kumar',     '9876543210', 'rajesh.kumar@email.com',      'male',   'individual', 'Chennai',    '12, Anna Nagar, Chennai - 600040',              'active'),
    ('Priya Sharma',     '9845123456', 'priya.sharma@email.com',      'female', 'individual', 'Coimbatore', '45, RS Puram, Coimbatore - 641002',             'active'),
    ('Suresh Patel',     '9712345678', 'suresh.patel@business.com',   'male',   'business',   'Madurai',    '78, Bypass Road, Madurai - 625010',             'active'),
    ('Anitha Rajan',     '9600112233', 'anitha.rajan@corp.com',       'female', 'business',   'Trichy',     '3, Thillai Nagar, Trichy - 620018',             'active'),
    ('Karthik Venkat',   '9500223344', 'karthik.v@gmail.com',         'male',   'individual', 'Salem',      '22, Fairlands, Salem - 636016',                 'inactive'),
    ('Deepa Krishnan',   '9488334455', 'deepa.k@yahoo.com',           'female', 'individual', 'Vellore',    '56, Katpadi Road, Vellore - 632007',            'active'),
    ('Tamil Selvan',     '9388445566', 'tamilselvan@gov.in',          'male',   'government', 'Chennai',    'Government Quarters, Secretariat, Chennai',     'active'),
    ('Meena Durai',      '9275556677', 'meena.durai@email.com',       'female', 'individual', 'Tirunelveli','90, Palayamkottai Rd, Tirunelveli - 627002',    'pending'),
    ('Bala Subramanian', '9160667788', 'bala.sub@techcorp.com',       'male',   'business',   'Erode',      '14, Industrial Area, Erode - 638001',           'active'),
    ('Kavitha Nair',     '9050778899', 'kavitha.nair@startup.io',     'female', 'business',   'Chennai',    '7, Velachery Main Road, Chennai - 600042',      'active');

-- =============================================================================
-- VERIFY DATA
-- =============================================================================
-- SELECT * FROM customers;
-- SELECT COUNT(*) FROM customers;
