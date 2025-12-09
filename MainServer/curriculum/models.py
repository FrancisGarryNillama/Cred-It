"""
Curriculum models with improved structure and validation.
"""
from django.db import models
from django.contrib.postgres.fields import ArrayField
from django.core.exceptions import ValidationError
from core.validators import (
    validate_account_id,
    validate_grade,
    validate_units,
    validate_subject_code
)


class CompareResultTOR(models.Model):
    """
    Comparison results between student TOR and institution curriculum.
    
    This model stores the results of comparing a student's transfer credits
    against the institution's curriculum requirements.
    """
    
    class CreditEvaluation(models.TextChoices):
        """Credit evaluation status choices"""
        ACCEPTED = 'Accepted', 'Accepted'
        DENIED = 'Denied', 'Denied'
        INVESTIGATE = 'Investigate', 'Investigate'
        VOID = 'Void', 'Void'  # Default/initial state
    
    account_id = models.CharField(
        max_length=100,
        validators=[validate_account_id],
        db_index=True,
        help_text='Student account identifier'
    )
    subject_code = models.CharField(
        max_length=50,
        db_index=True,
        help_text='Subject/course code'
    )
    subject_description = models.CharField(
        max_length=500,  # Increased from 255 for long subject names
        help_text='Full subject description'
    )
    total_academic_units = models.FloatField(
        validators=[validate_units],
        help_text='Number of academic units/credits'
    )
    final_grade = models.FloatField(
        validators=[validate_grade],
        help_text='Final grade received (1.0 - 5.0 scale)'
    )
    remarks = models.CharField(
        max_length=500,  # Increased from 255 for longer remarks
        blank=True,
        null=True,
        help_text='Grading remarks (PASSED/FAILED)'
    )
    summary = models.TextField(
        blank=True,
        null=True,
        help_text='Detailed comparison summary'
    )
    credit_evaluation = models.CharField(
        max_length=20,
        choices=CreditEvaluation.choices,
        default=CreditEvaluation.VOID,
        db_index=True,
        help_text='Final credit evaluation decision'
    )
    notes = models.TextField(
        blank=True,
        null=True,
        help_text='Additional notes from evaluator'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'compare_result_tor'
        verbose_name = 'TOR Comparison Result'
        verbose_name_plural = 'TOR Comparison Results'
        indexes = [
            models.Index(fields=['account_id', 'subject_code']),
            models.Index(fields=['credit_evaluation']),
            models.Index(fields=['created_at']),
        ]
        unique_together = [['account_id', 'subject_code']]
        ordering = ['account_id', 'subject_code']

    def __str__(self):
        return f"{self.account_id} - {self.subject_code}"

    def clean(self):
        """Validate model instance"""
        super().clean()
        
        # Ensure units and grade are positive
        if self.total_academic_units < 0:
            raise ValidationError({
                'total_academic_units': 'Units must be positive'
            })
        
        if self.final_grade < 0:
            raise ValidationError({
                'final_grade': 'Grade must be positive'
            })

    @property
    def is_accepted(self) -> bool:
        """Check if credit is accepted"""
        return self.credit_evaluation == self.CreditEvaluation.ACCEPTED

    @property
    def is_denied(self) -> bool:
        """Check if credit is denied"""
        return self.credit_evaluation == self.CreditEvaluation.DENIED

    @property
    def needs_investigation(self) -> bool:
        """Check if credit needs investigation"""
        return self.credit_evaluation == self.CreditEvaluation.INVESTIGATE

    @property
    def is_passing_grade(self) -> bool:
        """Check if grade is passing (using standard scale)"""
        return 1.0 <= self.final_grade <= 2.9


class CitTorContent(models.Model):
    """
    Institution curriculum content (CIT TOR).
    
    Stores the official curriculum requirements for the institution.
    """
    
    subject_code = models.CharField(
        max_length=30,
        unique=True,
        db_index=True,
        help_text='Official subject code'
    )
    prerequisite = ArrayField(
        models.CharField(max_length=30),
        blank=True,
        default=list,
        help_text='List of prerequisite subject codes'
    )
    description = ArrayField(
        models.TextField(),
        blank=True,
        default=list,
        help_text='List of subject description variations'
    )
    units = models.PositiveIntegerField(
        help_text='Required academic units'
    )
    is_active = models.BooleanField(
        default=True,
        help_text='Whether this subject is currently offered'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'cit_tor_content'
        verbose_name = 'CIT TOR Content'
        verbose_name_plural = 'CIT TOR Contents'
        ordering = ['subject_code']

    def __str__(self):
        return f"{self.subject_code} ({self.units} units)"

    def clean(self):
        """Validate model instance"""
        super().clean()
        
        if self.units < 1:
            raise ValidationError({
                'units': 'Units must be at least 1'
            })

    @property
    def has_prerequisites(self) -> bool:
        """Check if subject has prerequisites"""
        return len(self.prerequisite) > 0

    @property
    def description_text(self) -> str:
        """Get combined description text"""
        return " | ".join(self.description) if self.description else ""