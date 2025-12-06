"""Tests for curriculum models"""
import pytest
from django.core.exceptions import ValidationError
from curriculum.models import CompareResultTOR, CitTorContent


@pytest.mark.django_db
class TestCompareResultTOR:
    """Test CompareResultTOR model"""
    
    def test_create_compare_result(self):
        """Test creating a comparison result"""
        result = CompareResultTOR.objects.create(
            account_id="TEST001",
            subject_code="CS101",
            subject_description="Introduction to CS",
            total_academic_units=3.0,
            final_grade=1.5
        )
        
        assert result.account_id == "TEST001"
        assert result.subject_code == "CS101"
        assert result.credit_evaluation == CompareResultTOR.CreditEvaluation.VOID
    
    def test_compare_result_properties(self):
        """Test model properties"""
        result = CompareResultTOR.objects.create(
            account_id="TEST002",
            subject_code="CS102",
            subject_description="Data Structures",
            total_academic_units=3.0,
            final_grade=2.0,
            credit_evaluation=CompareResultTOR.CreditEvaluation.ACCEPTED
        )
        
        assert result.is_accepted is True
        assert result.is_denied is False
        assert result.needs_investigation is False
        assert result.is_passing_grade is True
    
    def test_compare_result_failing_grade(self):
        """Test failing grade property"""
        result = CompareResultTOR.objects.create(
            account_id="TEST003",
            subject_code="CS103",
            subject_description="Algorithms",
            total_academic_units=3.0,
            final_grade=4.0
        )
        
        assert result.is_passing_grade is False
    
    def test_unique_together_constraint(self):
        """Test unique together constraint on account_id and subject_code"""
        CompareResultTOR.objects.create(
            account_id="TEST004",
            subject_code="CS104",
            subject_description="Test",
            total_academic_units=3.0,
            final_grade=2.0
        )
        
        with pytest.raises(Exception):  # IntegrityError
            CompareResultTOR.objects.create(
                account_id="TEST004",
                subject_code="CS104",  # Same combination
                subject_description="Duplicate",
                total_academic_units=3.0,
                final_grade=2.0
            )


@pytest.mark.django_db
class TestCitTorContent:
    """Test CitTorContent model"""
    
    def test_create_cit_content(self):
        """Test creating CIT content"""
        content = CitTorContent.objects.create(
            subject_code="CS101",
            prerequisite=["MATH101"],
            description=["Intro to CS", "Computer Science Basics"],
            units=3
        )
        
        assert content.subject_code == "CS101"
        assert content.units == 3
        assert content.is_active is True
    
    def test_cit_content_properties(self):
        """Test model properties"""
        content = CitTorContent.objects.create(
            subject_code="CS102",
            prerequisite=["CS101", "MATH101"],
            description=["Data Structures"],
            units=3
        )
        
        assert content.has_prerequisites is True
        assert "Data Structures" in content.description_text
    
    def test_cit_content_no_prerequisites(self):
        """Test content without prerequisites"""
        content = CitTorContent.objects.create(
            subject_code="CS100",
            prerequisite=[],
            description=["Intro Course"],
            units=3
        )
        
        assert content.has_prerequisites is False
    
    def test_cit_content_validation(self):
        """Test validation for minimum units"""
        with pytest.raises(ValidationError):
            content = CitTorContent(
                subject_code="CS200",
                units=0  # Invalid
            )
            content.full_clean()