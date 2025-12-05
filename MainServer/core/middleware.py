"""
Custom middleware for the Credit System.
"""
import time
import logging
from django.utils.deprecation import MiddlewareMixin

logger = logging.getLogger(__name__)


class RequestLoggingMiddleware(MiddlewareMixin):
    """
    Middleware to log all requests with timing information.
    """
    
    def process_request(self, request):
        """Store start time on request"""
        request.start_time = time.time()
        return None
    
    def process_response(self, request, response):
        """Log request details with timing"""
        if hasattr(request, 'start_time'):
            duration = time.time() - request.start_time
            
            # Log slow requests (> 1 second)
            if duration > 1.0:
                logger.warning(
                    f"Slow request: {request.method} {request.path} "
                    f"took {duration:.2f}s"
                )
            else:
                logger.info(
                    f"{request.method} {request.path} "
                    f"[{response.status_code}] {duration:.2f}s"
                )
        
        return response


class HealthCheckMiddleware(MiddlewareMixin):
    """
    Middleware to handle health check requests.
    """
    
    def process_request(self, request):
        """Respond to health check requests"""
        if request.path == '/health/':
            from django.http import JsonResponse
            return JsonResponse({
                'status': 'healthy',
                'service': 'credit-evaluation-system',
                'version': '1.0.0'
            })
        return None