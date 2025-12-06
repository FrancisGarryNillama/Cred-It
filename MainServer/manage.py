#!/usr/bin/env python
"""Django's command-line utility for administrative tasks."""
import os
import sys


def main():
    """Run administrative tasks."""
    # Determine environment from environment variable
    environment = os.getenv('DJANGO_ENV', 'development')
    
    # Set appropriate settings module
    if environment == 'production':
        os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'AdminServer.settings.production')
    elif environment == 'testing':
        os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'AdminServer.settings.testing')
    else:
        os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'AdminServer.settings.development')
    
    try:
        from django.core.management import execute_from_command_line
    except ImportError as exc:
        raise ImportError(
            "Couldn't import Django. Are you sure it's installed and "
            "available on your PYTHONPATH environment variable? Did you "
            "forget to activate a virtual environment?"
        ) from exc
    
    # Print environment info
    if len(sys.argv) > 1 and sys.argv[1] == 'runserver':
        print(f"\n{'='*60}")
        print(f"Starting Django in {environment.upper()} mode")
        print(f"Settings: {os.environ.get('DJANGO_SETTINGS_MODULE')}")
        print(f"{'='*60}\n")
    
    execute_from_command_line(sys.argv)


if __name__ == '__main__':
    main()