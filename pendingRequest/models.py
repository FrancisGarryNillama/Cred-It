"""
Models for pending request workflow stage.
"""
from django.db import models
from django.utils import timezone
from core.validators import validate_account_id


class PendingRequest(models.Model):
    """
    Pending request model - second stage of workflow.
    
    Requests under evaluation by department.
    """
    
    class Status(models.TextChoices):
        PENDING = 'Pending', 'Pending'
        ACCEPTED = 'Accepted', 'Accepted'
        DENIED = 'Denied', 'Denied'
    
    applicant_id = models.CharField(
        max_length=50,
        validators=[validate_account_id],
        db_index=True
    )
    applicant_name = models.CharField(max_length=255)
    status = models.CharField(
        max_length=50,
        choices=Status.choices,
        default=Status.PENDING,
        db_index=True
    )
    request_date = models.DateTimeField(default=timezone.now)
    accepted_date = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'pending_request'
        verbose_name = 'Pending Request'
        verbose_name_plural = 'Pending Requests'
        indexes = [
            models.Index(fields=['applicant_id']),
            models.Index(fields=['status']),
        ]
        ordering = ['-request_date']

    def __str__(self):
        return f"{self.applicant_id} - {self.applicant_name} ({self.status})"
