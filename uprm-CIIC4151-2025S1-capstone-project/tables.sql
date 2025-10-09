-- Notes: username removed from users table (replaced it with email).
-- verifications table can be ignored for now (will be used later for email code verification).
-- civilians table needs to go? maybe. Since every user will be a civilian by default (later can be upgraded to administrator).
-- if civilians table gets removed, then it's important to add the suspended attribute to users table.
-- in the reports table, changed the reference (from the created_by) to users_id instead of civilians.
-- create a category attribute? yes or no?


CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    admin BOOLEAN DEFAULT FALSE -- verify syntax
    -- suspended --
    -- pinned --
);

-- Ignore --
CREATE TABLE verifications (
    id SERIAL PRIMARY KEY,
    email VARCHAR(50) UNIQUE NOT NULL,
    code VARCHAR(6) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
-- Ignore --

-- Removal Pending --
CREATE TABLE civilians (
    id INTEGER PRIMARY KEY REFERENCES users(id),
    suspended BOOLEAN DEFAULT FALSE
);
-- Removal Pending --

CREATE TABLE administrators (
    id INTEGER PRIMARY KEY REFERENCES users(id),
    department VARCHAR CHECK (department IN ('DTOP', 'LUMA', 'AAA', 'DDS')) NOT NULL
);

CREATE TABLE location (
    id INTEGER PRIMARY KEY,
    latitude DECIMAL(9,6) NOT NULL,
    longitude DECIMAL(9,6) NOT NULL
);

CREATE TABLE reports (
    id SERIAL PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    status VARCHAR(20) CHECK (status IN ('resolved', 'denied', 'in_progress', 'open')) DEFAULT 'open',
    created_by INTEGER REFERENCES users(id) NOT NULL,
    validated_by INTEGER REFERENCES administrators(id),
    resolved_by INTEGER REFERENCES administrators(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    resolved_at TIMESTAMP,
    location INTEGER REFERENCES location(id),
    image_url TEXT,
    rating INTEGER
    -- category --
);

CREATE TABLE department_admins (
    department VARCHAR PRIMARY KEY CHECK (department IN ('DTOP', 'LUMA', 'AAA', 'DDS')) NOT NULL,
    admin_id INTEGER REFERENCES administrators(id)
);
