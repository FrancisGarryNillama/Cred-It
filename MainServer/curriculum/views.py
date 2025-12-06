"""
API views for curriculum operations.
Views are thin - business logic is in services.
"""
from rest_framework.decorators import api_view
from rest_framework import status
from core.responses import APIResponse
from core.exceptions import ServiceException
from core.decorators import handle_service_exceptions
from .services import CurriculumService
from .serializers import (
    CompareResultTORSerializer,
    CitTorContentSerializer,
    ApplyGradingSerializer,
    UpdateCreditEvaluationSerializer,
    UpdateNoteSerializer,
    UpdateCitTorEntrySerializer,
    UpdateTorResultsSerializer
)
from .models import CompareResultTOR, CitTorContent
import logging

logger = logging.getLogger(__name__)


@api_view(['POST'])
@handle_service_exceptions
def apply_standard(request):
    """
    Apply standard grading system (1.0-2.9 = PASSED).
    
    POST /api/apply-standard/
    
    Request:
        {
            "account_id": "STUDENT001"
        }
    """
    serializer = ApplyGradingSerializer(data=request.data)
    
    if not serializer.is_valid():
        return APIResponse.validation_error(
            "Validation failed",
            serializer.errors
        )
    
    entries = CurriculumService.apply_standard_grading(
        serializer.validated_data['account_id']
    )
    
    result_serializer = CompareResultTORSerializer(entries, many=True)
    
    return APIResponse.success(
        data=result_serializer.data,
        message=f"Standard grading applied to {len(entries)} entries"
    )


@api_view(['POST'])
@handle_service_exceptions
def apply_reverse(request):
    """
    Apply reverse grading system (3.0-5.0 = PASSED).
    
    POST /api/apply-reverse/
    
    Request:
        {
            "account_id": "STUDENT001"
        }
    """
    serializer = ApplyGradingSerializer(data=request.data)
    
    if not serializer.is_valid():
        return APIResponse.validation_error(
            "Validation failed",
            serializer.errors
        )
    
    entries = CurriculumService.apply_reverse_grading(
        serializer.validated_data['account_id']
    )
    
    result_serializer = CompareResultTORSerializer(entries, many=True)
    
    return APIResponse.success(
        data=result_serializer.data,
        message=f"Reverse grading applied to {len(entries)} entries"
    )


@api_view(['POST'])
@handle_service_exceptions
def copy_tor_entries(request):
    """
    Copy TOR entries from transferee table to comparison table.
    
    POST /api/copy-tor/
    
    Request:
        {
            "account_id": "STUDENT001"
        }
    """
    serializer = ApplyGradingSerializer(data=request.data)
    
    if not serializer.is_valid():
        return APIResponse.validation_error(
            "Validation failed",
            serializer.errors
        )
    
    entries = CurriculumService.copy_tor_entries(
        serializer.validated_data['account_id']
    )
    
    return APIResponse.created(
        data={"count": len(entries)},
        message=f"Copied {len(entries)} TOR entries successfully"
    )


@api_view(['POST'])
@handle_service_exceptions
def sync_completed(request):
    """
    Sync TOR entries with curriculum matching.
    
    POST /api/sync-completed/
    
    Request:
        {
            "account_id": "STUDENT001"
        }
    """
    serializer = ApplyGradingSerializer(data=request.data)
    
    if not serializer.is_valid():
        return APIResponse.validation_error(
            "Validation failed",
            serializer.errors
        )
    
    results = CurriculumService.sync_curriculum_matching(
        serializer.validated_data['account_id']
    )
    
    return APIResponse.success(
        data=results,
        message=f"Synced {len(results)} entries with curriculum matching"
    )


@api_view(['GET'])
def get_compare_result(request):
    """
    Get comparison results with optional filtering.
    
    GET /api/compareResultTOR/?account_id=STUDENT001
    """
    account_id = request.GET.get('account_id')
    
    queryset = CompareResultTOR.objects.all()
    
    if account_id:
        queryset = queryset.filter(account_id=account_id)
    
    # Apply additional filters if provided
    credit_evaluation = request.GET.get('credit_evaluation')
    if credit_evaluation:
        queryset = queryset.filter(credit_evaluation=credit_evaluation)
    
    serializer = CompareResultTORSerializer(queryset, many=True)
    
    return APIResponse.success(serializer.data)


@api_view(['GET'])
def get_cit_tor_content(request):
    """
    Get CIT curriculum content.
    
    GET /api/citTorContent/
    """
    queryset = CitTorContent.objects.filter(is_active=True)
    
    # Optional filtering by subject code
    subject_code = request.GET.get('subject_code')
    if subject_code:
        queryset = queryset.filter(subject_code__icontains=subject_code)
    
    serializer = CitTorContentSerializer(queryset, many=True)
    
    return APIResponse.success(serializer.data)


@api_view(['POST'])
@handle_service_exceptions
def update_credit_evaluation(request):
    """
    Update credit evaluation status.
    
    POST /api/update_credit_evaluation/
    
    Request:
        {
            "id": 1,
            "credit_evaluation": "Accepted",
            "notes": "Approved by department head"
        }
    """
    serializer = UpdateCreditEvaluationSerializer(data=request.data)
    
    if not serializer.is_valid():
        return APIResponse.validation_error(
            "Validation failed",
            serializer.errors
        )
    
    entry = CurriculumService.update_credit_evaluation(
        entry_id=serializer.validated_data['id'],
        evaluation=serializer.validated_data['credit_evaluation'],
        notes=serializer.validated_data.get('notes')
    )
    
    result_serializer = CompareResultTORSerializer(entry)
    
    return APIResponse.success(
        data=result_serializer.data,
        message="Credit evaluation updated successfully"
    )


@api_view(['POST'])
@handle_service_exceptions
def update_note(request):
    """
    Update notes for a TOR entry.
    
    POST /api/update_note/
    
    Request:
        {
            "id": 1,
            "notes": "Additional notes here"
        }
    """
    serializer = UpdateNoteSerializer(data=request.data)
    
    if not serializer.is_valid():
        return APIResponse.validation_error(
            "Validation failed",
            serializer.errors
        )
    
    entry = CurriculumService.update_credit_evaluation(
        entry_id=serializer.validated_data['id'],
        evaluation=None,  # Don't change evaluation
        notes=serializer.validated_data['notes']
    )
    
    result_serializer = CompareResultTORSerializer(entry)
    
    return APIResponse.success(
        data=result_serializer.data,
        message="Note updated successfully"
    )


@api_view(['POST'])
@handle_service_exceptions
def update_cit_tor_entry(request):
    """
    Update a CIT TOR curriculum entry.
    
    POST /api/update_cit_tor_entry/
    
    Request:
        {
            "id": 1,
            "subject_code": "CS101",
            "description": ["Intro to CS", "Computer Science"],
            "units": 3
        }
    """
    serializer = UpdateCitTorEntrySerializer(data=request.data)
    
    if not serializer.is_valid():
        return APIResponse.validation_error(
            "Validation failed",
            serializer.errors
        )
    
    try:
        entry = CitTorContent.objects.get(id=serializer.validated_data['id'])
    except CitTorContent.DoesNotExist:
        return APIResponse.not_found("CitTorContent", str(serializer.validated_data['id']))
    
    # Update fields if provided
    if 'subject_code' in serializer.validated_data:
        entry.subject_code = serializer.validated_data['subject_code']
    if 'description' in serializer.validated_data:
        entry.description = serializer.validated_data['description']
    if 'units' in serializer.validated_data:
        entry.units = serializer.validated_data['units']
    
    entry.save()
    
    result_serializer = CitTorContentSerializer(entry)
    
    return APIResponse.success(
        data=result_serializer.data,
        message="CIT TOR entry updated successfully"
    )


@api_view(['POST'])
@handle_service_exceptions
def update_tor_results(request):
    """
    Update TOR results by deleting failed subjects and updating passed ones.
    
    POST /api/update-tor-results/
    
    Request:
        {
            "account_id": "STUDENT001",
            "failed_subjects": ["CS101", "MATH101"],
            "passed_subjects": [
                {"subject_code": "CS102", "remarks": "PASSED"}
            ]
        }
    """
    serializer = UpdateTorResultsSerializer(data=request.data)
    
    if not serializer.is_valid():
        return APIResponse.validation_error(
            "Validation failed",
            serializer.errors
        )
    
    result = CurriculumService.update_tor_results(
        account_id=serializer.validated_data['account_id'],
        failed_subjects=serializer.validated_data.get('failed_subjects', []),
        passed_subjects=serializer.validated_data.get('passed_subjects', [])
    )
    
    return APIResponse.success(
        data=result,
        message="TOR results updated successfully"
    )


@api_view(['GET'])
@handle_service_exceptions
def tracker_accreditation(request):
    """
    Get accreditation tracking data.
    
    GET /api/tracker_accreditation/?account_id=STUDENT001
    """
    account_id = request.GET.get('account_id')
    
    if not account_id:
        return APIResponse.error("account_id parameter is required")
    
    results = CurriculumService.get_tracker_accreditation(account_id)
    
    return APIResponse.success(results)


@api_view(['GET'])
@handle_service_exceptions
def get_comparison_statistics(request):
    """
    Get comparison statistics for a student.
    
    GET /api/comparison-statistics/?account_id=STUDENT001
    """
    account_id = request.GET.get('account_id')
    
    if not account_id:
        return APIResponse.error("account_id parameter is required")
    
    stats = CurriculumService.get_comparison_statistics(account_id)
    
    return APIResponse.success(stats)