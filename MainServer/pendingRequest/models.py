from django.db import models
from django.utils import timezone

class PendingRequest(models.Model):
    applicant_id = models.CharField(max_length=50)
    applicant_name = models.CharField(max_length=255)
    status = models.CharField(max_length=50, default="Pending")
    request_date = models.DateTimeField(default=timezone.now)
    accepted_date = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return f"{self.applicant_id} - {self.applicant_name} ({self.status})"
