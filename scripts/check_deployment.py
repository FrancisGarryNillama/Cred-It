"""
Pre-deployment checks script.
Run this before deploying to production.
"""
import os
import sys
import django

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'AdminServer.settings.production')
django.setup()

from django.core.management import call_command
from django.conf import settings


def check_environment():
    """Check environment variables"""
    print("\n" + "="*60)
    print("CHECKING ENVIRONMENT VARIABLES")
    print("="*60)
    
    required_vars = [
        'SECRET_KEY',
        'DB_NAME',
        'DB_USER',
        'DB_PASSWORD',
        'DB_HOST',
        'ALLOWED_HOSTS',
    ]
    
    missing = []
    for var in required_vars:
        if not os.getenv(var):
            missing.append(var)
            print(f"✗ {var}: MISSING")
        else:
            print(f"✓ {var}: Set")
    
    if missing:
        print(f"\n⚠ Missing required variables: {', '.join(missing)}")
        return False
    
    print("\n✓ All required environment variables are set")
    return True


def check_database():
    """Check database connection"""
    print("\n" + "="*60)
    print("CHECKING DATABASE CONNECTION")
    print("="*60)
    
    try:
        from django.db import connection
        connection.ensure_connection()
        print("✓ Database connection successful")
        return True
    except Exception as e:
        print(f"✗ Database connection failed: {e}")
        return False


def check_migrations():
    """Check for unapplied migrations"""
    print("\n" + "="*60)
    print("CHECKING MIGRATIONS")
    print("="*60)
    
    try:
        from io import StringIO
        output = StringIO()
        call_command('showmigrations', '--plan', stdout=output)
        
        if '[ ]' in output.getvalue():
            print("✗ There are unapplied migrations")
            print(output.getvalue())
            return False
        
        print("✓ All migrations are applied")
        return True
    except Exception as e:
        print(f"✗ Migration check failed: {e}")
        return False


def check_static_files():
    """Check static files collection"""
    print("\n" + "="*60)
    print("CHECKING STATIC FILES")
    print("="*60)
    
    static_root = settings.STATIC_ROOT
    
    if not os.path.exists(static_root):
        print(f"✗ STATIC_ROOT does not exist: {static_root}")
        return False
    
    if not os.listdir(static_root):
        print(f"⚠ STATIC_ROOT is empty. Run: python manage.py collectstatic")
        return False
    
    print(f"✓ Static files collected at: {static_root}")
    return True


def check_security():
    """Run Django security checks"""
    print("\n" + "="*60)
    print("RUNNING SECURITY CHECKS")
    print("="*60)
    
    try:
        call_command('check', '--deploy')
        print("\n✓ Security checks passed")
        return True
    except Exception as e:
        print(f"✗ Security checks failed: {e}")
        return False


def main():
    """Run all checks"""
    print("\n" + "="*60)
    print("PRE-DEPLOYMENT CHECKS")
    print("="*60)
    
    checks = [
        ("Environment Variables", check_environment),
        ("Database Connection", check_database),
        ("Migrations", check_migrations),
        ("Static Files", check_static_files),
        ("Security", check_security),
    ]
    
    results = []
    for name, check_func in checks:
        try:
            results.append(check_func())
        except Exception as e:
            print(f"\n✗ {name} check failed with error: {e}")
            results.append(False)
    
    # Summary
    print("\n" + "="*60)
    print("SUMMARY")
    print("="*60)
    
    passed = sum(results)
    total = len(results)
    
    print(f"\nPassed: {passed}/{total}")
    
    if all(results):
        print("\n✓ ALL CHECKS PASSED - Ready for deployment!")
        return 0
    else:
        print("\n✗ SOME CHECKS FAILED - Please fix issues before deploying")
        return 1


if __name__ == '__main__':
    sys.exit(main())