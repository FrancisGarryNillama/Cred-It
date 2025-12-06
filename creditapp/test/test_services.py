"""Tests for creditapp services"""
import pytest
from django.contrib.auth.hashers import check_password
from creditapp.services import CreditAccountService
from creditapp.models import CreditAccount
from core.exceptions import (
    ValidationException,
    ResourceNotFoundException,
    AuthenticationException,
    DuplicateResourceException
)


@pytest.mark.django_db
class TestCreditAccountService:
    """Test CreditAccountService"""
    
    def test_register_account_success(self):
        """Test successful account registration"""
        account = CreditAccountService.register_account(
            "STUDENT001",
            "password123"
        )
        
        assert account.account_id == "STUDENT001"
        assert account.status == CreditAccount.Status.STUDENT
        assert check_password("password123", account.account_pass)
        assert account.is_active is True
    
    def test_register_account_with_status(self):
        """Test registration with custom status"""
        account = CreditAccountService.register_account(
            "FACULTY001",
            "password123",
            status=CreditAccount.Status.FACULTY
        )
        
        assert account.status == CreditAccount.Status.FACULTY
    
    def test_register_account_missing_data(self):
        """Test registration with missing data"""
        with pytest.raises(ValidationException) as exc_info:
            CreditAccountService.register_account("", "password")
        
        assert "required" in str(exc_info.value).lower()
    
    def test_register_account_short_password(self):
        """Test registration with short password"""
        with pytest.raises(ValidationException) as exc_info:
            CreditAccountService.register_account("TEST001", "short")
        
        assert "8 characters" in str(exc_info.value)
    
    def test_register_account_duplicate(self):
        """Test registration with duplicate account ID"""
        CreditAccountService.register_account("DUP001", "password123")
        
        with pytest.raises(DuplicateResourceException) as exc_info:
            CreditAccountService.register_account("DUP001", "password123")
        
        assert "already exists" in str(exc_info.value).lower()
    
    def test_authenticate_account_success(self):
        """Test successful authentication"""
        # Register first
        CreditAccountService.register_account("AUTH001", "password123")
        
        # Then authenticate
        result = CreditAccountService.authenticate_account("AUTH001", "password123")
        
        assert result["account_id"] == "AUTH001"
        assert result["status"] == CreditAccount.Status.STUDENT
        assert "last_login" in result
    
    def test_authenticate_account_not_found(self):
        """Test authentication with non-existent account"""
        with pytest.raises(ResourceNotFoundException):
            CreditAccountService.authenticate_account("NONEXISTENT", "password")
    
    def test_authenticate_account_wrong_password(self):
        """Test authentication with wrong password"""
        CreditAccountService.register_account("WRONG001", "password123")
        
        with pytest.raises(AuthenticationException) as exc_info:
            CreditAccountService.authenticate_account("WRONG001", "wrongpassword")
        
        assert "invalid credentials" in str(exc_info.value).lower()
    
    def test_authenticate_account_inactive(self):
        """Test authentication with inactive account"""
        account = CreditAccountService.register_account("INACTIVE001", "password123")
        account.is_active = False
        account.save()
        
        with pytest.raises(AuthenticationException) as exc_info:
            CreditAccountService.authenticate_account("INACTIVE001", "password123")
        
        assert "inactive" in str(exc_info.value).lower()
    
    def test_get_account(self):
        """Test getting account by ID"""
        created = CreditAccountService.register_account("GET001", "password123")
        
        retrieved = CreditAccountService.get_account("GET001")
        
        assert retrieved.account_id == created.account_id
    
    def test_get_account_not_found(self):
        """Test getting non-existent account"""
        with pytest.raises(ResourceNotFoundException):
            CreditAccountService.get_account("NOTFOUND")
    
    def test_update_password(self):
        """Test password update"""
        CreditAccountService.register_account("UPDATE001", "oldpassword123")
        
        account = CreditAccountService.update_password(
            "UPDATE001",
            "oldpassword123",
            "newpassword123"
        )
        
        # Should be able to authenticate with new password
        result = CreditAccountService.authenticate_account("UPDATE001", "newpassword123")
        assert result["account_id"] == "UPDATE001"
        
        # Should not be able to authenticate with old password
        with pytest.raises(AuthenticationException):
            CreditAccountService.authenticate_account("UPDATE001", "oldpassword123")
    
    def test_update_password_wrong_old_password(self):
        """Test password update with wrong old password"""
        CreditAccountService.register_account("UPDATE002", "password123")
        
        with pytest.raises(AuthenticationException):
            CreditAccountService.update_password(
                "UPDATE002",
                "wrongoldpassword",
                "newpassword123"
            )
    
    def test_update_password_short_new_password(self):
        """Test password update with short new password"""
        CreditAccountService.register_account("UPDATE003", "password123")
        
        with pytest.raises(ValidationException) as exc_info:
            CreditAccountService.update_password(
                "UPDATE003",
                "password123",
                "short"
            )
        
        assert "8 characters" in str(exc_info.value)
    
    def test_deactivate_account(self):
        """Test account deactivation"""
        account = CreditAccountService.register_account("DEACT001", "password123")
        assert account.is_active is True
        
        deactivated = CreditAccountService.deactivate_account("DEACT001")
        assert deactivated.is_active is False
    
    def test_activate_account(self):
        """Test account activation"""
        account = CreditAccountService.register_account("ACT001", "password123")
        account.is_active = False
        account.save()
        
        activated = CreditAccountService.activate_account("ACT001")
        assert activated.is_active is True
    
    def test_get_account_statistics(self):
        """Test getting account statistics"""
        # Create various accounts
        CreditAccountService.register_account("STAT001", "pass", CreditAccount.Status.STUDENT)
        CreditAccountService.register_account("STAT002", "pass", CreditAccount.Status.STUDENT)
        CreditAccountService.register_account("STAT003", "pass", CreditAccount.Status.FACULTY)
        
        stats = CreditAccountService.get_account_statistics()
        
        assert stats['Student'] == 2
        assert stats['Faculty'] == 1
        assert stats['total'] == 3
        assert stats['active'] == 3