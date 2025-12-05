"""
Business logic for credit account operations.
All authentication and account management logic should be here.
"""
from typing import Optional, Dict
from django.contrib.auth.hashers import make_password, check_password
from django.utils import timezone
from core.exceptions import (
    ValidationException,
    ResourceNotFoundException,
    AuthenticationException,
    DuplicateResourceException
)
from core.decorators import log_execution, atomic_transaction
from .models import CreditAccount
import logging

logger = logging.getLogger(__name__)


class CreditAccountService:
    """
    Service class for credit account operations.
    Handles registration, authentication, and account management.
    """
    
    @staticmethod
    @atomic_transaction
    @log_execution
    def register_account(
        account_id: str,
        account_pass: str,
        status: str = CreditAccount.Status.STUDENT
    ) -> CreditAccount:
        """
        Register a new credit account.
        
        Args:
            account_id: Unique account identifier
            account_pass: Account password
            status: Account status (default: Student)
            
        Returns:
            Created CreditAccount instance
            
        Raises:
            ValidationException: If validation fails
            DuplicateResourceException: If account already exists
        """
        # Validate inputs
        if not account_id or not account_pass:
            raise ValidationException("Account ID and password are required")
        
        if len(account_pass) < 8:
            raise ValidationException("Password must be at least 8 characters long")
        
        # Check if account already exists
        if CreditAccount.objects.filter(account_id=account_id).exists():
            raise DuplicateResourceException("CreditAccount", account_id)
        
        # Validate status
        if status not in [s.value for s in CreditAccount.Status]:
            raise ValidationException(
                f"Invalid status. Must be one of: {', '.join([s.value for s in CreditAccount.Status])}"
            )
        
        # Create account with hashed password for students
        if status == CreditAccount.Status.STUDENT:
            hashed_password = make_password(account_pass)
        else:
            # Legacy: Faculty/Admin use plain text (should be migrated)
            hashed_password = account_pass
        
        account = CreditAccount.objects.create(
            account_id=account_id,
            account_pass=hashed_password,
            status=status,
            is_active=True
        )
        
        logger.info(
            f"Account registered successfully: {account_id} (Status: {status})"
        )
        
        return account
    
    @staticmethod
    @log_execution
    def authenticate_account(account_id: str, account_pass: str) -> Dict[str, str]:
        """
        Authenticate a credit account.
        
        Args:
            account_id: Account identifier
            account_pass: Account password
            
        Returns:
            Dictionary with account details
            
        Raises:
            ValidationException: If validation fails
            ResourceNotFoundException: If account not found
            AuthenticationException: If authentication fails
        """
        # Validate inputs
        if not account_id or not account_pass:
            raise ValidationException("Account ID and password are required")
        
        # Get account
        try:
            account = CreditAccount.objects.get(account_id=account_id)
        except CreditAccount.DoesNotExist:
            raise ResourceNotFoundException("CreditAccount", account_id)
        
        # Check if account is active
        if not account.is_active:
            raise AuthenticationException("Account is inactive")
        
        # Verify password based on account type
        if account.is_student:
            # Students use hashed passwords
            if not check_password(account_pass, account.account_pass):
                raise AuthenticationException("Invalid credentials")
        else:
            # Faculty/Admin use plain text (legacy)
            if account_pass != account.account_pass:
                raise AuthenticationException("Invalid credentials")
        
        # Update last login
        account.last_login = timezone.now()
        account.save(update_fields=['last_login'])
        
        logger.info(f"Account authenticated successfully: {account_id}")
        
        return {
            "account_id": account.account_id,
            "status": account.status,
            "last_login": account.last_login.isoformat() if account.last_login else None
        }
    
    @staticmethod
    def get_account(account_id: str) -> CreditAccount:
        """
        Get account by ID.
        
        Args:
            account_id: Account identifier
            
        Returns:
            CreditAccount instance
            
        Raises:
            ResourceNotFoundException: If account not found
        """
        try:
            return CreditAccount.objects.get(account_id=account_id)
        except CreditAccount.DoesNotExist:
            raise ResourceNotFoundException("CreditAccount", account_id)
    
    @staticmethod
    @log_execution
    def update_password(
        account_id: str,
        old_password: str,
        new_password: str
    ) -> CreditAccount:
        """
        Update account password.
        
        Args:
            account_id: Account identifier
            old_password: Current password
            new_password: New password
            
        Returns:
            Updated CreditAccount instance
            
        Raises:
            ValidationException: If validation fails
            AuthenticationException: If old password is incorrect
        """
        if len(new_password) < 8:
            raise ValidationException("New password must be at least 8 characters long")
        
        # Authenticate with old password first
        CreditAccountService.authenticate_account(account_id, old_password)
        
        # Get account and update password
        account = CreditAccountService.get_account(account_id)
        
        if account.is_student:
            account.account_pass = make_password(new_password)
        else:
            account.account_pass = new_password
        
        account.save(update_fields=['account_pass', 'updated_at'])
        
        logger.info(f"Password updated for account: {account_id}")
        
        return account
    
    @staticmethod
    @log_execution
    def deactivate_account(account_id: str) -> CreditAccount:
        """
        Deactivate an account.
        
        Args:
            account_id: Account identifier
            
        Returns:
            Updated CreditAccount instance
        """
        account = CreditAccountService.get_account(account_id)
        account.is_active = False
        account.save(update_fields=['is_active', 'updated_at'])
        
        logger.info(f"Account deactivated: {account_id}")
        
        return account
    
    @staticmethod
    @log_execution
    def activate_account(account_id: str) -> CreditAccount:
        """
        Activate an account.
        
        Args:
            account_id: Account identifier
            
        Returns:
            Updated CreditAccount instance
        """
        account = CreditAccountService.get_account(account_id)
        account.is_active = True
        account.save(update_fields=['is_active', 'updated_at'])
        
        logger.info(f"Account activated: {account_id}")
        
        return account
    
    @staticmethod
    def get_account_statistics() -> Dict[str, int]:
        """
        Get account statistics.
        
        Returns:
            Dictionary with account counts by status
        """
        from django.db.models import Count
        
        stats = CreditAccount.objects.values('status').annotate(
            count=Count('account_id')
        )
        
        result = {item['status']: item['count'] for item in stats}
        result['total'] = CreditAccount.objects.count()
        result['active'] = CreditAccount.objects.filter(is_active=True).count()
        result['inactive'] = CreditAccount.objects.filter(is_active=False).count()
        
        return result
