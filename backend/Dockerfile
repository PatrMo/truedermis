# Backend Dockerfile
FROM python:3.9-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    libffi-dev \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements and install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the application
COPY . .

# Create directories for uploads and models (if not already in the repository)
RUN mkdir -p uploads model

# Expose the Flask port
EXPOSE 5000

# Command to run the application
CMD ["gunicorn", "--bind", "0.0.0.0:5000", "app:app"]