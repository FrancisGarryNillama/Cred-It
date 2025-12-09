"""
API views for profile operations.
Views are thin - business logic is in services.
"""
from rest_framework.decorators import api_view
from rest_framework import status
from core.responses import APIResponse
from core.exceptions import ServiceException
from core.decorators import handle_service_exceptions
from .services import ProfileService
from .serializers import (
    ProfileSerializer,
    ProfileCreateSerializer,
    ProfileUpdateSerializer
)
import logging

logger = logging.getLogger(__name__)


@api_view(['POST'])
@handle_service_exceptions
def save_profile(request):
    """
    Save profile (create or update).
    
    POST /api/profile/save/
    
    Request:
        {
            "user_id": "STUDENT001",
            "name": "John Doe",
            "school_name": "Previous University",
            "email": "john@example.com",
            "phone": "1234567890"
        }
    """
    serializer = ProfileCreateSerializer(data=request.data)
    
    if not serializer.is_valid():
        return APIResponse.validation_error(
            "Validation failed",
            serializer.errors
        )
    
    try:
        profile = ProfileService.save_profile(**serializer.validated_data)
    except Exception as e:
        # Handle Django ValidationError
        if hasattr(e, 'message_dict'):
            # Extract first error message
            errors = e.message_dict
            first_field = list(errors.keys())[0]
            first_error = errors[first_field][0] if isinstance(errors[first_field], list) else errors[first_field]
            return APIResponse.error(first_error)
        raise
    
    result_serializer = ProfileSerializer(profile)
    
    return APIResponse.success(
        data=result_serializer.data,
        message="Profile saved successfully"
    )


@api_view(['GET'])
@handle_service_exceptions
def get_profile(request, user_id):
    """
    Get profile by user_id.
    
    GET /api/profile/<user_id>/
    """
    profile = ProfileService.get_profile(user_id)
    serializer = ProfileSerializer(profile)
    
    return APIResponse.success(serializer.data)


@api_view(['GET'])
def get_profiles(request):
    """
    Get all profiles with optional filtering.
    
    GET /api/profile/?is_complete=true&search=john
    """
    # Get query parameters
    is_complete = request.GET.get('is_complete')
    search = request.GET.get('search')
    user_id = request.GET.get('user_id')
    
    # Convert is_complete to boolean if provided
    if is_complete is not None:
        is_complete = is_complete.lower() == 'true'
    
    # If user_id is provided, return single profile
    if user_id:
        try:
            profile = ProfileService.get_profile(user_id)
            serializer = ProfileSerializer([profile], many=True)
            return APIResponse.success(serializer.data)
        except ServiceException as e:
            return APIResponse.error(e.message, status_code=e.status_code)
    
    # Get all profiles with filters
    profiles = ProfileService.get_all_profiles(
        is_complete=is_complete,
        search=search
    )
    
    serializer = ProfileSerializer(profiles, many=True)
    
    return APIResponse.success(serializer.data)


@api_view(['PUT'])
@handle_service_exceptions
def update_profile(request, user_id):
    """
    Update an existing profile.
    
    PUT /api/profile/<user_id>/
    
    Request:
        {
            "name": "John Doe Updated",
            "email": "newemail@example.com"
        }
    """
    serializer = ProfileUpdateSerializer(data=request.data)
    
    if not serializer.is_valid():
        return APIResponse.validation_error(
            "Validation failed",
            serializer.errors
        )
    
    profile = ProfileService.update_profile(
        user_id=user_id,
        **serializer.validated_data
    )
    
    result_serializer = ProfileSerializer(profile)
    
    return APIResponse.updated(
        data=result_serializer.data,
        message="Profile updated successfully"
    )


@api_view(['DELETE'])
@handle_service_exceptions
def delete_profile(request, user_id):
    """
    Delete a profile.
    
    DELETE /api/profile/<user_id>/
    """
    ProfileService.delete_profile(user_id)
    
    return APIResponse.deleted(
        message=f"Profile for user {user_id} deleted successfully"
    )


@api_view(['GET'])
def check_profile_exists(request):
    """
    Check if profile exists for a user.
    
    GET /api/profile/exists/?user_id=STUDENT001
    """
    user_id = request.GET.get('user_id')
    
    if not user_id:
        return APIResponse.error("user_id parameter is required")
    
    exists = ProfileService.check_profile_exists(user_id)
    
    return APIResponse.success({
        'exists': exists,
        'user_id': user_id
    })


@api_view(['GET'])
def get_incomplete_profiles(request):
    """
    Get all incomplete profiles.
    
    GET /api/profile/incomplete/
    """
    profiles = ProfileService.get_incomplete_profiles()
    serializer = ProfileSerializer(profiles, many=True)
    
    return APIResponse.success(serializer.data)


@api_view(['GET'])
def get_profile_statistics(request):
    """
    Get profile statistics.
    
    GET /api/profile/statistics/
    """
    stats = ProfileService.get_profile_statistics()
    
    return APIResponse.success(stats)