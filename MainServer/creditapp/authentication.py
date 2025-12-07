from rest_framework_simplejwt.authentication import JWTAuthentication
from django.conf import settings
from rest_framework.authentication import CSRFCheck
from rest_framework import exceptions

def enforce_csrf(request):
    """
    Enforce CSRF validation
    """
    check = CSRFCheck()
    # populating request.META['CSRF_COOKIE'], which is used in process_view()
    check.process_request(request)
    reason = check.process_view(request, None, (), {})
    if reason:
        # CSRF failed, raise a 403 error which returns the reason
        raise exceptions.PermissionDenied('CSRF Failed: %s' % reason)

class JWTCookieAuthentication(JWTAuthentication):
    """
    Custom authentication class to read JWT from httpOnly cookie
    """
    def authenticate(self, request):
        header = self.get_header(request)
        
        if header is None:
            # If no header, check cookies
            raw_token = request.COOKIES.get(settings.JWT_AUTH_COOKIE) or None
        else:
            # If header exists, use it (standard Bearer token)
            raw_token = self.get_raw_token(header)

        if raw_token is None:
            return None

        # Optional: Enforce CSRF for cookie-based auth
        # if settings.JWT_AUTH_COOKIE in request.COOKIES:
        #     enforce_csrf(request)

        validated_token = self.get_validated_token(raw_token)
        
        # Custom User Lookup for CreditAccount
        return self.get_user(validated_token), validated_token

    def get_user(self, validated_token):
        """
        Attempts to find and return a user using the given validated token.
        """
        from .models import CreditAccount
        from rest_framework.exceptions import AuthenticationFailed

        try:
            user_id = validated_token.get('username') or validated_token.get('user_id')
            if not user_id:
                raise AuthenticationFailed('Token contained no recognizable user identification')

            user = CreditAccount.objects.get(AccountID=user_id)
            
            # Monkey-patch is_authenticated for compatibility
            user.is_authenticated = True
            
            return user
        except CreditAccount.DoesNotExist:
            raise AuthenticationFailed('User not found', code='user_not_found')

