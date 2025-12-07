"""Tests for creditapp models"""
import pytest
from django.core.exceptions import ValidationError
from creditapp.models import CreditAccount, CustomUser


@pytest.mark.django_db
class TestCreditAccount:
    """Test CreditAccount model"""
    
    def test_create_credit_account(self):
        """Test creating a credit account"""
        account = CreditAccount.objects.create(
            account_id="TEST001",
            account_pass="hashed_password",
            status=CreditAccount.Status.STUDENT
        )
        
        assert account.account_id == "TEST001"
        assert account.status == CreditAccount.Status.STUDENT
        assert account.is_active is True
        assert account.is_student is True
    
    def test_credit_account_str(self):
        """Test string representation"""
        account = CreditAccount.objects.create(
            account_id="TEST002",
            account_pass="password",
            status=CreditAccount.Status.FACULTY
        )
        
        assert str(account) == "TEST002 (Faculty)"
    
    def test_credit_account_status_properties(self):
        """Test status property methods"""
        student = CreditAccount.objects.create(
            account_id="STUDENT001",
            account_pass="pass",
            status=CreditAccount.Status.STUDENT
        )
        
        faculty = CreditAccount.objects.create(
            account_id="FACULTY001",
            account_pass="pass",
            status=CreditAccount.Status.FACULTY
        )
        
        admin = CreditAccount.objects.create(
            account_id="ADMIN001",
            account_pass="pass",
            status=CreditAccount.Status.ADMIN
        )
        
        assert student.is_student is True
        assert student.is_faculty is False
        assert student.is_admin is False
        
        assert faculty.is_student is False
        assert faculty.is_faculty is True
        assert faculty.is_admin is False
        
        assert admin.is_student is False
        assert admin.is_faculty is False
        assert admin.is_admin is True
    
    def test_credit_account_validation_no_password(self):
        """Test validation fails without password"""
        with pytest.raises(ValidationError) as exc_info:
            account = CreditAccount(
                account_id="TEST003",
                account_pass="",
                status=CreditAccount.Status.STUDENT
            )
            account.full_clean()
        
        assert 'account_pass' in exc_info.value.message_dict


@pytest.mark.django_db
class TestCustomUser:
    """Test CustomUser model"""
    
    def test_create_user(self):
        """Test creating a regular user"""
        user = CustomUser.objects.create_user(
            email="test@example.com",
            password="testpass123"
        )
        
        assert user.email == "test@example.com"
        assert user.check_password("testpass123")
        assert user.is_staff is False
        assert user.is_superuser is False
    
    def test_create_superuser(self):
        """Test creating a superuser"""
        user = CustomUser.objects.create_superuser(
            email="admin@example.com",
            password="adminpass123"
        )
        
        assert user.email == "admin@example.com"
        assert user.is_staff is True
        assert user.is_superuser is True
    
    def test_user_full_name(self):
        """Test full_name property"""
        user = CustomUser.objects.create_user(
            email="john@example.com",
            password="pass123",
            first_name="John",
            last_name="Doe"
        )
        
        assert user.full_name == "John Doe"
    
    def test_user_full_name_fallback(self):
        """Test full_name falls back to email"""
        user = CustomUser.objects.create_user(
            email="jane@example.com",
            password="pass123"
        )
        
        assert user.full_name == "jane@example.com"
    
    def test_user_get_short_name(self):
        """Test get_short_name method"""
        user = CustomUser.objects.create_user(
            email="john@example.com",
            password="pass123",
            first_name="John"
        )
        
        assert user.get_short_name() == "John"
    
    def test_create_user_without_email(self):
        """Test creating user without email raises error"""
        with pytest.raises(ValueError) as exc_info:
            CustomUser.objects.create_user(email="", password="pass123")
        
        assert "Email field is required" in str(exc_info.value)
