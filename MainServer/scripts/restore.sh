#!/bin/bash
set -e

if [ -z "$1" ]; then
    echo "Usage: $0 <backup_timestamp>"
    echo "Example: $0 20240115_143022"
    exit 1
fi

TIMESTAMP=$1
BACKUP_DIR="/var/backups/credit_system"

echo "Restoring from backup: $TIMESTAMP"

# Restore database
echo "Restoring database..."
gunzip -c "$BACKUP_DIR/db_$TIMESTAMP.sql.gz" | psql -U $DB_USER -h $DB_HOST $DB_NAME

# Restore media files
echo "Restoring media files..."
tar -xzf "$BACKUP_DIR/media_$TIMESTAMP.tar.gz" -C /var/www/credit_system

echo "Restore completed!"