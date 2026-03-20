-- schema.sql
-- Create the uploads table

CREATE TABLE IF NOT EXISTS uploads (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    filename VARCHAR(255) NOT NULL,
    filepath TEXT NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
