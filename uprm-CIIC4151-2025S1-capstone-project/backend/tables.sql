-- Drop tables in correct order to handle foreign key dependencies
DROP TABLE IF EXISTS pinned_reports;

DROP TABLE IF EXISTS department_admins;

DROP TABLE IF EXISTS reports;

DROP TABLE IF EXISTS administrators;

DROP TABLE IF EXISTS location;

DROP TABLE IF EXISTS verifications;

DROP TABLE IF EXISTS users;

DROP TABLE IF EXISTS admin_codes;

-- Users table with suspended and pinned attributes
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(50) UNIQUE NOT NULL,
    PASSWORD VARCHAR(255) NOT NULL,
    ADMIN BOOLEAN DEFAULT FALSE,
    suspended BOOLEAN DEFAULT FALSE,
    pinned BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Email verification table
CREATE TABLE verifications (
    id SERIAL PRIMARY KEY,
    email VARCHAR(50) UNIQUE NOT NULL,
    code VARCHAR(6) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Administrators table (extended user info for admins)
CREATE TABLE administrators (
    id INTEGER PRIMARY KEY REFERENCES users (id) ON DELETE CASCADE,
    department VARCHAR CHECK (
        department IN ('DTOP', 'LUMA', 'AAA', 'DDS')
    ) NOT NULL
);

-- Location table
CREATE TABLE location (
    id SERIAL PRIMARY KEY,
    latitude DECIMAL(9, 6) NOT NULL,
    longitude DECIMAL(9, 6) NOT NULL,
    address TEXT,
    city VARCHAR(100),
    country VARCHAR(100)
);

-- Reports table with category
CREATE TABLE reports (
    id SERIAL PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    status VARCHAR(20) CHECK (
        status IN (
            'resolved',
            'denied',
            'in_progress',
            'open',
            'closed'
        )
    ) DEFAULT 'open',
    category VARCHAR(50) CHECK (
        category IN (
            'pothole',
            'street_light',
            'traffic_signal',
            'road_damage',
            'sanitation',
            'other'
        )
    ) DEFAULT 'other',
    created_by INTEGER REFERENCES users (id) NOT NULL,
    validated_by INTEGER REFERENCES administrators (id),
    resolved_by INTEGER REFERENCES administrators (id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    resolved_at TIMESTAMP,
    location INTEGER REFERENCES location (id),
    image_url TEXT,
    rating INTEGER CHECK (
        rating >= 1
        AND rating <= 5
    )
);

-- Department admins junction table
CREATE TABLE department_admins (
    department VARCHAR PRIMARY KEY CHECK (
        department IN ('DTOP', 'LUMA', 'AAA', 'DDS')
    ) NOT NULL,
    admin_id INTEGER REFERENCES administrators (id)
);

-- Pinned reports junction table
CREATE TABLE pinned_reports (
    user_id INTEGER REFERENCES users (id) ON DELETE CASCADE,
    report_id INTEGER REFERENCES reports (id) ON DELETE CASCADE,
    pinned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, report_id)
);

-- Admin codes for user promotion
CREATE TABLE admin_codes (
    code VARCHAR PRIMARY KEY,
    department VARCHAR NOT NULL CHECK (
        department IN ('DTOP', 'LUMA', 'AAA', 'DDS')
    )
);

-- Create indexes for better performance
CREATE INDEX idx_users_email ON users (email);

CREATE INDEX idx_users_admin ON users (ADMIN);

CREATE INDEX idx_reports_status ON reports (status);

CREATE INDEX idx_reports_category ON reports (category);

CREATE INDEX idx_reports_created_by ON reports (created_by);

CREATE INDEX idx_reports_created_at ON reports (created_at);

CREATE INDEX idx_administrators_department ON administrators (department);

CREATE INDEX idx_pinned_reports_user_id ON pinned_reports (user_id);

CREATE INDEX idx_pinned_reports_report_id ON pinned_reports (report_id);

-- Insert admin codes for user promotion
INSERT INTO
    admin_codes (code, department)
VALUES ('DTOP123', 'DTOP'),
    ('LUMA456', 'LUMA'),
    ('AAA789', 'AAA'),
    ('DDS012', 'DDS');

-- Insert 50 users from Puerto Rico
INSERT INTO
    users (
        email,
        PASSWORD,
        ADMIN,
        suspended,
        pinned
    )
VALUES (
        'juan.martinez@example.com',
        'password123',
        FALSE,
        FALSE,
        FALSE
    ),
    (
        'maria.garcia@example.com',
        'password123',
        FALSE,
        FALSE,
        FALSE
    ),
    (
        'carlos.rodriguez@example.com',
        'password123',
        FALSE,
        FALSE,
        FALSE
    ),
    (
        'ana.hernandez@example.com',
        'password123',
        FALSE,
        FALSE,
        FALSE
    ),
    (
        'jose.lopez@example.com',
        'password123',
        FALSE,
        FALSE,
        FALSE
    ),
    (
        'laura.gonzalez@example.com',
        'password123',
        FALSE,
        FALSE,
        FALSE
    ),
    (
        'miguel.perez@example.com',
        'password123',
        FALSE,
        FALSE,
        FALSE
    ),
    (
        'isabel.torres@example.com',
        'password123',
        FALSE,
        FALSE,
        FALSE
    ),
    (
        'rafael.diaz@example.com',
        'password123',
        FALSE,
        FALSE,
        FALSE
    ),
    (
        'elena.ramirez@example.com',
        'password123',
        FALSE,
        FALSE,
        FALSE
    ),
    (
        'pedro.cruz@example.com',
        'password123',
        FALSE,
        FALSE,
        FALSE
    ),
    (
        'carmen.reyes@example.com',
        'password123',
        FALSE,
        FALSE,
        FALSE
    ),
    (
        'antonio.morales@example.com',
        'password123',
        FALSE,
        FALSE,
        FALSE
    ),
    (
        'patricia.ortiz@example.com',
        'password123',
        FALSE,
        FALSE,
        FALSE
    ),
    (
        'roberto.vargas@example.com',
        'password123',
        FALSE,
        FALSE,
        FALSE
    ),
    (
        'sandra.mendoza@example.com',
        'password123',
        FALSE,
        FALSE,
        FALSE
    ),
    (
        'fernando.guzman@example.com',
        'password123',
        FALSE,
        FALSE,
        FALSE
    ),
    (
        'gloria.santos@example.com',
        'password123',
        FALSE,
        FALSE,
        FALSE
    ),
    (
        'ricardo.castro@example.com',
        'password123',
        FALSE,
        FALSE,
        FALSE
    ),
    (
        'vanessa.rivera@example.com',
        'password123',
        FALSE,
        FALSE,
        FALSE
    ),
    (
        'oscar.mendez@example.com',
        'password123',
        FALSE,
        FALSE,
        FALSE
    ),
    (
        'adriana.medina@example.com',
        'password123',
        FALSE,
        FALSE,
        FALSE
    ),
    (
        'manuel.aguilar@example.com',
        'password123',
        FALSE,
        FALSE,
        FALSE
    ),
    (
        'luz.figueroa@example.com',
        'password123',
        FALSE,
        FALSE,
        FALSE
    ),
    (
        'victor.rosario@example.com',
        'password123',
        FALSE,
        FALSE,
        FALSE
    ),
    (
        'diana.santiago@example.com',
        'password123',
        FALSE,
        FALSE,
        FALSE
    ),
    (
        'alejandro.delgado@example.com',
        'password123',
        FALSE,
        FALSE,
        FALSE
    ),
    (
        'monica.nazario@example.com',
        'password123',
        FALSE,
        FALSE,
        FALSE
    ),
    (
        'eduardo.vega@example.com',
        'password123',
        FALSE,
        FALSE,
        FALSE
    ),
    (
        'irene.colon@example.com',
        'password123',
        FALSE,
        FALSE,
        FALSE
    ),
    (
        'raul.serrano@example.com',
        'password123',
        FALSE,
        FALSE,
        FALSE
    ),
    (
        'teresa.miranda@example.com',
        'password123',
        FALSE,
        FALSE,
        FALSE
    ),
    (
        'hugo.rojas@example.com',
        'password123',
        FALSE,
        FALSE,
        FALSE
    ),
    (
        'nancy.suarez@example.com',
        'password123',
        FALSE,
        FALSE,
        FALSE
    ),
    (
        'gilberto.acosta@example.com',
        'password123',
        FALSE,
        FALSE,
        FALSE
    ),
    (
        'rebeca.padilla@example.com',
        'password123',
        FALSE,
        FALSE,
        FALSE
    ),
    (
        'ernesto.maldonado@example.com',
        'password123',
        FALSE,
        FALSE,
        FALSE
    ),
    (
        'olga.cordero@example.com',
        'password123',
        FALSE,
        FALSE,
        FALSE
    ),
    (
        'arturo.camacho@example.com',
        'password123',
        FALSE,
        FALSE,
        FALSE
    ),
    (
        'lourdes.burgos@example.com',
        'password123',
        FALSE,
        FALSE,
        FALSE
    ),
    (
        'gerardo.quiles@example.com',
        'password123',
        FALSE,
        FALSE,
        FALSE
    ),
    (
        'margarita.pabon@example.com',
        'password123',
        FALSE,
        FALSE,
        FALSE
    ),
    (
        'sergio.zayas@example.com',
        'password123',
        FALSE,
        FALSE,
        FALSE
    ),
    (
        'celeste.betancourt@example.com',
        'password123',
        FALSE,
        FALSE,
        FALSE
    ),
    (
        'felipe.carrion@example.com',
        'password123',
        FALSE,
        FALSE,
        FALSE
    ),
    (
        'roxana.arroyo@example.com',
        'password123',
        FALSE,
        FALSE,
        FALSE
    ),
    (
        'rodolfo.valentin@example.com',
        'password123',
        FALSE,
        FALSE,
        FALSE
    ),
    (
        'yvonne.caban@example.com',
        'password123',
        FALSE,
        FALSE,
        FALSE
    ),
    (
        'esteban.collazo@example.com',
        'password123',
        FALSE,
        FALSE,
        FALSE
    ),
    (
        'noemi.negron@example.com',
        'password123',
        FALSE,
        FALSE,
        FALSE
    );

-- Make users 1-5 administrators
UPDATE users SET ADMIN = TRUE WHERE id IN (1, 2, 3, 4, 5);

-- Insert administrators
INSERT INTO
    administrators (id, department)
VALUES (1, 'DTOP'),
    (2, 'LUMA'),
    (3, 'AAA'),
    (4, 'DDS'),
    (5, 'DTOP');

-- Insert department admins
INSERT INTO
    department_admins (department, admin_id)
VALUES ('DTOP', 1),
    ('LUMA', 2),
    ('AAA', 3),
    ('DDS', 4);

-- Insert locations around Puerto Rico with addresses
INSERT INTO
    location (
        latitude,
        longitude,
        address,
        city,
        country
    )
VALUES (
        18.4655,
        -66.1057,
        'Avenida Ponce de León',
        'San Juan',
        'Puerto Rico'
    ),
    (
        18.3985,
        -66.0610,
        'Avenida Roosevelt',
        'San Juan',
        'Puerto Rico'
    ),
    (
        18.4401,
        -66.1286,
        'Calle De Diego',
        'San Juan',
        'Puerto Rico'
    ),
    (
        18.4834,
        -66.1328,
        'Calle Loíza',
        'San Juan',
        'Puerto Rico'
    ),
    (
        18.4105,
        -66.0505,
        'Avenida Fernández Juncos',
        'San Juan',
        'Puerto Rico'
    ),
    (
        18.3980,
        -66.1557,
        'Carretera PR-2',
        'Bayamón',
        'Puerto Rico'
    ),
    (
        18.3794,
        -66.1630,
        'Avenida Central',
        'Bayamón',
        'Puerto Rico'
    ),
    (
        18.4202,
        -66.1660,
        'Calle Cuesta',
        'Bayamón',
        'Puerto Rico'
    ),
    (
        18.3801,
        -65.9574,
        'Avenida Isla Verde',
        'Carolina',
        'Puerto Rico'
    ),
    (
        18.4059,
        -65.9799,
        'Avenida Campo Rico',
        'Carolina',
        'Puerto Rico'
    ),
    (
        18.0111,
        -66.6141,
        'Plaza del Mercado',
        'Ponce',
        'Puerto Rico'
    ),
    (
        17.9985,
        -66.6250,
        'Avenida Las Américas',
        'Ponce',
        'Puerto Rico'
    ),
    (
        18.0250,
        -66.6030,
        'Calle Cristina',
        'Ponce',
        'Puerto Rico'
    ),
    (
        18.2380,
        -66.0320,
        'Carretera PR-1',
        'Caguas',
        'Puerto Rico'
    ),
    (
        18.2319,
        -66.0450,
        'Plaza Degetau',
        'Caguas',
        'Puerto Rico'
    ),
    (
        18.2011,
        -67.1396,
        'Avenida Hostos',
        'Mayagüez',
        'Puerto Rico'
    ),
    (
        18.2145,
        -67.1450,
        'Plaza Colón',
        'Mayagüez',
        'Puerto Rico'
    ),
    (
        18.4724,
        -66.7157,
        'Carretera PR-2',
        'Arecibo',
        'Puerto Rico'
    ),
    (
        18.4550,
        -66.7300,
        'Plaza de Recreo',
        'Arecibo',
        'Puerto Rico'
    ),
    (
        18.3258,
        -65.6524,
        'Carretera PR-3',
        'Fajardo',
        'Puerto Rico'
    ),
    (
        18.3350,
        -65.6600,
        'Avenida Conquistador',
        'Fajardo',
        'Puerto Rico'
    ),
    (
        18.1498,
        -65.8272,
        'Plaza Pública',
        'Humacao',
        'Puerto Rico'
    ),
    (
        18.1400,
        -65.8200,
        'Avenida Boulevard',
        'Humacao',
        'Puerto Rico'
    ),
    (
        18.0784,
        -66.9605,
        'Carretera PR-52',
        'Juana Díaz',
        'Puerto Rico'
    ),
    (
        18.0622,
        -67.1497,
        'Avenida Los Patriotas',
        'Cabo Rojo',
        'Puerto Rico'
    );

-- Insert reports with realistic Puerto Rico issues
INSERT INTO
    reports (
        title,
        description,
        status,
        category,
        created_by,
        validated_by,
        resolved_by,
        location,
        image_url,
        rating,
        created_at,
        resolved_at
    )
VALUES (
        'Pothole on Main Street',
        'Large pothole on the main street of Santurce that is damaging vehicles',
        'open',
        'pothole',
        6,
        NULL,
        NULL,
        1,
        NULL,
        NULL,
        '2024-01-15 08:30:00',
        NULL
    ),
    (
        'Fallen Light Pole',
        'Light pole fallen on Roosevelt Avenue after the storm',
        'in_progress',
        'street_light',
        7,
        2,
        NULL,
        2,
        NULL,
        NULL,
        '2024-01-16 14:20:00',
        NULL
    ),
    (
        'Traffic Light Not Working',
        'Traffic light at De Diego and Ponce de León intersection not working',
        'resolved',
        'traffic_signal',
        8,
        3,
        3,
        3,
        NULL,
        4,
        '2024-01-10 09:15:00',
        '2024-01-18 16:45:00'
    ),
    (
        'Water Leak in Pipe',
        'Constant water leak in AAA pipe in Hato Rey',
        'open',
        'sanitation',
        9,
        NULL,
        NULL,
        4,
        NULL,
        NULL,
        '2024-01-17 11:00:00',
        NULL
    ),
    (
        'Accumulated Trash',
        'Trash accumulation for more than a week in urbanization',
        'in_progress',
        'sanitation',
        10,
        4,
        NULL,
        5,
        NULL,
        NULL,
        '2024-01-14 16:45:00',
        NULL
    ),
    (
        'Flooded Street',
        'Street floods with every rain in Bayamón',
        'open',
        'road_damage',
        11,
        NULL,
        NULL,
        6,
        NULL,
        NULL,
        '2024-01-18 07:30:00',
        NULL
    ),
    (
        'Clogged Sewer',
        'Clogged sewer causing water stagnation',
        'resolved',
        'sanitation',
        12,
        1,
        1,
        7,
        NULL,
        5,
        '2024-01-05 13:20:00',
        '2024-01-12 10:15:00'
    ),
    (
        'Flickering Light',
        'Public street light flickering all night',
        'open',
        'street_light',
        13,
        NULL,
        NULL,
        8,
        NULL,
        NULL,
        '2024-01-19 20:00:00',
        NULL
    ),
    (
        'Damaged Traffic Sign',
        'Vandalized stop sign in Carolina',
        'in_progress',
        'traffic_signal',
        14,
        5,
        NULL,
        9,
        NULL,
        NULL,
        '2024-01-13 15:30:00',
        NULL
    ),
    (
        'Multiple Potholes',
        'Multiple potholes on Caguas highway',
        'open',
        'pothole',
        15,
        NULL,
        NULL,
        10,
        NULL,
        NULL,
        '2024-01-20 09:45:00',
        NULL
    ),
    (
        'Delayed Trash Collection',
        'Trash collection delayed by 3 days',
        'resolved',
        'sanitation',
        16,
        2,
        2,
        11,
        NULL,
        3,
        '2024-01-08 10:00:00',
        '2024-01-15 14:00:00'
    ),
    (
        'Dangerous Pole',
        'Electric pole leaning dangerously',
        'open',
        'street_light',
        17,
        NULL,
        NULL,
        12,
        NULL,
        NULL,
        '2024-01-21 12:15:00',
        NULL
    ),
    (
        'Misconfigured Traffic Light',
        'Traffic light timing misconfigured causing traffic',
        'in_progress',
        'traffic_signal',
        18,
        3,
        NULL,
        13,
        NULL,
        NULL,
        '2024-01-16 08:00:00',
        NULL
    ),
    (
        'Obstructed Ditch',
        'Ditch obstructed with debris in Ponce',
        'open',
        'road_damage',
        19,
        NULL,
        NULL,
        14,
        NULL,
        NULL,
        '2024-01-22 14:30:00',
        NULL
    ),
    (
        'Neglected Recreation Area',
        'Children''s park with trash and damaged equipment',
        'resolved',
        'other',
        20,
        4,
        4,
        15,
        NULL,
        4,
        '2024-01-07 16:20:00',
        '2024-01-14 11:30:00'
    ),
    (
        'Leaking Fire Hydrant',
        'Fire hydrant with constant leak wasting water',
        'open',
        'sanitation',
        21,
        NULL,
        NULL,
        16,
        NULL,
        NULL,
        '2024-01-23 10:45:00',
        NULL
    ),
    (
        'Insufficient Night Lighting',
        'Dark area due to lack of public lighting',
        'in_progress',
        'street_light',
        22,
        5,
        NULL,
        17,
        NULL,
        NULL,
        '2024-01-17 18:30:00',
        NULL
    ),
    (
        'Missing Signage',
        'Missing signage on dangerous curve',
        'open',
        'traffic_signal',
        23,
        NULL,
        NULL,
        18,
        NULL,
        NULL,
        '2024-01-24 07:15:00',
        NULL
    ),
    (
        'Slippery Pavement',
        'Slippery pavement after rains',
        'resolved',
        'road_damage',
        24,
        1,
        1,
        19,
        NULL,
        5,
        '2024-01-09 12:00:00',
        '2024-01-16 15:45:00'
    ),
    (
        'Broken Trash Container',
        'Public trash container vandalized',
        'open',
        'sanitation',
        25,
        NULL,
        NULL,
        20,
        NULL,
        NULL,
        '2024-01-25 13:20:00',
        NULL
    ),
    (
        'Loose Wiring',
        'Loose and dangerous electrical wiring',
        'denied',
        'street_light',
        26,
        2,
        NULL,
        21,
        NULL,
        NULL,
        '2024-01-11 09:30:00',
        NULL
    ),
    (
        'Dangerous Intersection',
        'Intersection without traffic light in school area',
        'open',
        'traffic_signal',
        27,
        NULL,
        NULL,
        22,
        NULL,
        NULL,
        '2024-01-26 15:00:00',
        NULL
    ),
    (
        'Insufficient Drainage',
        'Drainage system insufficient for heavy rains',
        'in_progress',
        'road_damage',
        28,
        3,
        NULL,
        23,
        NULL,
        NULL,
        '2024-01-18 11:45:00',
        NULL
    ),
    (
        'Debris on Public Road',
        'Construction debris on public sidewalk',
        'resolved',
        'other',
        29,
        4,
        4,
        24,
        NULL,
        4,
        '2024-01-06 14:10:00',
        '2024-01-13 09:20:00'
    ),
    (
        'Lack of Lot Maintenance',
        'Vacant lot with high weeds and mosquito breeding grounds',
        'open',
        'sanitation',
        30,
        NULL,
        NULL,
        25,
        NULL,
        NULL,
        '2024-01-27 08:30:00',
        NULL
    );

-- Insert mock data into pinned_reports table
INSERT INTO
    pinned_reports (user_id, report_id, pinned_at)
VALUES (1, 3, '2024-01-19 09:00:00'),
    (1, 7, '2024-01-13 14:30:00'),
    (1, 11, '2024-01-16 11:15:00'),
    (2, 2, '2024-01-17 10:45:00'),
    (2, 8, '2024-01-20 16:20:00'),
    (2, 12, '2024-01-22 08:30:00'),
    (2, 17, '2024-01-18 13:15:00'),
    (3, 4, '2024-01-18 09:45:00'),
    (3, 16, '2024-01-24 12:00:00'),
    (3, 25, '2024-01-28 10:30:00'),
    (4, 5, '2024-01-15 15:30:00'),
    (4, 15, '2024-01-21 14:15:00'),
    (4, 24, '2024-01-26 11:45:00'),
    (6, 1, '2024-01-16 08:45:00'),
    (6, 10, '2024-01-21 10:30:00'),
    (7, 2, '2024-01-17 12:15:00'),
    (7, 13, '2024-01-23 09:20:00'),
    (8, 3, '2024-01-19 14:00:00'),
    (8, 19, '2024-01-25 16:45:00'),
    (10, 14, '2024-01-24 10:00:00');