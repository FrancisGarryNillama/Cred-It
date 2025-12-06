"""Tests for curriculum API views"""
import pytest
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient
from curriculum.models import CompareResultTOR, CitTorContent
from torchecker.models import TorTransferee


@pytest.fixture
def api_client():
    """Provide API client"""
    return APIClient()


@pytest.mark.django_db
class TestCurriculumAPI:
    """Test curriculum API endpoints"""
    
    def test_apply_standard_grading(self, api_client):
        """Test applying standard grading"""
        # Create test data
        CompareResultTOR.objects.create(
            account_id="API001",
            subject_code="CS101",
            subject_description="Test",
            total_academic_units=3.0,
            final_grade=1.5
        )
        
        url = reverse('curriculum:apply_standard')
        response = api_client.post(url, {
            'account_id': 'API001'
        }, format='json')
        
        assert response.status_code == status.HTTP_200_OK
        assert response.data['success'] is True
        assert len(response.data['data']) == 1
    
    def test_apply_reverse_grading(self, api_client):
        """Test applying reverse grading"""
        CompareResultTOR.objects.create(
            account_id="API002",
            subject_code="CS101",
            subject_description="Test",
            total_academic_units=3.0,
            final_grade=4.0
        )
        
        url = reverse('curriculum:apply_reverse')
        response = api_client.post(url, {
            'account_id': 'API002'
        }, format='json')
        
        assert response.status_code == status.HTTP_200_OK
        assert response.data['success'] is True
    
    def test_copy_tor_entries(self, api_client):
        """Test copying TOR entries"""
        # Create source data
        TorTransferee.objects.create(
            account_id="API003",
            student_name="Test Student",
            school_name="Test School",
            subject_code="CS101",
            subject_description="Test",
            student_year="1st",
            semester="first",
            school_year_offered="2023-2024",
            total_academic_units=3.0,
            final_grade=2.0
        )
        
        url = reverse('curriculum:copy_tor')
        response = api_client.post(url, {
            'account_id': 'API003'
        }, format='json')
        
        assert response.status_code == status.HTTP_201_CREATED
        assert response.data['success'] is True
        assert response.data['data']['count'] == 1
    
    def test_get_compare_result(self, api_client):
        """Test getting comparison results"""
        CompareResultTOR.objects.create(
            account_id="API004",
            subject_code="CS101",
            subject_description="Test",
            total_academic_units=3.0,
            final_grade=2.0
        )
        
        url = reverse('curriculum:compare_result')
        response = api_client.get(f"{url}?account_id=API004")
        
        assert response.status_code == status.HTTP_200_OK
        assert response.data['success'] is True
        assert len(response.data['data']) == 1
    
    def test_get_cit_tor_content(self, api_client):
        """Test getting CIT content"""
        CitTorContent.objects.create(
            subject_code="CS101",
            description=["Test"],
            units=3
        )
        
        url = reverse('curriculum:cit_tor_content')
        response = api_client.get(url)
        
        assert response.status_code == status.HTTP_200_OK
        assert response.data['success'] is True
        assert len(response.data['data']) >= 1
    
    def test_update_credit_evaluation(self, api_client):
        """Test updating credit evaluation"""
        entry = CompareResultTOR.objects.create(
            account_id="API005",
            subject_code="CS101",
            subject_description="Test",
            total_academic_units=3.0,
            final_grade=2.0
        )
        
        url = reverse('curriculum:update_credit_evaluation')
        response = api_client.post(url, {
            'id': entry.id,
            'credit_evaluation': 'Accepted',
            'notes': 'Test note'
        }, format='json')
        
        assert response.status_code == status.HTTP_200_OK
        assert response.data['success'] is True
        assert response.data['data']['credit_evaluation'] == 'Accepted'
    
    def test_sync_completed(self, api_client):
        """Test syncing with curriculum"""
        CitTorContent.objects.create(
            subject_code="CS101",
            description=["Computer Science"],
            units=3
        )
        
        CompareResultTOR.objects.create(
            account_id="API006",
            subject_code="CSCI101",
            subject_description="Computer Science Intro",
            total_academic_units=3.0,
            final_grade=2.0
        )
        
        url = reverse('curriculum:sync_completed')
        response = api_client.post(url, {
            'account_id': 'API006'
        }, format='json')
        
        assert response.status_code == status.HTTP_200_OK
        assert response.data['success'] is True
        assert len(response.data['data']) == 1
    
    def test_get_comparison_statistics(self, api_client):
        """Test getting statistics"""
        CompareResultTOR.objects.create(
            account_id="API007",
            subject_code="CS101",
            subject_description="Test",
            total_academic_units=3.0,
            final_grade=2.0
        )
        
        url = reverse('curriculum:comparison_statistics')
        response = api_client.get(f"{url}?account_id=API007")
        
        assert response.status_code == status.HTTP_200_OK
        assert response.data['success'] is True
        assert 'total' in response.data['data']