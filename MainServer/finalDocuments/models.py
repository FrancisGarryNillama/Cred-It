"""
Models for final documents workflow stage.
"""
from django.db import models
from django.utils import timezone
from core.validators import validate_account_id


class listFinalTor(models.Model):
    """
    Final TOR documents model - last stage of workflow.
    
    Approved and finalized requests.
    """
    
    class Status(models.TextChoices):
        PENDING = 'Pending', 'Pending'
        UNKNOWN = 'Unknown', 'Unknown'
        ACCEPTED = 'Accepted', 'Accepted'
        DENIED = 'Denied', 'Denied'
        FINALIZED = 'Finalized', 'Finalized'
    
    accountID = models.CharField(
        max_length=100,
        validators=[validate_account_id],
        db_index=True,
        verbose_name='Account ID'
    )
    applicant_name = models.CharField(
        max_length=200,
        verbose_name='Name of Applicant'
    )
    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.PENDING,
        db_index=True
    )
    request_date = models.DateTimeField(
        default=timezone.now,
        verbose_name='Date Requested'
    )
    accepted_date = models.DateTimeField(
        null=True,
        blank=True,
        verbose_name='Date Accepted'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'list_final_tor'
        verbose_name = 'Final TOR'
        verbose_name_plural = 'Final TORs'
        indexes = [
            models.Index(fields=['accountID']),
            models.Index(fields=['status']),
        ]
        ordering = ['-accepted_date']

    def __str__(self):
        return f"{self.applicant_name} ({self.accountID}) - {self.status}"