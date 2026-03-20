# Full-Stack File Upload Application

A simple full-stack web application that allows users to enter their username and upload multiple files using a drag-and-drop interface.

## Prerequisites
- Python 3.8+
- Node.js (Optional, if you wish to use a different frontend server like `http-server`)
- PostgreSQL

## Database Setup
1. Ensure PostgreSQL is installed and running.
2. Create a database, e.g., `file_uploads`.
3. Run the SQL schema to create the table:
   ```bash
   psql -U your_postgres_user -d file_uploads -f database/schema.sql
   ```

## Backend Setup (FastAPI)
1. Navigate to the `backend` directory:
   ```bash
   cd backend
   ```
2. Create and activate a virtual environment (recommended):
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Set your database credentials as environment variables or update the hardcoded defaults in `main.py`. The defaults try to connect to `postgresql://postgres:postgres@localhost/file_uploads`.
5. Run the FastAPI server:
   ```bash
   uvicorn main:app --reload
   ```
   The backend will start at `http://127.0.0.1:8000`.

## Frontend Setup
1. Navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```
2. Serve the static files using a simple HTTP server (Python):
   ```bash
   python -m http.server 3000
   ```
3. Open a browser and navigate to `http://localhost:3000`.

## Features
- **Frontend**: Clean HTML, CSS, and Vanilla JS UI featuring a drag-and-drop zone, file selection dialog, list of selected files, and smooth upload handling.
- **Backend**: FastAPI app handling multipart form data (username + multiple files), saving files to the local `storage/` directory, and tracking metadata in PostgreSQL.
