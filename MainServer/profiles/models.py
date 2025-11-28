

# Create your models here.
from django.db import models

class Profile(models.Model):
    user_id = models.CharField(max_length=255, unique=True)
    name = models.CharField(max_length=255, blank=True, null=True)
    school_name = models.CharField(max_length=255, blank=True, null=True)
    email = models.EmailField(blank=True, null=True, unique=True)
    phone = models.CharField(max_length=20, blank=True, null=True)

    def __str__(self):
        return self.name or f"Profile {self.user_id}"