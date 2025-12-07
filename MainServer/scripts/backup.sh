#!/bin/bash
set -e

# Configuration
BACKUP_DIR="/var/backups/credit_system"
DB_NAME=${DB_NAME:-"credit_system"}
DB_USER=${DB_USER:-"postgres"}
DB_HOST=${DB_HOST:-"localhost"}
RETENTION_DAYS=30

# Create backup directory
mkdir -p $BACKUP_DIR

# Generate timestamp
TIMESTAMP=$(date +%Y%m%d_%H%M%S)

# Database backup
echo "Backing up database..."
pg_dump -U $DB_USER -h $DB_HOST $DB_NAME | gzip > "$BACKUP_DIR/db_$TIMESTAMP.sql.gz"

# Media files backup
echo "Backing up media files..."
tar -czf "$BACKUP_DIR/media_$TIMESTAMP.tar.gz" -C /var/www/credit_system media/

# Application code backup
echo "Backing up application code..."
tar -czf "$BACKUP_DIR/code_$TIMESTAMP.tar.gz" \
    --exclude='venv' \
    --exclude='*.pyc' \
    --exclude='__pycache__' \
    --exclude='.git' \
    -C /var/www credit_system/

# Cleanup old backups
echo "Cleaning up old backups..."
find $BACKUP_DIR -name "*.gz" -mtime +$RETENTION_DAYS -delete

echo "Backup completed: $TIMESTAMP"
