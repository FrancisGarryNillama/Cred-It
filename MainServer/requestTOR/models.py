from django.db import models
from django.utils import timezone

class RequestTOR(models.Model):
    STATUS_CHOICES = [
        ("Pending", "Pending"),
        ("Unknown", "Unknown"),
        ("Accepted", "Accepted"),
        ("Denied", "Denied"),
    ]

    accountID = models.CharField(max_length=100, verbose_name="Account ID")
    applicant_name = models.CharField(max_length=200, verbose_name="Name of Applicant")
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="Pending")
    request_date = models.DateTimeField(default=timezone.now, verbose_name="Date Requested")

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.applicant_name} ({self.accountID}) - {self.status}"

