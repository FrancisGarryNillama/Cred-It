"""Standardized API response wrappers"""
from rest_framework.response import Response
from rest_framework import status
from typing import Any, Optional, Dict, List
from datetime import datetime


class APIResponse:
    """
    Standardized API response wrapper for consistent response format.
    All API endpoints should use these methods.
    """
    
    @staticmethod
    def success(
        data: Any = None,
        message: str = "Success",
        status_code: int = status.HTTP_200_OK,
        meta: Optional[Dict[str, Any]] = None
    ) -> Response:
        """
        Return standardized success response.
        
        Args:
            data: Response data payload
            message: Success message
            status_code: HTTP status code
            meta: Additional metadata (pagination, etc.)
            
        Returns:
            Response object with standardized format
        """
        response_data = {
            'success': True,
            'message': message,
            'data': data,
            'timestamp': datetime.utcnow().isoformat()
        }
        
        if meta:
            response_data['meta'] = meta
        
        return Response(response_data, status=status_code)
    
    @staticmethod
    def error(
        message: str,
        errors: Optional[Dict[str, Any]] = None,
        status_code: int = status.HTTP_400_BAD_REQUEST,
        error_code: Optional[str] = None
    ) -> Response:
        """
        Return standardized error response.
        
        Args:
            message: Error message
            errors: Detailed error information
            status_code: HTTP status code
            error_code: Application-specific error code
            
        Returns:
            Response object with standardized error format
        """
        response_data = {
            'success': False,
            'message': message,
            'timestamp': datetime.utcnow().isoformat()
        }
        
        if errors:
            response_data['errors'] = errors
        
        if error_code:
            response_data['error_code'] = error_code
        
        return Response(response_data, status=status_code)
    
    @staticmethod
    def created(
        data: Any = None,
        message: str = "Resource created successfully"
    ) -> Response:
        """Return created response (201)"""
        return APIResponse.success(data, message, status.HTTP_201_CREATED)
    
    @staticmethod
    def updated(
        data: Any = None,
        message: str = "Resource updated successfully"
    ) -> Response:
        """Return updated response (200)"""
        return APIResponse.success(data, message, status.HTTP_200_OK)
    
    @staticmethod
    def deleted(
        message: str = "Resource deleted successfully"
    ) -> Response:
        """Return deleted response (204 or 200)"""
        return APIResponse.success(None, message, status.HTTP_200_OK)
    
    @staticmethod
    def not_found(
        resource: str = "Resource",
        identifier: Optional[str] = None
    ) -> Response:
        """Return not found response (404)"""
        message = f"{resource} not found"
        if identifier:
            message += f" with identifier '{identifier}'"
        
        return APIResponse.error(
            message,
            status_code=status.HTTP_404_NOT_FOUND,
            error_code='NOT_FOUND'
        )
    
    @staticmethod
    def unauthorized(
        message: str = "Authentication required"
    ) -> Response:
        """Return unauthorized response (401)"""
        return APIResponse.error(
            message,
            status_code=status.HTTP_401_UNAUTHORIZED,
            error_code='UNAUTHORIZED'
        )
    
    @staticmethod
    def forbidden(
        message: str = "Permission denied"
    ) -> Response:
        """Return forbidden response (403)"""
        return APIResponse.error(
            message,
            status_code=status.HTTP_403_FORBIDDEN,
            error_code='FORBIDDEN'
        )
    
    @staticmethod
    def validation_error(
        message: str,
        errors: Dict[str, List[str]]
    ) -> Response:
        """Return validation error response (400)"""
        return APIResponse.error(
            message,
            errors=errors,
            status_code=status.HTTP_400_BAD_REQUEST,
            error_code='VALIDATION_ERROR'
        )
    
    @staticmethod
    def paginated(
        data: List[Any],
        page: int,
        page_size: int,
        total: int,
        message: str = "Success"
    ) -> Response:
        """
        Return paginated response with metadata.
        
        Args:
            data: List of items for current page
            page: Current page number
            page_size: Number of items per page
            total: Total number of items
            message: Success message
            
        Returns:
            Response with pagination metadata
        """
        total_pages = (total + page_size - 1) // page_size  # Ceiling division
        
        meta = {
            'pagination': {
                'page': page,
                'page_size': page_size,
                'total': total,
                'total_pages': total_pages,
                'has_next': page < total_pages,
                'has_previous': page > 1
            }
        }
        
        return APIResponse.success(data, message, meta=meta)
