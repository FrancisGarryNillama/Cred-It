"""
Business logic for TOR management operations.
"""
from typing import List, Dict, Optional
from django.db import transaction
from core.exceptions import (
    ValidationException,
    ResourceNotFoundException
)
from core.decorators import log_execution, atomic_transaction
from ..models import TorTransferee
import logging

logger = logging.getLogger(__name__)


class TorService:
    """
    Service for managing TOR transferee records.
    """
    
    @staticmethod
    @atomic_transaction
    @log_execution
    def save_tor_entries(
        account_id: str,
        student_name: str,
        school_name: str,
        entries: List[Dict]
    ) -> List[TorTransferee]:
        """
        Save multiple TOR entries for a student.
        
        Args:
            account_id: Student account ID
            student_name: Student's full name
            school_name: Previous school name
            entries: List of subject entry dictionaries
            
        Returns:
            List of created TorTransferee instances
        """
        if not account_id:
            raise ValidationException("account_id is required")
        
        if not entries:
            raise ValidationException("No entries provided")
        
        saved_entries = []
        
        for entry in entries:
            tor_entry = TorTransferee.objects.create(
                account_id=account_id,
                student_name=student_name or "Unknown",
                school_name=school_name or "Unknown",
                subject_code=entry.get('subject_code', ''),
                subject_description=entry.get('subject_description', ''),
                student_year=entry.get('student_year', ''),
                pre_requisite=entry.get('pre_requisite', ''),
                co_requisite=entry.get('co_requisite', ''),
                semester=entry.get('semester', 'first'),
                school_year_offered=entry.get('school_year_offered', ''),
                total_academic_units=entry.get('total_academic_units', 0.0),
                final_grade=entry.get('final_grade', 0.0),
                remarks=entry.get('remarks', '')
            )
            saved_entries.append(tor_entry)
        
        logger.info(
            f"Saved {len(saved_entries)} TOR entries for account: {account_id}"
        )
        
        return saved_entries
    
    @staticmethod
    def get_tor_entries(
        account_id: Optional[str] = None,
        student_name: Optional[str] = None
    ) -> List[TorTransferee]:
        """
        Get TOR entries with optional filtering.
        
        Args:
            account_id: Filter by account ID
            student_name: Filter by student name
            
        Returns:
            List of TorTransferee instances
        """
        queryset = TorTransferee.objects.all()
        
        if account_id:
            queryset = queryset.filter(account_id=account_id)
        
        if student_name:
            queryset = queryset.filter(student_name__icontains=student_name)
        
        return list(queryset)
    
    @staticmethod
    def get_unique_students() -> List[Dict[str, str]]:
        """
        Get unique student/school combinations.
        
        Returns:
            List of dictionaries with student_name and school_name
        """
        unique = TorTransferee.objects.values(
            'student_name',
            'school_name'
        ).distinct()
        
        return list(unique)
    
    @staticmethod
    @log_execution
    def delete_tor_entries(account_id: str) -> int:
        """
        Delete all TOR entries for an account.
        
        Args:
            account_id: Account identifier
            
        Returns:
            Number of entries deleted
        """
        if not account_id:
            raise ValidationException("account_id is required")
        
        count, _ = TorTransferee.objects.filter(
            account_id=account_id
        ).delete()
        
        logger.info(f"Deleted {count} TOR entries for account: {account_id}")
        
        return count
    
    @staticmethod
    def get_tor_statistics(account_id: str) -> Dict[str, any]:
        """
        Get statistics for TOR entries.
        
        Args:
            account_id: Account identifier
            
        Returns:
            Dictionary with statistics
        """
        from django.db.models import Count, Avg, Sum
        
        entries = TorTransferee.objects.filter(account_id=account_id)
        
        if not entries.exists():
            return {
                'total_subjects': 0,
                'total_units': 0,
                'average_grade': 0,
                'passed': 0,
                'failed': 0
            }
        
        stats = {
            'total_subjects': entries.count(),
            'total_units': entries.aggregate(Sum('total_academic_units'))['total_academic_units__sum'] or 0,
            'average_grade': entries.aggregate(Avg('final_grade'))['final_grade__avg'] or 0,
            'passed': entries.filter(remarks__iexact='PASSED').count(),
            'failed': entries.filter(remarks__iexact='FAILED').count(),
        }
        
        # Round average grade
        stats['average_grade'] = round(stats['average_grade'], 2)
        
        return stats