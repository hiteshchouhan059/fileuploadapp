import os
import shutil
from datetime import datetime
from typing import List

from fastapi import FastAPI, File, Form, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import psycopg2

app = FastAPI()

# Allow CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for simplicity in dev
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configuration for Storage
# Using absolute path relative to the backend folder
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
STORAGE_DIR = os.path.join(BASE_DIR, "storage", "uploaded_files")
os.makedirs(STORAGE_DIR, exist_ok=True)

# Database Configuration
# Using environment variables with fallbacks to defaults for local dev
DB_HOST = os.getenv("DB_HOST", "localhost")
DB_NAME = os.getenv("DB_NAME", "file_uploads")
DB_USER = os.getenv("DB_USER", "postgres")
DB_PASS = os.getenv("DB_PASS", "postgres")
DB_PORT = os.getenv("DB_PORT", "5432")

def get_db_connection():
    try:
        conn = psycopg2.connect(
            host=DB_HOST,
            database=DB_NAME,
            user=DB_USER,
            password=DB_PASS,
            port=DB_PORT
        )
        return conn
    except Exception as e:
        print(f"Database connection error: {e}")
        return None

@app.post("/upload")
async def upload_files(
    username: str = Form(...),
    files: List[UploadFile] = File(...)
):
    if not username:
        raise HTTPException(status_code=400, detail="Username is required")
        
    if not files or len(files) == 0:
        raise HTTPException(status_code=400, detail="No files provided")

    conn = get_db_connection()
    if conn is None:
        raise HTTPException(status_code=500, detail="Database connection failed")
        
    uploaded_records = []
    
    try:
        cursor = conn.cursor()
        
        for file in files:
            # Create a safe filename with timestamp to prevent overwriting
            timestamp_str = datetime.now().strftime("%Y%m%d_%H%M%S")
            # Replace spaces and special characters if needed, keep simple for now
            safe_filename = f"{timestamp_str}_{file.filename}"
            filepath = os.path.join(STORAGE_DIR, safe_filename)
            
            # Save file to disk
            with open(filepath, "wb") as buffer:
                shutil.copyfileobj(file.file, buffer)
                
            # Relative path to store in database
            relative_filepath = os.path.join("storage", "uploaded_files", safe_filename)
            
            # Insert into database
            cursor.execute(
                """
                INSERT INTO uploads (username, filename, filepath)
                VALUES (%s, %s, %s)
                RETURNING id, timestamp;
                """,
                (username, file.filename, relative_filepath)
            )
            
            result = cursor.fetchone()
            if result:
                record_id, timestamp = result
                uploaded_records.append({
                    "id": record_id,
                    "filename": file.filename,
                    "filepath": relative_filepath,
                    "timestamp": timestamp.isoformat()
                })
                
        conn.commit()
        cursor.close()
        
    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=500, detail=f"Upload failed: {str(e)}")
    finally:
        if conn:
            conn.close()
        
    return {
        "message": f"Successfully uploaded {len(uploaded_records)} files.",
        "username": username,
        "uploads": uploaded_records
    }

@app.get("/health")
def health_check():
    return {"status": "ok"}
