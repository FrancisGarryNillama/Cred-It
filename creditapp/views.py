"""
API views for credit account operations.
Views should be thin - business logic is in services.
"""
from rest_framework.decorators import api_view
from rest_framework import status
from core.responses import APIResponse
from core.exceptions import ServiceException
from core.decorators import handle_service_exceptions
from .services import CreditAccountService
from .serializers import (
    RegisterSerializer,
    LoginSerializer,
    PasswordChangeSerializer,
    CreditAccountSerializer
)
import logging

logger = logging.getLogger(__name__)


@api_view(['POST'])
@handle_service_exceptions
def register_credit_profile(request):
    """
    Register a new credit account.
    
    POST /api/register/
    
    Request body:
        {
            "account_id": "STUDENT001",
            "account_pass": "password123",
            "status": "Student"  // optional, defaults to Student
        }
    
    Response:
        {
            "success": true,
            "message": "Account registered successfully",
            "data": {
                "account_id": "STUDENT001",
                "status": "Student"
            }
        }
    """
    serializer = RegisterSerializer(data=request.data)
    
    if not serializer.is_valid():
        return APIResponse.validation_error(
            "Validation failed",
            serializer.errors
        )
    
    # Create account using service
    account = CreditAccountService.register_account(
        account_id=serializer.validated_data['account_id'],
        account_pass=serializer.validated_data['account_pass'],
        status=serializer.validated_data.get('status', 'Student')
    )
    
    return APIResponse.created(
        data={
            'account_id': account.account_id,
            'status': account.status
        },
        message="Account registered successfully"
    )


@api_view(['POST'])
@handle_service_exceptions
def login_credit_profile(request):
    """
    Login to credit account.
    
    POST /api/login/
    
    Request body:
        {
            "account_id": "STUDENT001",
            "account_pass": "password123"
        }
    
    Response:
        {
            "success": true,
            "message": "Login successful",
            "data": {
                "account_id": "STUDENT001",
                "status": "Student",
                "last_login": "2024-01-15T10:30:00Z"
            }
        }
    """
    serializer = LoginSerializer(data=request.data)
    
    if not serializer.is_valid():
        return APIResponse.validation_error(
            "Validation failed",
            serializer.errors
        )
    
    # Authenticate using service
    result = CreditAccountService.authenticate_account(
        account_id=serializer.validated_data['account_id'],
        account_pass=serializer.validated_data['account_pass']
    )
    
    return APIResponse.success(
        data=result,
        message="Login successful"
    )


@api_view(['POST'])
@handle_service_exceptions
def change_password(request):
    """
    Change account password.
    
    POST /api/change-password/
    
    Request body:
        {
            "account_id": "STUDENT001",
            "old_password": "oldpass123",
            "new_password": "newpass123"
        }
    """
    serializer = PasswordChangeSerializer(data=request.data)
    
    if not serializer.is_valid():
        return APIResponse.validation_error(
            "Validation failed",
            serializer.errors
        )
    
    CreditAccountService.update_password(
        account_id=serializer.validated_data['account_id'],
        old_password=serializer.validated_data['old_password'],
        new_password=serializer.validated_data['new_password']
    )
    
    return APIResponse.success(
        message="Password changed successfully"
    )


@api_view(['GET'])
def get_account_info(request):
    """
    Get account information.
    
    GET /api/account/<account_id>/
    """
    account_id = request.GET.get('account_id')
    
    if not account_id:
        return APIResponse.error("account_id parameter is required")
    
    try:
        account = CreditAccountService.get_account(account_id)
        serializer = CreditAccountSerializer(account)
        return APIResponse.success(serializer.data)
    except ServiceException as e:
        return APIResponse.error(e.message, status_code=e.status_code)


@api_view(['GET'])
def get_statistics(request):
    """
    Get account statistics.
    
    GET /api/statistics/
    
    Response:
        {
            "success": true,
            "data": {
                "Student": 150,
                "Faculty": 20,
                "Admin": 5,
                "total": 175,
                "active": 170,
                "inactive": 5
            }
        }
    """
    stats = CreditAccountService.get_account_statistics()
    return APIResponse.success(stats)