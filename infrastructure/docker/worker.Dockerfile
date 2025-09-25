# Dockerfile for Celery Workers
# Optimized for background processing tasks

FROM python:3.13-slim

# Install system dependencies
RUN apt-get update && apt-get install -y \
    libpq5 \
    imagemagick \
    ghostscript \
    poppler-utils \
    tesseract-ocr \
    && rm -rf /var/lib/apt/lists/*

# Create non-root user
RUN useradd -m -u 1000 appuser

WORKDIR /app

# Copy requirements
COPY backend/requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY --chown=appuser:appuser backend/ .

# Switch to non-root user
USER appuser

# Environment variable to identify as worker
ENV IS_WORKER=true

# Run Celery worker
CMD ["celery", "-A", "workers.celery_app", "worker", "--loglevel=info", "--concurrency=4", "-Q", "default,ocr,translation"]