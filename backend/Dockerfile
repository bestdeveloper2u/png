#############################################################################
######### DJANGO REST FRAMEWORK PRODUCTION DOCKERFILE CONFIGURATION #########
#############################################################################

# PYTHON 3.12 SLIM IMAGE
FROM python:3.12-slim

# PYTHON ENVIRONMENT VARIABLES
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1

# SET WORKING DIRECTORY INSIDE THE CONTAINER
WORKDIR /app

# INSTALL SYSTEM DEPENDENCIES
RUN apt-get update && apt-get install -y \
    gcc \
    python3-dev \
    libpq-dev \
    netcat-openbsd \
    curl \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# COPY REQUIREMENTS.TXT
COPY ./requirements.txt .

# INSTALL PYTHON DEPENDENCIES
RUN pip install --upgrade pip && \
    pip install -r requirements.txt

# ADDITIONAL PYTHON PACKAGES
RUN pip install \
    daphne \
    celery \
    django-celery-beat \
    redis

# COPY APPLICATION CODE
COPY . .

# COPY WAIT-FOR-DB.SH SCRIPT
COPY wait-for-db.sh /wait-for-db.sh
RUN chmod +x /wait-for-db.sh

# EXPOSE PORT 8000
EXPOSE 8000

# ADD HEALTHCHECK (check if app is responding, spoof public host header)
HEALTHCHECK --interval=30s --timeout=5s --retries=3 \
    CMD curl --fail -H "Host: staging.pngpoint.com" http://localhost:8000/ || exit 1

# START ASGI APP WITH DAPHNE SERVER
CMD ["daphne", "-p", "8000", "-b", "0.0.0.0", "app.asgi:application"]
