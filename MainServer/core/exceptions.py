"""Custom exception handlers and error responses"""
from rest_framework.views import exception_handler
from rest_framework.response import Response
from rest_framework import status
from typing import Optional, Dict, Any
import logging

logger = logging.getLogger(__name__)


def custom_exception_handler(exc: Exception, context: Dict[str, Any]) -> Optional[Response]:
    """
    Custom exception handler for consistent error responses across the API.
    
    Args:
        exc: The exception instance
        context: Context dictionary containing view and request info
        
    Returns:
        Response object with standardized error format or None
    """
    # Call REST framework's default exception handler first
    response = exception_handler(exc, context)
    
    if response is not None:
        # Standardize error response format
        custom_response_data = {
            'success': False,
            'error': True,
            'message': str(exc),
            'details': response.data,
            'status_code': response.status_code
        }
        response.data = custom_response_data
    else:
        # Log unhandled exceptions
        logger.error(
            f"Unhandled exception in {context.get('view', 'unknown view')}: {exc}",
            exc_info=True,
            extra={'request': context.get('request')}
        )
        
    return response


class ServiceException(Exception):
    """
    Base exception for service layer errors.
    All custom service exceptions should inherit from this.
    """
    def __init__(
        self,
        message: str,
        status_code: int = status.HTTP_400_BAD_REQUEST,
        error_code: Optional[str] = None
    ):
        self.message = message
        self.status_code = status_code
        self.error_code = error_code or 'SERVICE_ERROR'
        super().__init__(self.message)
    
    def to_dict(self) -> Dict[str, Any]:
        """Convert exception to dictionary format"""
        return {
            'error_code': self.error_code,
            'message': self.message,
            'status_code': self.status_code
        }


class ResourceNotFoundException(ServiceException):
    """Raised when a requested resource is not found"""
    def __init__(self, resource: str, identifier: str):
        message = f"{resource} with identifier '{identifier}' not found"
        super().__init__(message, status.HTTP_404_NOT_FOUND, 'RESOURCE_NOT_FOUND')
        self.resource = resource
        self.identifier = identifier


class ValidationException(ServiceException):
    """Raised when validation fails"""
    def __init__(self, message: str, field: Optional[str] = None):
        super().__init__(message, status.HTTP_400_BAD_REQUEST, 'VALIDATION_ERROR')
        self.field = field


class AuthenticationException(ServiceException):
    """Raised when authentication fails"""
    def __init__(self, message: str = "Authentication failed"):
        super().__init__(message, status.HTTP_401_UNAUTHORIZED, 'AUTHENTICATION_ERROR')


class PermissionException(ServiceException):
    """Raised when user doesn't have required permissions"""
    def __init__(self, message: str = "Permission denied"):
        super().__init__(message, status.HTTP_403_FORBIDDEN, 'PERMISSION_ERROR')


class DuplicateResourceException(ServiceException):
    """Raised when attempting to create a duplicate resource"""
    def __init__(self, resource: str, identifier: str):
        message = f"{resource} with identifier '{identifier}' already exists"
        super().__init__(message, status.HTTP_409_CONFLICT, 'DUPLICATE_RESOURCE')


class BusinessLogicException(ServiceException):
    """Raised when business logic rules are violated"""
    def __init__(self, message: str):
        super().__init__(message, status.HTTP_422_UNPROCESSABLE_ENTITY, 'BUSINESS_LOGIC_ERROR')
