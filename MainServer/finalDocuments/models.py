from django.db import models
from django.utils import timezone

# Create your models here.
class listFinalTor(models.Model):
    STATUS_CHOICES = [
        ("Pending", "Pending"),
        ("Unknown", "Unknown"),
        ("Accepted", "Accepted"),
        ("Denied", "Denied"),
        ("Finalized", "Finalized"),
    ]

    accountID = models.CharField(max_length=100, verbose_name="Account ID")
    applicant_name = models.CharField(max_length=200, verbose_name="Name of Applicant")
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="Pending")
    request_date = models.DateTimeField(default=timezone.now, verbose_name="Date Requested")
    accepted_date = models.DateTimeField(null=True, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.applicant_name} ({self.accountID}) - {self.status}"
