CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    position VARCHAR(13) CHECK (position IN ('civilian', 'administrator')),
    email VARCHAR(50) UNIQUE NOT NULL
);

CREATE TABLE verifications (
    id SERIAL PRIMARY KEY,
    email VARCHAR(50) UNIQUE NOT NULL,
    code VARCHAR(6) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE civilians (
    id INTEGER PRIMARY KEY REFERENCES users(id),
    suspended BOOLEAN DEFAULT FALSE
);

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
    description TEXT,
    status VARCHAR(10) CHECK (status IN ('resolved', 'denied', 'in_progress', 'open')) DEFAULT 'open',
    created_by INTEGER REFERENCES civilians(id) NOT NULL,
    validated_by INTEGER REFERENCES administrators(id),
    resolved_by INTEGER REFERENCES administrators(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    resolved_at TIMESTAMP,
    location INTEGER REFERENCES location(id),
    image_url TEXT,
    rating INTEGER
);

CREATE TABLE department_admins (
    department VARCHAR PRIMARY KEY CHECK (department IN ('DTOP', 'LUMA', 'AAA', 'DDS')) NOT NULL,
    admin_id INTEGER REFERENCES administrators(id)
);
