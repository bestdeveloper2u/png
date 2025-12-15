#########################################################
"""
Production settings configuration
"""
#########################################################
import os
from urllib.parse import urlparse
from app.settings.base import *

DEBUG = os.getenv("DEBUG", "False").lower() in ("true", "1", "yes")

def get_allowed_hosts():
    hosts = ['localhost', '127.0.0.1', '.replit.dev', '.replit.app', '.repl.co']
    frontend_domain = os.getenv('FRONTEND_DOMAIN', '')
    if frontend_domain:
        try:
            parsed = urlparse(frontend_domain)
            hostname = parsed.netloc or parsed.path
            hostname = hostname.split(':')[0]
            if hostname:
                hosts.append(hostname)
                hosts.append(f'www.{hostname}')
        except:
            pass
    replit_domain = os.getenv('REPLIT_DEV_DOMAIN', '')
    if replit_domain:
        hosts.append(replit_domain)
    additional_hosts = os.getenv('ALLOWED_HOSTS', '')
    if additional_hosts:
        hosts.extend([h.strip() for h in additional_hosts.split(',') if h.strip()])
    return list(set(hosts))

ALLOWED_HOSTS = get_allowed_hosts()

SECRET_KEY = os.getenv("DJANGO_SECRET_KEY")
if not SECRET_KEY:
    raise ValueError("DJANGO_SECRET_KEY environment variable must be set for production")


DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.postgresql",
        "NAME": os.getenv("PGDATABASE"),
        "USER": os.getenv("PGUSER"),
        "PASSWORD": os.getenv("PGPASSWORD"),
        "HOST": os.getenv("PGHOST"),
        "PORT": os.getenv("PGPORT", "5432"),
    }
}


def get_csrf_trusted_origins():
    origins = []
    frontend_domain = os.getenv('FRONTEND_DOMAIN', '')
    if frontend_domain:
        origins.append(frontend_domain.rstrip('/'))
        try:
            parsed = urlparse(frontend_domain)
            hostname = parsed.netloc or parsed.path
            hostname = hostname.split(':')[0]
            if hostname and not hostname.startswith('www.'):
                origins.append(f"{parsed.scheme}://www.{hostname}")
        except:
            pass
    replit_domain = os.getenv('REPLIT_DEV_DOMAIN', '')
    if replit_domain:
        origins.append(f"https://{replit_domain}")
    additional_origins = os.getenv('CSRF_TRUSTED_ORIGINS', '')
    if additional_origins:
        origins.extend([o.strip() for o in additional_origins.split(',') if o.strip()])
    return list(set(origins))

def get_cors_allowed_origins():
    origins = []
    frontend_domain = os.getenv('FRONTEND_DOMAIN', '')
    if frontend_domain:
        origins.append(frontend_domain.rstrip('/'))
    replit_domain = os.getenv('REPLIT_DEV_DOMAIN', '')
    if replit_domain:
        origins.append(f"https://{replit_domain}")
    return list(set(origins))

CORS_ALLOWED_ORIGINS = get_cors_allowed_origins()

CSRF_TRUSTED_ORIGINS = get_csrf_trusted_origins()

APPEND_SLASH = True

CORS_ALLOWED_ORIGIN_REGEXES = [
    r"^https://.*\.replit\.dev$",
    r"^https://.*\.replit\.app$",
    r"^https://.*\.repl\.co$",
]

SECURE_BROWSER_XSS_FILTER = True
SECURE_CONTENT_TYPE_NOSNIFF = True
X_FRAME_OPTIONS = 'DENY'
SECURE_SSL_REDIRECT = not DEBUG
SESSION_COOKIE_SECURE = not DEBUG
CSRF_COOKIE_SECURE = not DEBUG
SECURE_HSTS_SECONDS = 31536000 if not DEBUG else 0
SECURE_HSTS_INCLUDE_SUBDOMAINS = not DEBUG
SECURE_HSTS_PRELOAD = not DEBUG

SESSION_COOKIE_HTTPONLY = True
CSRF_COOKIE_HTTPONLY = True
SESSION_COOKIE_SAMESITE = 'Lax'
CSRF_COOKIE_SAMESITE = 'Lax'

SECURE_REFERRER_POLICY = 'strict-origin-when-cross-origin'

SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')

USE_X_FORWARDED_HOST = True
USE_X_FORWARDED_PORT = True

SESSION_COOKIE_AGE = 86400
SESSION_EXPIRE_AT_BROWSER_CLOSE = True
SESSION_SAVE_EVERY_REQUEST = True

SIMPLE_JWT["SIGNING_KEY"] = SECRET_KEY
SIMPLE_JWT["AUTH_COOKIE_SECURE"] = True
SIMPLE_JWT["AUTH_COOKIE_SAMESITE"] = "Strict"

SILENCED_SYSTEM_CHECKS = []

REDIS_CACHE_URL = os.getenv('REDIS_CACHE_URL', '')
USE_REDIS = os.getenv('USE_REDIS', 'false').lower() in ('true', '1', 'yes')

if REDIS_CACHE_URL and USE_REDIS and not DEBUG:
    CACHES = {
        "default": {
            "BACKEND": "django_redis.cache.RedisCache",
            "LOCATION": REDIS_CACHE_URL,
            "TIMEOUT": 300,
            "OPTIONS": {
                "CLIENT_CLASS": "django_redis.client.DefaultClient",
            },
            "KEY_PREFIX": "pngpoint",
        }
    }
    REST_FRAMEWORK['DEFAULT_THROTTLE_RATES'] = {
        'anon': '30/minute',
        'user': '300/minute',
        'burst': '30/second',
        'login': '30/minute',
        'register': '100/hour',
        'sustained': '300/hour',
        'public': '300/minute',
        'token_refresh': '100/minute',
        'upload': '500/hour',
    }
else:
    CACHES = {
        "default": {
            "BACKEND": "django.core.cache.backends.locmem.LocMemCache",
            "LOCATION": "unique-snowflake",
        }
    }

DDOS_MAX_REQUESTS = 60
DDOS_BLOCK_DURATION = 600
DDOS_SUSPICIOUS_THRESHOLD = 50
