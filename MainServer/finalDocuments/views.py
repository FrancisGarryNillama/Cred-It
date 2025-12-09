"""
Views for finalDocuments app using WorkflowService.
"""
from rest_framework.decorators import api_view
from core.responses import APIResponse
from core.exceptions import ServiceException
from core.decorators import handle_service_exceptions
from core.services.workflow import WorkflowService
from .models import listFinalTor
from .serializers import listFinalTorSerializer
from pendingRequest.models import PendingRequest
import logging

logger = logging.getLogger(__name__)


@api_view(['POST'])
@handle_service_exceptions
def finalize_request(request):
    """
    Finalize request from pending to final documents.
    
    POST /api/finalDocuments/finalize_request/
    
    Request:
        {
            "account_id": "STUDENT001"
        }
    """
    account_id = request.data.get("account_id")
    
    # Transition using WorkflowService
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
        message="Request finalized successfully"
    )


@api_view(['GET'])
def get_all_final_tor(request):
    """
    Get all finalized TOR documents.
    
    GET /api/finalDocuments/listFinalTor/
    """
    documents = WorkflowService.get_workflow_records(
        model=listFinalTor,
        order_by=['-accepted_date']
    )
    
    serializer = listFinalTorSerializer(documents, many=True)
    return APIResponse.success(serializer.data)


@api_view(['GET'])
@handle_service_exceptions
def track_user_progress(request):
    """
    Check if user has finalized documents.
    
    GET /api/finalDocuments/track_user_progress/?accountID=STUDENT001
    """
    account_id = request.GET.get('accountID')
    
    documents = WorkflowService.get_workflow_records(
        model=listFinalTor,
        account_id=account_id,
        field_name='accountID',
        order_by=['-accepted_date']
    )
    
    data = []
    if documents.exists():
        for doc in documents[:5]:
            data.append({
                'id': doc.id,
                'account_id': doc.accountID,
                'created_at': doc.accepted_date or doc.request_date,
                'status': doc.status,
                'type': 'final'
            })
            
    return APIResponse.success({'data': data, 'exists': len(data) > 0})


@api_view(['GET'])
def get_workflow_statistics(request):
    """
    Get statistics across all workflow stages.
    
    GET /api/finalDocuments/statistics/
    """
    from requestTOR.models import RequestTOR
    
    stats = {
        'request_stage': WorkflowService.get_workflow_statistics(RequestTOR),
        'pending_stage': WorkflowService.get_workflow_statistics(PendingRequest),
        'final_stage': WorkflowService.get_workflow_statistics(listFinalTor)
    }
    
    return APIResponse.success(stats)