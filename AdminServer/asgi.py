"""
ASGI config for Credit System.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/stable/howto/deployment/asgi/
"""

import os
from django.core.asgi import get_asgi_application

# Set the settings module based on environment
environment = os.getenv('DJANGO_ENV', 'development')

if environment == 'production':
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'AdminServer.settings.production')
elif environment == 'testing':
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'AdminServer.settings.testing')
else:
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'AdminServer.settings.development')

application = get_asgi_application()