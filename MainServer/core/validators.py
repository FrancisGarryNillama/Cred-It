"""Custom validators for models and forms"""
from django.core.exceptions import ValidationError
from typing import Any, Optional
import re


def validate_account_id(value: str) -> None:
    """
    Validate account ID format.
    
    Rules:
    - Must be a non-empty string
    - Maximum 100 characters
    - Can contain alphanumeric characters, hyphens, and underscores
    
    Args:
        value: Account ID to validate
        
    Raises:
        ValidationError: If validation fails
    """
    if not value or not isinstance(value, str):
        raise ValidationError("Account ID must be a non-empty string")
    
    if len(value) > 100:
        raise ValidationError("Account ID must be 100 characters or less")
    
    if not re.match(r'^[a-zA-Z0-9_-]+$', value):
        raise ValidationError(
            "Account ID can only contain letters, numbers, hyphens, and underscores"
        )


def validate_grade(value: float) -> None:
    """
    Validate grade is within acceptable range.
    
    Args:
        value: Grade value to validate
        
    Raises:
        ValidationError: If validation fails
    """
    if not isinstance(value, (int, float)):
        raise ValidationError("Grade must be a number")
    
    if value < 0 or value > 5.0:
        raise ValidationError("Grade must be between 0 and 5.0")


def validate_units(value: float) -> None:
    """
    Validate academic units.
    
    Args:
        value: Units value to validate
        
    Raises:
        ValidationError: If validation fails
    """
    if not isinstance(value, (int, float)):
        raise ValidationError("Units must be a number")
    
    if value < 0:
        raise ValidationError("Units cannot be negative")
    
    if value > 10:
        raise ValidationError("Units must be 10 or less")


def validate_email_domain(value: str, allowed_domains: Optional[list] = None) -> None:
    """
    Validate email domain against allowed list.
    
    Args:
        value: Email address to validate
        allowed_domains: List of allowed domains (optional)
        
    Raises:
        ValidationError: If domain not in allowed list
    """
    if not allowed_domains:
        return
    
    if '@' not in value:
        raise ValidationError("Invalid email format")
    
    domain = value.split('@')[1].lower()
    
    if domain not in [d.lower() for d in allowed_domains]:
        raise ValidationError(
            f"Email domain must be one of: {', '.join(allowed_domains)}"
        )


def validate_phone_number(value: str) -> None:
    """
    Validate phone number format.
    
    Args:
        value: Phone number to validate
        
    Raises:
        ValidationError: If format is invalid
    """
    # Allow empty/None values (phone is optional)
    if not value or value.strip() == '':
        return
    
    # Remove common separators
    cleaned = re.sub(r'[\s\-\(\)]', '', value)
    
    # Check if it's all digits and reasonable length
    if not cleaned.isdigit():
        raise ValidationError("Phone number must contain only digits")
    
    if len(cleaned) < 10 or len(cleaned) > 15:
        raise ValidationError("Phone number must be between 10 and 15 digits")


def validate_subject_code(value: str) -> None:
    """
    Validate subject code format.
    
    Expected format: 2-5 letters followed by 2-4 digits
    Example: CS101, MATH1234, IT400
    
    Args:
        value: Subject code to validate
        
    Raises:
        ValidationError: If format is invalid
    """
    if not value or not isinstance(value, str):
        raise ValidationError("Subject code must be a non-empty string")
    
    pattern = r'^[A-Z]{2,5}\d{2,4}[A-Z]?$'
    if not re.match(pattern, value.upper()):
        raise ValidationError(
            "Subject code must be 2-5 letters followed by 2-4 digits "
            "(e.g., CS101, MATH1234)"
        )


def validate_school_year(value: str) -> None:
    """
    Validate school year format.
    
    Expected format: YYYY-YYYY (e.g., 2023-2024)
    
    Args:
        value: School year to validate
        
    Raises:
        ValidationError: If format is invalid
    """
    pattern = r'^\d{4}-\d{4}$'
    if not re.match(pattern, value):
        raise ValidationError("School year must be in format YYYY-YYYY (e.g., 2023-2024)")
    
    # Validate years are consecutive
    years = value.split('-')
    if int(years[1]) != int(years[0]) + 1:
        raise ValidationError("School year must be consecutive (e.g., 2023-2024)")


def validate_semester(value: str) -> None:
    """
    Validate semester value.
    
    Args:
        value: Semester to validate
        
    Raises:
        ValidationError: If value not in allowed semesters
    """
    allowed_semesters = ['first', 'second', 'summer']
    
    if value.lower() not in allowed_semesters:
        raise ValidationError(
            f"Semester must be one of: {', '.join(allowed_semesters)}"
        )