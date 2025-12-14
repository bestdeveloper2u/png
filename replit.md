# PNG Point API

## Overview
A Django REST API for managing PNG images with user authentication, categories, and Cloudflare integration.

## Project Structure
```
backend/
├── accounts/          # User authentication and management
├── api/               # REST API endpoints
│   ├── accounts/      # Account-related API views
│   ├── configuration/ # Configuration API views
│   └── images/        # Image management API views
├── app/               # Django project settings
│   └── settings/      # Environment-specific settings
├── configuration/     # Cloudflare config models
├── core/              # Shared utilities and permissions
├── images/            # Image models and services
└── media/             # Uploaded media files
```

## API Routes
- `GET /` - API welcome message
- `POST /api/v1/accounts/user/register/` - User registration
- `POST /api/v1/accounts/user/login/` - User login
- `POST /api/v1/accounts/admin/login/` - Admin login
- `GET /api/v1/images/categories/` - List categories
- `GET /api/v1/images/approved/` - List approved images
- `GET /api/v1/images/pending/` - List pending images
- `GET /api/v1/schema/swagger-ui/` - API documentation (Swagger)
- `GET /api/v1/schema/redoc/` - API documentation (ReDoc)
- `GET /admin/` - Django admin panel

## Admin Dashboard
- URL: `/admin/`
- Create an admin user: `cd backend && python manage.py createsuperuser`

## Environment Variables
Required:
- `DJANGO_SECRET_KEY` - Django secret key (set as secret)
- `DATABASE_URL` - PostgreSQL connection URL (auto-configured)
- `PGHOST`, `PGPORT`, `PGUSER`, `PGPASSWORD`, `PGDATABASE` - Database credentials

Optional:
- `DEBUG` - Enable debug mode (default: false)
- `FRONTEND_DOMAIN` - Frontend domain for CORS
- `EMAIL_HOST_USER`, `EMAIL_HOST_PASSWORD` - SMTP credentials

## Security Features
- JWT authentication with token refresh (Strict SameSite cookies)
- CORS configured for frontend domain (no hardcoded domains)
- CSRF protection enabled
- Secure cookies in production
- HTTPS enforcement (production)
- Password validation rules
- Session expiration after 24 hours
- Error messages do not expose internal details
- HSTS with preload enabled in production
- X-Frame-Options: DENY
- Content-Security-Policy headers

### DDoS & Rate Limiting Protection
- **DDoS Protection Middleware**: Automatic IP blocking after 60 requests/minute (production)
- **Request Size Limiting**: Max 25MB request body
- **Rate Limiting on all public endpoints**:
  - Anonymous: 30/minute (production)
  - Authenticated users: 300/minute (production)
  - Burst protection: 3/second
  - Login: 3/minute
  - Registration: 3/hour
  - Token refresh: 10/minute
  - Image upload: 20/hour
- **IP Blocking**: Suspicious IPs blocked for 10 minutes (production)
- **Debug endpoints disabled in production** (Swagger, ReDoc, Schema Viewer)

## Development
The app runs on port 5000 (Next.js frontend) and port 8000 (Django backend).

## Recent Changes
- Removed hardcoded domain (pngpoint.com) - all config now uses environment variables
- Added production rate limiting (60/min anon, 500/min users)
- Fixed error handlers to not expose internal error details
- Removed debug print statements
- Added session expiration and security improvements
- Added Strict SameSite for JWT cookies
- Added Django admin with full model registration
- Improved security settings (JWT, CORS, CSRF)
- Added Replit-specific allowed hosts
- Configured PostgreSQL database
- Applied all database migrations
- Added GZip compression middleware for Django
- Enhanced security headers in Next.js (X-Content-Type-Options, X-Frame-Options, X-XSS-Protection, Referrer-Policy)
- Added HTTPS proxy support for production
- Configured deployment settings for production (gunicorn + Next.js production build)
- Enabled React strict mode and disabled powered-by header

## Deployment
- **Target**: VM (always running)
- **Build**: `cd frontend && npm run build && cd ../backend && python manage.py collectstatic --noinput`
- **Run**: `gunicorn --bind=0.0.0.0:8000 --reuse-port --workers=2 app.wsgi:application & npm run start`

## Custom Domain Setup
To connect a custom domain:
1. Publish your app using the Publish button
2. Go to Deployments > Settings > Link a domain
3. Add DNS records (A and TXT) to your domain registrar
4. Wait for DNS propagation (up to 48 hours)
