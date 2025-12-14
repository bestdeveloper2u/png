#!/bin/sh

echo "🚀 Starting Django migrations (SQLite)..."

python manage.py makemigrations
python manage.py migrate

echo "✅ Migrations done. Starting server..."

exec "$@"
