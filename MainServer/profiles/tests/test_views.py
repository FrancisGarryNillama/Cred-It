"""Tests for profiles API views"""
import pytest
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient
from profiles.models import Profile


@pytest.fixture
def api_client():
    """Provide API client"""
    return APIClient()


@pytest.mark.django_db
class TestProfilesAPI:
    """Test profiles API endpoints"""
    
    def test_save_profile_create(self, api_client):
        """Test creating profile via API"""
        url = reverse('profiles:save_profile')
        data = {
            'user_id': 'API001',
            'name': 'John Doe',
            'school_name': 'Test University',
            'email': 'john@example.com',
            'phone': '1234567890'
        }
        
        response = api_client.post(url, data, format='json')
        
        assert response.status_code == status.HTTP_200_OK
        assert response.data['success'] is True
        assert response.data['data']['user_id'] == 'API001'
    
    def test_save_profile_update(self, api_client):
        """Test updating profile via API"""
        # Create first
        Profile.objects.create(
            user_id='API002',
            name='Original'
        )
        
        # Update
        url = reverse('profiles:save_profile')
        data = {
            'user_id': 'API002',
            'name': 'Updated Name'
        }
        
        response = api_client.post(url, data, format='json')
        
        assert response.status_code == status.HTTP_200_OK
        assert response.data['data']['name'] == 'Updated Name'
    
    def test_get_profile(self, api_client):
        """Test getting profile by user_id"""
        Profile.objects.create(
            user_id='API003',
            name='Test User'
        )
        
        url = reverse('profiles:get_profile', kwargs={'user_id': 'API003'})
        response = api_client.get(url)
        
        assert response.status_code == status.HTTP_200_OK
        assert response.data['success'] is True
        assert response.data['data']['user_id'] == 'API003'
    
    def test_get_profile_not_found(self, api_client):
        """Test getting non-existent profile"""
        url = reverse('profiles:get_profile', kwargs={'user_id': 'NOTFOUND'})
        response = api_client.get(url)
        
        assert response.status_code == status.HTTP_404_NOT_FOUND
    
    def test_get_all_profiles(self, api_client):
        """Test getting all profiles"""
        Profile.objects.create(user_id='API004', name='User 1')
        Profile.objects.create(user_id='API005', name='User 2')
        
        url = reverse('profiles:get_profiles')
        response = api_client.get(url)
        
        assert response.status_code == status.HTTP_200_OK
        assert response.data['success'] is True
        assert len(response.data['data']) >= 2
    
    def test_get_profiles_with_filter(self, api_client):
        """Test getting profiles with filters"""
        Profile.objects.create(
            user_id='API006',
            name='Complete',
            school_name='School',
            email='test@example.com',
            phone='1234567890'
        )
        
        url = reverse('profiles:get_profiles')
        response = api_client.get(f'{url}?is_complete=true')
        
        assert response.status_code == status.HTTP_200_OK
        assert all(p['is_complete'] for p in response.data['data'])
    
    def test_get_profiles_with_search(self, api_client):
        """Test searching profiles"""
        Profile.objects.create(user_id='API007', name='John Smith')
        
        url = reverse('profiles:get_profiles')
        response = api_client.get(f'{url}?search=John')
        
        assert response.status_code == status.HTTP_200_OK
        assert len(response.data['data']) >= 1
    
    def test_check_profile_exists(self, api_client):
        """Test checking if profile exists"""
        Profile.objects.create(user_id='API008')
        
        url = reverse('profiles:check_profile_exists')
        
        # Check existing
        response = api_client.get(f'{url}?user_id=API008')
        assert response.status_code == status.HTTP_200_OK
        assert response.data['data']['exists'] is True
        
        # Check non-existing
        response = api_client.get(f'{url}?user_id=NOTEXIST')
        assert response.status_code == status.HTTP_200_OK
        assert response.data['data']['exists'] is False
    
    def test_get_incomplete_profiles(self, api_client):
        """Test getting incomplete profiles"""
        Profile.objects.create(user_id='API009', name='Incomplete')
        
        url = reverse('profiles:incomplete_profiles')
        response = api_client.get(url)
        
        assert response.status_code == status.HTTP_200_OK
        assert len(response.data['data']) >= 1
    
    def test_get_profile_statistics(self, api_client):
        """Test getting statistics"""
        Profile.objects.create(
            user_id='API010',
            name='Test',
            school_name='School',
            email='test@example.com',
            phone='1234567890'
        )
        
        url = reverse('profiles:profile_statistics')
        response = api_client.get(url)
        
        assert response.status_code == status.HTTP_200_OK
        assert 'total' in response.data['data']
        assert 'complete' in response.data['data']
        assert 'completion_rate' in response.data['data']