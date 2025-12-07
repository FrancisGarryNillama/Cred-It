"""
Views for pendingRequest app using WorkflowService.
"""
from rest_framework.decorators import api_view
from core.responses import APIResponse
from core.exceptions import ServiceException
from core.decorators import handle_service_exceptions
from core.services.workflow import WorkflowService
from .models import PendingRequest
from .serializers import PendingRequestSerializer
from finalDocuments.models import listFinalTor
import logging

logger = logging.getLogger(__name__)


@api_view(['GET'])
def list_pending_requests(request):
    """
    Get all pending requests.
    
    GET /api/pendingRequest/
    """
    requests = WorkflowService.get_workflow_records(
        model=PendingRequest,
        order_by=['-request_date']
    )
    
    serializer = PendingRequestSerializer(requests, many=True)
    return APIResponse.success(serializer.data)


@api_view(['POST'])
@handle_service_exceptions
def update_pending_request_status(request):
    """
    Update status of a pending request.
    
    POST /api/pendingRequest/update_status/
    
    Request:
        {
            "applicant_id": "STUDENT001",
            "status": "Accepted"
        }
    """
    applicant_id = request.data.get("applicant_id")
    new_status = request.data.get("status")
    
    updated = WorkflowService.update_status(
        model=PendingRequest,
        account_id=applicant_id,
        new_status=new_status,
        field_name='applicant_id'
    )
    
    serializer = PendingRequestSerializer(updated)
    
    return APIResponse.success(
        serializer.data,
        f"Status updated to {new_status}"
    )


@api_view(['POST'])
@handle_service_exceptions
def update_status_for_document(request):
    """
    Update status specifically for document review.
    
    POST /api/pendingRequest/update_status_for_document/
    """
    applicant_id = request.data.get("applicant_id")
    new_status = request.data.get("status")
    
    updated = WorkflowService.update_status(
        model=PendingRequest,
        account_id=applicant_id,
        new_status=new_status,
        field_name='applicant_id'
    )
    
    serializer = PendingRequestSerializer(updated)
    
    return APIResponse.success(
        serializer.data,
        "Status updated successfully"
    )


@api_view(['POST'])
@handle_service_exceptions
def finalize_pending_request(request):
    """
    Finalize pending request and move to final documents.
    
    POST /api/pendingRequest/finalize/
    
    Request:
        {
            "account_id": "STUDENT001"
        }
    """
    account_id = request.data.get("account_id")
    
    # Transition to final stage
    WorkflowService.transition_to_next_stage(
        account_id=account_id,
        from_model=PendingRequest,
        to_model=listFinalTor,
        from_field='applicant_id',
        to_field='accountID',
        status_update='Finalized',
        delete_from=True
    )
    
    return APIResponse.success(
        message="Request finalized and moved to final documents"
    )


@api_view(['GET'])
@handle_service_exceptions
def track_user_progress(request):
    """
    Check if user has a request in this stage.
    
    GET /api/pendingRequest/track_user_progress/?applicant_id=STUDENT001
    """
    applicant_id = request.GET.get('applicant_id')
    
    exists = WorkflowService.check_progress(
        model=PendingRequest,
        account_id=applicant_id,
        field_name='applicant_id'
    )
    
    return APIResponse.success({'exists': exists})
