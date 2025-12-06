#!/bin/bash
set -e

echo "🚀 Starting deployment..."

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Configuration
PROJECT_DIR="/var/www/credit_system"
VENV_DIR="$PROJECT_DIR/venv"
BACKUP_DIR="$PROJECT_DIR/backups"

# Functions
error_exit() {
    echo -e "${RED}❌ Error: $1${NC}" >&2
    exit 1
}

success_msg() {
    echo -e "${GREEN}✓ $1${NC}"
}

# Check if running as correct user
if [ "$EUID" -eq 0 ]; then 
    error_exit "Please do not run as root"
fi

# Navigate to project directory
cd $PROJECT_DIR || error_exit "Project directory not found"

# Create backup directory
mkdir -p $BACKUP_DIR

# Step 1: Create database backup
echo "📦 Creating database backup..."
BACKUP_FILE="$BACKUP_DIR/db_backup_$(date +%Y%m%d_%H%M%S).sql"
pg_dump -U $DB_USER -h $DB_HOST $DB_NAME > $BACKUP_FILE || error_exit "Database backup failed"
success_msg "Database backup created: $BACKUP_FILE"

# Step 2: Pull latest code
echo "📥 Pulling latest code..."
git fetch origin
git pull origin main || error_exit "Git pull failed"
success_msg "Code updated"

# Step 3: Activate virtual environment
echo "🔧 Activating virtual environment..."
source $VENV_DIR/bin/activate || error_exit "Virtual environment activation failed"
success_msg "Virtual environment activated"

# Step 4: Install/update dependencies
echo "📦 Installing dependencies..."
pip install --upgrade pip
pip install -r requirements.txt || error_exit "Dependency installation failed"
success_msg "Dependencies installed"

# Step 5: Run migrations
echo "🗄️  Running migrations..."
python manage.py migrate --noinput || error_exit "Migrations failed"
success_msg "Migrations completed"

# Step 6: Collect static files
echo "📁 Collecting static files..."
python manage.py collectstatic --noinput || error_exit "Static collection failed"
success_msg "Static files collected"

# Step 7: Run tests (optional)
if [ "$RUN_TESTS" = "true" ]; then
    echo "🧪 Running tests..."
    pytest || error_exit "Tests failed"
    success_msg "Tests passed"
fi

# Step 8: Restart services
echo "🔄 Restarting services..."
sudo systemctl restart gunicorn || error_exit "Gunicorn restart failed"
sudo systemctl restart nginx || error_exit "Nginx restart failed"
success_msg "Services restarted"

# Step 9: Health check
echo "🏥 Running health check..."
sleep 5
HEALTH_CHECK=$(curl -s -o /dev/null -w "%{http_code}" http://localhost/health/)
if [ "$HEALTH_CHECK" = "200" ]; then
    success_msg "Health check passed"
else
    error_exit "Health check failed (HTTP $HEALTH_CHECK)"
fi

# Step 10: Cleanup old backups (keep last 7 days)
echo "🧹 Cleaning old backups..."
find $BACKUP_DIR -name "db_backup_*.sql" -mtime +7 -delete
success_msg "Old backups cleaned"

echo ""
echo -e "${GREEN}✅ Deployment completed successfully!${NC}"
echo ""