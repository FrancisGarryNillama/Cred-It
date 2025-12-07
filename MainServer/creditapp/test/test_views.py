"""Tests for creditapp API views"""
import pytest
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient
from creditapp.models import CreditAccount


@pytest.fixture
def api_client():
    """Provide API client for testing"""
    return APIClient()


@pytest.mark.django_db
class TestCreditAppAPI:
    """Test credit app API endpoints"""
    
    def test_register_success(self, api_client):
        """Test successful registration"""
        url = reverse('creditapp:register')
        data = {
            'account_id': 'API001',
            'account_pass': 'password123'
        }
        
        response = api_client.post(url, data, format='json')
        
        assert response.status_code == status.HTTP_201_CREATED
        assert response.data['success'] is True
        assert 'account_id' in response.data['data']
        assert response.data['data']['account_id'] == 'API001'
    
    def test_register_missing_password(self, api_client):
        """Test registration with missing password"""
        url = reverse('creditapp:register')
        data = {'account_id': 'API002'}
        
        response = api_client.post(url, data, format='json')
        
        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert response.data['success'] is False
    
    def test_register_short_password(self, api_client):
        """Test registration with short password"""
        url = reverse('creditapp:register')
        data = {
            'account_id': 'API003',
            'account_pass': 'short'
        }
        
        response = api_client.post(url, data, format='json')
        
        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert '8 characters' in str(response.data).lower()
    
    def test_register_duplicate(self, api_client):
        """Test registration with duplicate account"""
        url = reverse('creditapp:register')
        data = {
            'account_id': 'API004',
            'account_pass': 'password123'
        }
        
        # First registration
        api_client.post(url, data, format='json')
        
        # Second registration (duplicate)
        response = api_client.post(url, data, format='json')
        
        assert response.status_code == status.HTTP_409_CONFLICT
        assert 'already exists' in str(response.data).lower()
    
    def test_login_success(self, api_client):
        """Test successful login"""
        # First register
        register_url = reverse('creditapp:register')
        api_client.post(register_url, {
            'account_id': 'LOGIN001',
            'account_pass': 'password123'
        }, format='json')
        
        # Then login
        login_url = reverse('creditapp:login')
        response = api_client.post(login_url, {
            'account_id': 'LOGIN001',
            'account_pass': 'password123'
        }, format='json')
        
        assert response.status_code == status.HTTP_200_OK
        assert response.data['success'] is True
        assert response.data['data']['account_id'] == 'LOGIN001'
        assert 'last_login' in response.data['data']
    
    def test_login_wrong_password(self, api_client):
        """Test login with wrong password"""
        # Register first
        register_url = reverse('creditapp:register')
        api_client.post(register_url, {
            'account_id': 'LOGIN002',
            'account_pass': 'password123'
        }, format='json')
        
        # Try login with wrong password
        login_url = reverse('creditapp:login')
        response = api_client.post(login_url, {
            'account_id': 'LOGIN002',
            'account_pass': 'wrongpassword'
        }, format='json')
        
        assert response.status_code == status.HTTP_401_UNAUTHORIZED
        assert response.data['success'] is False
    
    def test_login_nonexistent_account(self, api_client):
        """Test login with non-existent account"""
        login_url = reverse('creditapp:login')
        response = api_client.post(login_url, {
            'account_id': 'NONEXISTENT',
            'account_pass': 'password123'
        }, format='json')
        
        assert response.status_code == status.HTTP_404_NOT_FOUND
        assert response.data['success'] is False
    
    def test_change_password_success(self, api_client):
        """Test successful password change"""
        # Register first
        register_url = reverse('creditapp:register')
        api_client.post(register_url, {
            'account_id': 'CHANGE001',
            'account_pass': 'oldpassword123'
        }, format='json')
        
        # Change password
        change_url = reverse('creditapp:change_password')
        response = api_client.post(change_url, {
            'account_id': 'CHANGE001',
            'old_password': 'oldpassword123',
            'new_password': 'newpassword123'
        }, format='json')
        
        assert response.status_code == status.HTTP_200_OK
        assert response.data['success'] is True
        
        # Verify can login with new password
        login_url = reverse('creditapp:login')
        login_response = api_client.post(login_url, {
            'account_id': 'CHANGE001',
            'account_pass': 'newpassword123'
        }, format='json')
        
        assert login_response.status_code == status.HTTP_200_OK
    
    def test_get_account_info(self, api_client):
        """Test getting account information"""
        # Register first
        register_url = reverse('creditapp:register')
        api_client.post(register_url, {
            'account_id': 'INFO001',
            'account_pass': 'password123'
        }, format='json')
        
        # Get account info
        info_url = reverse('creditapp:account_info')
        response = api_client.get(f"{info_url}?account_id=INFO001")
        
        assert response.status_code == status.HTTP_200_OK
        assert response.data['success'] is True
        assert response.data['data']['account_id'] == 'INFO001'
    
    def test_get_statistics(self, api_client):
        """Test getting account statistics"""
        # Create some accounts
        register_url = reverse('creditapp:register')
        api_client.post(register_url, {
            'account_id': 'STAT001',
            'account_pass': 'password123'
        }, format='json')
        
        # Get statistics
        stats_url = reverse('creditapp:statistics')
        response = api_client.get(stats_url)
        
        assert response.status_code == status.HTTP_200_OK
        assert response.data['success'] is True
        assert 'total' in response.data['data']
        assert response.data['data']['total'] >= 1