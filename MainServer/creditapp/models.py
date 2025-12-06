"""
Credit application models with improved structure and validation.
"""
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, BaseUserManager
from django.db import models
from django.utils import timezone
from django.core.exceptions import ValidationError
from core.validators import validate_account_id


class CustomUserManager(BaseUserManager):
    """
    Custom manager for CustomUser model.
    Handles user creation with email as the primary identifier.
    """
    
    def create_user(self, email: str, password: str = None, **extra_fields):
        """
        Create and save a regular user with the given email and password.
        
        Args:
            email: User's email address
            password: User's password
            **extra_fields: Additional user fields
            
        Returns:
            Created user instance
            
        Raises:
            ValueError: If email is not provided
        """
        if not email:
            raise ValueError('The Email field is required')
        
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email: str, password: str = None, **extra_fields):
        """
        Create and save a superuser with the given email and password.
        
        Args:
            email: Superuser's email address
            password: Superuser's password
            **extra_fields: Additional user fields
            
        Returns:
            Created superuser instance
            
        Raises:
            ValueError: If is_staff or is_superuser is not True
        """
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)

        if not extra_fields.get('is_staff'):
            raise ValueError('Superuser must have is_staff=True')
        if not extra_fields.get('is_superuser'):
            raise ValueError('Superuser must have is_superuser=True')

        return self.create_user(email, password, **extra_fields)


class CustomUser(AbstractBaseUser, PermissionsMixin):
    """
    Custom user model using email as the username field.
    
    This model is used for admin and staff authentication.
    Student/Faculty accounts use the CreditAccount model.
    """
    
    email = models.EmailField(
        unique=True,
        db_index=True,
        help_text='Email address used for authentication'
    )
    first_name = models.CharField(max_length=30, blank=True)
    last_name = models.CharField(max_length=30, blank=True)
    is_active = models.BooleanField(
        default=True,
        help_text='Designates whether this user should be treated as active'
    )
    is_staff = models.BooleanField(
        default=False,
        help_text='Designates whether the user can log into this admin site'
    )
    date_joined = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)

    objects = CustomUserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    class Meta:
        verbose_name = 'User'
        verbose_name_plural = 'Users'
        db_table = 'auth_custom_user'
        indexes = [
            models.Index(fields=['email']),
            models.Index(fields=['is_active', 'is_staff']),
        ]

    def __str__(self):
        return self.email

    @property
    def full_name(self) -> str:
        """Return user's full name or email if name not set"""
        name = f"{self.first_name} {self.last_name}".strip()
        return name if name else self.email

    def get_short_name(self) -> str:
        """Return the first name for the user"""
        return self.first_name or self.email.split('@')[0]


class CreditAccount(models.Model):
    """
    Credit account model for students, faculty, and administrators.
    
    This is separate from CustomUser and is used for the credit
    evaluation system authentication.
    """
    
    class Status(models.TextChoices):
        """Account status choices"""
        STUDENT = 'Student', 'Student'
        FACULTY = 'Faculty', 'Faculty'
        ADMIN = 'Admin', 'Admin'
    
    account_id = models.CharField(
        max_length=100,
        primary_key=True,
        validators=[validate_account_id],
        help_text='Unique account identifier'
    )
    account_pass = models.CharField(
        max_length=255,
        null=True,
        blank=True,
        help_text='Hashed password for student accounts, plain text for faculty/admin (legacy)'
    )
    status = models.CharField(
        max_length=10,
        choices=Status.choices,
        default=Status.STUDENT,
        db_index=True,
        help_text='Account type/role'
    )
    is_active = models.BooleanField(
        default=True,
        help_text='Whether this account is active'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    last_login = models.DateTimeField(
        null=True,
        blank=True,
        help_text='Last login timestamp'
    )

    class Meta:
        db_table = 'credit_account'
        verbose_name = 'Credit Account'
        verbose_name_plural = 'Credit Accounts'
        indexes = [
            models.Index(fields=['status']),
            models.Index(fields=['is_active']),
            models.Index(fields=['created_at']),
        ]
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.account_id} ({self.status})"

    def clean(self):
        """Validate the model instance"""
        super().clean()
        
        if not self.account_pass:
            raise ValidationError({
                'account_pass': 'Password is required'
            })
    
    def save(self, *args, **kwargs):
        """Override save to run validation"""
        self.full_clean()
        super().save(*args, **kwargs)

    @property
    def is_student(self) -> bool:
        """Check if account is a student"""
        return self.status == self.Status.STUDENT

    @property
    def is_faculty(self) -> bool:
        """Check if account is faculty"""
        return self.status == self.Status.FACULTY

    @property
    def is_admin(self) -> bool:
        """Check if account is admin"""
        return self.status == self.Status.ADMIN
