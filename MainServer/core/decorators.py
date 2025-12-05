"""Custom decorators for views and services"""
import functools
import logging
import time
from typing import Callable, Any
from django.db import transaction
from django.core.cache import cache

logger = logging.getLogger(__name__)


def log_execution(func: Callable) -> Callable:
    """
    Decorator to log function execution with timing.
    
    Args:
        func: Function to decorate
        
    Returns:
        Wrapped function with logging
    """
    @functools.wraps(func)
    def wrapper(*args, **kwargs):
        func_name = f"{func.__module__}.{func.__name__}"
        logger.info(f"Executing {func_name}")
        start_time = time.time()
        
        try:
            result = func(*args, **kwargs)
            execution_time = time.time() - start_time
            logger.info(
                f"Successfully executed {func_name} in {execution_time:.2f}s"
            )
            return result
        except Exception as e:
            execution_time = time.time() - start_time
            logger.error(
                f"Error in {func_name} after {execution_time:.2f}s: {str(e)}",
                exc_info=True
            )
            raise
    
    return wrapper


def atomic_transaction(func: Callable) -> Callable:
    """
    Decorator to wrap function in atomic database transaction.
    Ensures all database operations succeed or none are committed.
    
    Args:
        func: Function to decorate
        
    Returns:
        Wrapped function with transaction handling
    """
    @functools.wraps(func)
    def wrapper(*args, **kwargs):
        with transaction.atomic():
            return func(*args, **kwargs)
    
    return wrapper


def cache_result(timeout: int = 300, key_prefix: str = None) -> Callable:
    """
    Decorator to cache function results.
    
    Args:
        timeout: Cache timeout in seconds (default: 5 minutes)
        key_prefix: Prefix for cache key (default: function name)
        
    Returns:
        Wrapped function with caching
    """
    def decorator(func: Callable) -> Callable:
        @functools.wraps(func)
        def wrapper(*args, **kwargs):
            # Generate cache key
            prefix = key_prefix or f"{func.__module__}.{func.__name__}"
            cache_key = f"{prefix}:{str(args)}:{str(kwargs)}"
            
            # Try to get from cache
            result = cache.get(cache_key)
            if result is not None:
                logger.debug(f"Cache hit for {cache_key}")
                return result
            
            # Execute function and cache result
            logger.debug(f"Cache miss for {cache_key}")
            result = func(*args, **kwargs)
            cache.set(cache_key, result, timeout)
            
            return result
        
        return wrapper
    
    return decorator


def require_account_id(func: Callable) -> Callable:
    """
    Decorator to ensure account_id is provided in request data.
    
    Args:
        func: View function to decorate
        
    Returns:
        Wrapped function with account_id validation
    """
    @functools.wraps(func)
    def wrapper(request, *args, **kwargs):
        from core.responses import APIResponse
        
        account_id = request.data.get('account_id') or request.GET.get('account_id')
        
        if not account_id:
            return APIResponse.error(
                "account_id is required",
                error_code='MISSING_ACCOUNT_ID'
            )
        
        return func(request, *args, **kwargs)
    
    return wrapper


def handle_service_exceptions(func: Callable) -> Callable:
    """
    Decorator to handle service layer exceptions and convert to API responses.
    
    Args:
        func: View function to decorate
        
    Returns:
        Wrapped function with exception handling
    """
    @functools.wraps(func)
    def wrapper(*args, **kwargs):
        from core.exceptions import ServiceException
        from core.responses import APIResponse
        from rest_framework import status as http_status
        
        try:
            return func(*args, **kwargs)
        except ServiceException as e:
            logger.warning(f"Service exception: {e.message}")
            return APIResponse.error(
                e.message,
                status_code=e.status_code,
                error_code=e.error_code
            )
        except Exception as e:
            logger.error(f"Unexpected error: {str(e)}", exc_info=True)
            return APIResponse.error(
                "An unexpected error occurred",
                status_code=http_status.HTTP_500_INTERNAL_SERVER_ERROR,
                error_code='INTERNAL_ERROR'
            )
    
    return wrapper


def rate_limit(max_calls: int = 10, period: int = 60) -> Callable:
    """
    Simple rate limiting decorator using cache.
    
    Args:
        max_calls: Maximum number of calls allowed
        period: Time period in seconds
        
    Returns:
        Wrapped function with rate limiting
    """
    def decorator(func: Callable) -> Callable:
        @functools.wraps(func)
        def wrapper(request, *args, **kwargs):
            from core.responses import APIResponse
            from rest_framework import status
            
            # Generate rate limit key (use IP or user ID)
            identifier = request.META.get('REMOTE_ADDR', 'unknown')
            if hasattr(request, 'user') and request.user.is_authenticated:
                identifier = f"user_{request.user.id}"
            
            cache_key = f"rate_limit:{func.__name__}:{identifier}"
            
            # Get current count
            current_count = cache.get(cache_key, 0)
            
            if current_count >= max_calls:
                return APIResponse.error(
                    f"Rate limit exceeded. Maximum {max_calls} calls per {period} seconds.",
                    status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                    error_code='RATE_LIMIT_EXCEEDED'
                )
            
            # Increment counter
            cache.set(cache_key, current_count + 1, period)
            
            return func(request, *args, **kwargs)
        
        return wrapper
    
    return decorator
