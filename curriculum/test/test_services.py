"""Tests for curriculum services"""
import pytest
from curriculum.services import CurriculumService
from curriculum.models import CompareResultTOR, CitTorContent
from torchecker.models import TorTransferee
from core.exceptions import ValidationException, ResourceNotFoundException


@pytest.mark.django_db
class TestCurriculumService:
    """Test CurriculumService"""
    
    def test_calculate_similarity(self):
        """Test similarity calculation"""
        similarity = CurriculumService.calculate_similarity(
            "Introduction to Programming",
            "Introduction to Computer Programming"
        )
        
        assert similarity > 50.0
        assert similarity <= 100.0
    
    def test_calculate_similarity_exact_match(self):
        """Test exact match similarity"""
        similarity = CurriculumService.calculate_similarity(
            "Data Structures",
            "Data Structures"
        )
        
        assert similarity == 100.0
    
    def test_apply_standard_grading(self):
        """Test standard grading application"""
        # Create test data
        CompareResultTOR.objects.create(
            account_id="GRADE001",
            subject_code="CS101",
            subject_description="Intro to CS",
            total_academic_units=3.0,
            final_grade=1.5
        )
        
        CompareResultTOR.objects.create(
            account_id="GRADE001",
            subject_code="CS102",
            subject_description="Data Structures",
            total_academic_units=3.0,
            final_grade=4.0
        )
        
        # Apply grading
        entries = CurriculumService.apply_standard_grading("GRADE001")
        
        assert len(entries) == 2
        
        # Check remarks
        passing = [e for e in entries if e.subject_code == "CS101"][0]
        failing = [e for e in entries if e.subject_code == "CS102"][0]
        
        assert passing.remarks == "PASSED"
        assert failing.remarks == "FAILED"
    
    def test_apply_reverse_grading(self):
        """Test reverse grading application"""
        # Create test data
        CompareResultTOR.objects.create(
            account_id="REVGRADE001",
            subject_code="CS101",
            subject_description="Intro to CS",
            total_academic_units=3.0,
            final_grade=4.0  # Would be PASSED in reverse
        )
        
        entries = CurriculumService.apply_reverse_grading("REVGRADE001")
        
        assert entries[0].remarks == "PASSED"
    
    def test_apply_grading_no_entries(self):
        """Test grading with no entries"""
        with pytest.raises(ResourceNotFoundException):
            CurriculumService.apply_standard_grading("NONEXISTENT")
    
    def test_copy_tor_entries(self):
        """Test copying TOR entries"""
        # Create transferee entry
        TorTransferee.objects.create(
            account_id="COPY001",
            student_name="John Doe",
            school_name="Previous U",
            subject_code="CS101",
            subject_description="Intro to CS",
            student_year="1st",
            semester="first",
            school_year_offered="2023-2024",
            total_academic_units=3.0,
            final_grade=1.5,
            remarks="PASSED"
        )
        
        # Copy entries
        entries = CurriculumService.copy_tor_entries("COPY001")
        
        assert len(entries) == 1
        assert entries[0].subject_code == "CS101"
        assert entries[0].account_id == "COPY001"
    
    def test_copy_tor_entries_no_source(self):
        """Test copying with no source entries"""
        with pytest.raises(ResourceNotFoundException):
            CurriculumService.copy_tor_entries("NOSOURCE")
    
    def test_sync_curriculum_matching(self):
        """Test curriculum matching sync"""
        # Create CIT content
        CitTorContent.objects.create(
            subject_code="CS101",
            description=["Introduction to Computer Science"],
            units=3
        )
        
        # Create comparison entry
        CompareResultTOR.objects.create(
            account_id="SYNC001",
            subject_code="CSCI101",  # Different code
            subject_description="Intro to Computer Science",  # Similar description
            total_academic_units=3.0,
            final_grade=2.0
        )
        
        # Sync
        results = CurriculumService.sync_curriculum_matching("SYNC001")
        
        assert len(results) == 1
        assert results[0]['match_accuracy'] > 0
        assert results[0]['matched_subject'] is not None
    
    def test_update_credit_evaluation(self):
        """Test updating credit evaluation"""
        entry = CompareResultTOR.objects.create(
            account_id="EVAL001",
            subject_code="CS101",
            subject_description="Test",
            total_academic_units=3.0,
            final_grade=2.0
        )
        
        updated = CurriculumService.update_credit_evaluation(
            entry.id,
            CompareResultTOR.CreditEvaluation.ACCEPTED,
            "Approved by dean"
        )
        
        assert updated.credit_evaluation == CompareResultTOR.CreditEvaluation.ACCEPTED
        assert updated.notes == "Approved by dean"
    
    def test_update_credit_evaluation_invalid(self):
        """Test updating with invalid evaluation"""
        entry = CompareResultTOR.objects.create(
            account_id="EVAL002",
            subject_code="CS102",
            subject_description="Test",
            total_academic_units=3.0,
            final_grade=2.0
        )
        
        with pytest.raises(ValidationException):
            CurriculumService.update_credit_evaluation(
                entry.id,
                "InvalidStatus",
                None
            )
    
    def test_get_comparison_statistics(self):
        """Test getting comparison statistics"""
        # Create various entries
        CompareResultTOR.objects.create(
            account_id="STATS001",
            subject_code="CS101",
            subject_description="Test 1",
            total_academic_units=3.0,
            final_grade=1.5,
            remarks="PASSED",
            credit_evaluation=CompareResultTOR.CreditEvaluation.ACCEPTED
        )
        
        CompareResultTOR.objects.create(
            account_id="STATS001",
            subject_code="CS102",
            subject_description="Test 2",
            total_academic_units=3.0,
            final_grade=4.0,
            remarks="FAILED",
            credit_evaluation=CompareResultTOR.CreditEvaluation.DENIED
        )
        
        stats = CurriculumService.get_comparison_statistics("STATS001")
        
        assert stats['total'] == 2
        assert stats['accepted'] == 1
        assert stats['denied'] == 1
        assert stats['passed'] == 1
        assert stats['failed'] == 1
        assert stats['average_grade'] > 0
        assert stats['total_units'] == 6.0