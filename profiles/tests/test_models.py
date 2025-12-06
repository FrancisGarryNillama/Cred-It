"""Tests for profiles models"""
import pytest
from django.core.exceptions import ValidationError
from profiles.models import Profile
from datetime import date


@pytest.mark.django_db
class TestProfile:
    """Test Profile model"""
    
    def test_create_profile(self):
        """Test creating a profile"""
        profile = Profile.objects.create(
            user_id="TEST001",
            name="John Doe",
            school_name="Test University",
            email="john@example.com",
            phone="1234567890"
        )
        
        assert profile.user_id == "TEST001"
        assert profile.name == "John Doe"
        assert profile.is_complete is True
    
    def test_profile_str(self):
        """Test string representation"""
        profile = Profile.objects.create(
            user_id="TEST002",
            name="Jane Doe"
        )
        
        assert str(profile) == "Jane Doe"
    
    def test_profile_str_without_name(self):
        """Test string representation without name"""
        profile = Profile.objects.create(user_id="TEST003")
        
        assert str(profile) == "Profile TEST003"
    
    def test_display_name_property(self):
        """Test display_name property"""
        profile = Profile.objects.create(
            user_id="TEST004",
            name="Test User"
        )
        
        assert profile.display_name == "Test User"
    
    def test_display_name_fallback(self):
        """Test display_name falls back to user_id"""
        profile = Profile.objects.create(user_id="TEST005")
        
        assert profile.display_name == "TEST005"
    
    def test_contact_info_property(self):
        """Test contact_info property"""
        profile = Profile.objects.create(
            user_id="TEST006",
            email="test@example.com",
            phone="1234567890"
        )
        
        assert "Email: test@example.com" in profile.contact_info
        assert "Phone: 1234567890" in profile.contact_info
    
    def test_contact_info_empty(self):
        """Test contact_info with no contact details"""
        profile = Profile.objects.create(user_id="TEST007")
        
        assert profile.contact_info == "No contact info"
    
    def test_completion_percentage(self):
        """Test completion percentage calculation"""
        profile = Profile.objects.create(
            user_id="TEST008",
            name="Test",
            school_name="School",
            email="test@example.com"
        )
        
        # 3 out of 6 fields filled = 50%
        assert profile.completion_percentage == 50
    
    def test_completeness_check(self):
        """Test completeness checking"""
        # Incomplete profile
        incomplete = Profile.objects.create(
            user_id="TEST009",
            name="Test"
        )
        assert incomplete.is_complete is False
        
        # Complete profile
        complete = Profile.objects.create(
            user_id="TEST010",
            name="Test",
            school_name="School",
            email="test@example.com",
            phone="1234567890"
        )
        assert complete.is_complete is True
    
    def test_email_validation(self):
        """Test email validation"""
        with pytest.raises(ValidationError) as exc_info:
            profile = Profile(
                user_id="TEST011",
                email="invalid-email"
            )
            profile.full_clean()
        
        assert 'email' in exc_info.value.message_dict
    
    def test_unique_user_id(self):
        """Test unique constraint on user_id"""
        Profile.objects.create(user_id="TEST012")
        
        with pytest.raises(Exception):  # IntegrityError
            Profile.objects.create(user_id="TEST012")