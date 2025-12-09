"""
User profile models with improved validation and structure.
"""
from django.db import models
from django.core.exceptions import ValidationError
from core.validators import validate_account_id, validate_phone_number
import re


class Profile(models.Model):
    """
    User profile model for students.
    
    Stores additional information about users beyond authentication.
    One profile per user account.
    """
    
    user_id = models.CharField(
        max_length=255,
        unique=True,
        db_index=True,
        validators=[validate_account_id],
        help_text='Unique user identifier (links to CreditAccount)'
    )
    name = models.CharField(
        max_length=255,
        blank=True,
        null=True,
        help_text='Full name of the user'
    )
    school_name = models.CharField(
        max_length=255,
        blank=True,
        null=True,
        help_text='Previous school/institution name'
    )
    email = models.EmailField(
        blank=True,
        null=True,
        help_text='Contact email address'
    )
    phone = models.CharField(
        max_length=20,
        blank=True,
        null=True,
        help_text='Contact phone number'
    )
    
    # Additional fields
    address = models.TextField(
        blank=True,
        null=True,
        help_text='Full address'
    )
    date_of_birth = models.DateField(
        blank=True,
        null=True,
        help_text='Date of birth'
    )
    
    # Metadata
    is_complete = models.BooleanField(
        default=False,
        help_text='Whether profile is complete'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'user_profile'
        verbose_name = 'User Profile'
        verbose_name_plural = 'User Profiles'
        indexes = [
            models.Index(fields=['user_id']),
            models.Index(fields=['email']),
            models.Index(fields=['is_complete']),
        ]
        ordering = ['-created_at']

    def __str__(self):
        return self.name or f"Profile {self.user_id}"

    def clean(self):
        """Validate the model instance"""
        super().clean()
        
        # Validate email format if provided
        if self.email:
            email_pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
            if not re.match(email_pattern, self.email):
                raise ValidationError({
                    'email': 'Invalid email format'
                })
        
        # Validate phone if provided (and not empty string)
        if self.phone and self.phone.strip():
            try:
                validate_phone_number(self.phone)
            except ValidationError as e:
                raise ValidationError({'phone': e.messages if hasattr(e, 'messages') else str(e)})

    def save(self, *args, **kwargs):
        """Override save to check completeness and run validation"""
        self.full_clean()
        self.check_completeness()
        super().save(*args, **kwargs)

    def check_completeness(self):
        """Check if profile has all required information"""
        required_fields = ['name', 'school_name', 'email', 'phone']
        self.is_complete = all(
            getattr(self, field) for field in required_fields
        )

    @property
    def display_name(self) -> str:
        """Get display name (fallback to user_id if name not set)"""
        return self.name or self.user_id

    @property
    def contact_info(self) -> str:
        """Get formatted contact information"""
        parts = []
        if self.email:
            parts.append(f"Email: {self.email}")
        if self.phone:
            parts.append(f"Phone: {self.phone}")
        return " | ".join(parts) if parts else "No contact info"

    @property
    def completion_percentage(self) -> int:
        """Calculate profile completion percentage"""
        fields = ['name', 'school_name', 'email', 'phone', 'address', 'date_of_birth']
        filled = sum(1 for field in fields if getattr(self, field))
        return int((filled / len(fields)) * 100)