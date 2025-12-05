"""
Settings module - imports appropriate settings based on environment.

Set DJANGO_ENV environment variable to control which settings are loaded:
- development (default)
- production
- testing
"""
import os

environment = os.getenv('DJANGO_ENV', 'development')

if environment == 'production':
    from .production import *
elif environment == 'testing':
    from .testing import *
else:
    from .development import *

# Log which settings are being used
import logging
logger = logging.getLogger(__name__)
logger.info(f"Using {environment} settings")