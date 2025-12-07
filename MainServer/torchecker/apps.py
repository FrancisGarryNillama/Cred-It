"""App configuration for torchecker"""
from django.apps import AppConfig


class TorcheckerConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'torchecker'
    verbose_name = 'TOR Checker'