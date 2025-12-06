"""Tests for profiles services"""
import pytest
from profiles.services import ProfileService
from profiles.models import Profile
from core.exceptions import (
    ValidationException,
    ResourceNotFoundException,
    DuplicateResourceException
)


@pytest.mark.django_db
class TestProfileService:
    """Test ProfileService"""
    
    def test_create_profile(self):
        """Test creating a profile"""
        profile = ProfileService.create_profile(
            user_id="SERVICE001",
            name="John Doe",
            school_name="Test U",
            email="john@example.com",
            phone="1234567890"
        )
        
        assert profile.user_id == "SERVICE001"
        assert profile.name == "John Doe"
        assert profile.is_complete is True
    
    def test_create_profile_missing_user_id(self):
        """Test creating profile without user_id"""
        with pytest.raises(ValidationException):
            ProfileService.create_profile(
                user_id="",
                name="John Doe"
            )
    
    def test_create_profile_duplicate(self):
        """Test creating duplicate profile"""
        ProfileService.create_profile(user_id="DUP001")
        
        with pytest.raises(DuplicateResourceException):
            ProfileService.create_profile(user_id="DUP001")
    
    def test_update_profile(self):
        """Test updating a profile"""
        # Create first
        ProfileService.create_profile(
            user_id="UPDATE001",
            name="Original Name"
        )
        
        # Update
        updated = ProfileService.update_profile(
            user_id="UPDATE001",
            name="Updated Name",
            email="new@example.com"
        )
        
        assert updated.name == "Updated Name"
        assert updated.email == "new@example.com"
    
    def test_update_profile_not_found(self):
        """Test updating non-existent profile"""
        with pytest.raises(ResourceNotFoundException):
            ProfileService.update_profile(
                user_id="NOTFOUND",
                name="Test"
            )
    
    def test_save_profile_create(self):
        """Test save_profile creates new profile"""
        profile = ProfileService.save_profile(
            user_id="SAVE001",
            name="Test User"
        )
        
        assert profile.user_id == "SAVE001"
        assert Profile.objects.filter(user_id="SAVE001").exists()
    
    def test_save_profile_update(self):
        """Test save_profile updates existing profile"""
        # Create first
        ProfileService.create_profile(
            user_id="SAVE002",
            name="Original"
        )
        
        # Save (should update)
        updated = ProfileService.save_profile(
            user_id="SAVE002",
            name="Updated"
        )
        
        assert updated.name == "Updated"
        assert Profile.objects.filter(user_id="SAVE002").count() == 1
    
    def test_get_profile(self):
        """Test getting a profile"""
        created = ProfileService.create_profile(
            user_id="GET001",
            name="Test"
        )
        
        retrieved = ProfileService.get_profile("GET001")
        
        assert retrieved.user_id == created.user_id
        assert retrieved.name == created.name
    
    def test_get_profile_not_found(self):
        """Test getting non-existent profile"""
        with pytest.raises(ResourceNotFoundException):
            ProfileService.get_profile("NOTFOUND")
    
    def test_get_all_profiles(self):
        """Test getting all profiles"""
        ProfileService.create_profile(user_id="ALL001", name="User 1")
        ProfileService.create_profile(user_id="ALL002", name="User 2")
        
        profiles = ProfileService.get_all_profiles()
        
        assert len(profiles) >= 2
    
    def test_get_all_profiles_with_filter(self):
        """Test getting profiles with completion filter"""
        ProfileService.create_profile(
            user_id="FILTER001",
            name="Complete",
            school_name="School",
            email="test@example.com",
            phone="1234567890"
        )
        ProfileService.create_profile(
            user_id="FILTER002",
            name="Incomplete"
        )
        
        complete = ProfileService.get_all_profiles(is_complete=True)
        incomplete = ProfileService.get_all_profiles(is_complete=False)
        
        assert len(complete) >= 1
        assert len(incomplete) >= 1
    
    def test_get_all_profiles_with_search(self):
        """Test getting profiles with search"""
        ProfileService.create_profile(
            user_id="SEARCH001",
            name="John Smith"
        )
        ProfileService.create_profile(
            user_id="SEARCH002",
            name="Jane Doe"
        )
        
        results = ProfileService.get_all_profiles(search="John")
        
        assert len(results) >= 1
        assert any(p.name == "John Smith" for p in results)
    
    def test_delete_profile(self):
        """Test deleting a profile"""
        ProfileService.create_profile(user_id="DELETE001")
        
        result = ProfileService.delete_profile("DELETE001")
        
        assert result is True
        assert not Profile.objects.filter(user_id="DELETE001").exists()
    
    def test_delete_profile_not_found(self):
        """Test deleting non-existent profile"""
        with pytest.raises(ResourceNotFoundException):
            ProfileService.delete_profile("NOTFOUND")
    
    def test_check_profile_exists(self):
        """Test checking if profile exists"""
        ProfileService.create_profile(user_id="EXISTS001")
        
        assert ProfileService.check_profile_exists("EXISTS001") is True
        assert ProfileService.check_profile_exists("NOTEXISTS") is False
    
    def test_get_incomplete_profiles(self):
        """Test getting incomplete profiles"""
        ProfileService.create_profile(
            user_id="INCOMPLETE001",
            name="Test"  # Only name, incomplete
        )
        
        incomplete = ProfileService.get_incomplete_profiles()
        
        assert len(incomplete) >= 1
        assert any(p.user_id == "INCOMPLETE001" for p in incomplete)
    
    def test_get_profile_statistics(self):
        """Test getting profile statistics"""
        # Create some profiles
        ProfileService.create_profile(
            user_id="STATS001",
            name="Complete",
            school_name="School",
            email="test@example.com",
            phone="1234567890"
        )
        ProfileService.create_profile(
            user_id="STATS002",
            name="Incomplete"
        )
        
        stats = ProfileService.get_profile_statistics()
        
        assert 'total' in stats
        assert 'complete' in stats
        assert 'incomplete' in stats
        assert 'completion_rate' in stats
        assert stats['total'] >= 2
