# Reporte Ciudadano

[![React Native](https://img.shields.io/badge/React_Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactnative.dev/) [![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://python.org/) [![Flask](https://img.shields.io/badge/Flask-000000?style=for-the-badge&logo=flask&logoColor=white)](https://flask.palletsprojects.com/) [![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/) [![Docker](https://img.shields.io/badge/Docker-2CA5E0?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/)

Mobile/Web app for reporting and viewing community issues in Puerto Rico. Built with React Native (Expo), Flask, PostgreSQL, and Docker.

## Table of Contents

- [Overview](#overview)
- [Key features](#key-features)
- [Quick Start](#quick-start)
- [Configuration](#configuration)
- [Project structure](#project-structure)
- [Development tips](#development-tips)
- [Contributing](#contributing)

## Overview

Reporte Ciudadano is a mobile/web application for submitting and tracking community issues in Puerto Rico. Citizens can create reports with photos, view and interact with a public feed, and follow the status of issues over time. Administrators review, approve, and update reports through an internal management interface.

## Key features

- Submit reports with a title, description, category, photo, and automatic location.
- Browse a public feed where users can search, filter, sort, pin, and rate reports.
- Track progress through the report statuses: open, in_progress, resolved, and denied.
- Receive notifications when your report is reviewed or updated.
- Administrators can review your reports, update their status, and manage user accounts.

## Quick Start

### Prerequisites

- Node.js (latest version)
- Python (latest version)
- Docker (if the app is still in it's local dev phase)
- Expo CLI (for mobile dev)
- PostgreSQL

1) Clone repository

    ```bash
    git clone https://github.com/your-username/reporte-ciudadano.git
    cd reporte-ciudadano
    ```

2) Backend (local dev)

    ```bash
    cd backend
    python -m venv venv
    # macOS / Linux
    source venv/bin/activate
    # Windows (PowerShell)
    venv\Scripts\Activate.ps1

    pip install -r requirements.txt
    cp .env.example .env
    # Edit .env with real values, then:
    flask run --port=5000
    ```

    Notes:

    - Use the `DATABASE_URL` env var to point to a local or containerized PostgreSQL.
    - Run database migrations (Alembic) if present: e.g. `flask db upgrade` (project-specific).

3) Frontend (Expo)

    ```bash
    cd frontend
    npm install
    # if needed
    npm install -g expo-cli
    npm start
    # then run on device/emulator:
    npm run android
    npm run ios
    ```

    Ensure API base URL in frontend runtime config points to backend (`EXPO_PUBLIC_API_URL` or similar).

4) Docker (recommended for full stack)

    From project root:

    ```bash
    docker-compose up -d --build
    ```

    For development compose file:

    ```bash
    docker-compose -f docker-compose.dev.yml up --build
    ```

    Troubleshooting: check container logs with `docker-compose logs -f`.

## Configuration

Example backend .env (copy from .env.example):

```text
DATABASE_URL=postgresql://user:password@db:5432/reporte_ciudadano
SECRET_KEY=your-secret-key
JWT_SECRET_KEY=your-jwt-secret
UPLOAD_FOLDER=./uploads
EXPO_PUBLIC_API_URL=http://localhost:5000
```

Frontend runtime config (example)

```javascript
export default {
  API_BASE_URL: process.env.EXPO_PUBLIC_API_URL || 'http://localhost:5000',
  // other runtime values
}
```

## Project structure

```text
reporte-ciudadano/
├── frontend/                 # React Native app (Expo)
│   ├── src/
│   │   ├── components/       # Reusable components
│   │   ├── screens/          # App screens
│   │   ├── navigation/       # Navigation config
│   │   └── services/         # API clients and services
│   └── package.json
├── backend/                  # Flask API
│   ├── app/
│   │   ├── models/           # Database models
│   │   ├── routes/           # API endpoints
│   │   └── utils/            # Utilities and helpers
│   ├── migrations/           # DB migrations (Alembic)
│   └── requirements.txt
├── docker-compose.yml
└── README.md
```

## Development tips

- Use environment-specific docker-compose files for different workflows.
- Keep uploads directory mounted in local development to persist images.
- Add automated tests and CI as project matures.

## Contributing

- Fork the repo, create a feature branch, submit PRs with clear descriptions.
- Follow existing code style and add tests for new behavior.
- Include migration files for DB changes.
