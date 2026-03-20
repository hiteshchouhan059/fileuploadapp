FROM python:3.9-slim

WORKDIR /app

# Copy requirements file to leverage Docker cache
COPY requirements.txt .

# Install dependencies, including psycopg2-binary
RUN pip install --no-cache-dir -r requirements.txt
# Ensure psycopg2-binary is installed for PostgreSQL connection in the container
RUN pip install --no-cache-dir psycopg2-binary

# Copy the FastAPI app code
COPY main.py .

# Create the storage directory in the container
RUN mkdir -p storage/uploaded_files

# Expose port 8000
EXPOSE 8000

# Start the application using Uvicorn
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
