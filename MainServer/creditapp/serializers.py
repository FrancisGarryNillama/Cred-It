"""
Serializers for credit account API endpoints.
"""
from rest_framework import serializers
from .models import CreditAccount


class CreditAccountSerializer(serializers.ModelSerializer):
    """Serializer for CreditAccount model"""
    
    class Meta:
        model = CreditAccount
        fields = [
            'account_id',
            'status',
            'is_active',
            'created_at',
            'updated_at',
            'last_login'
        ]
        read_only_fields = ['created_at', 'updated_at', 'last_login']


class RegisterSerializer(serializers.Serializer):
    """Serializer for account registration"""
    
    account_id = serializers.CharField(
        max_length=100,
        required=True,
        help_text='Unique account identifier'
    )
    account_pass = serializers.CharField(
        max_length=255,
        write_only=True,
        required=True,
        style={'input_type': 'password'},
        help_text='Account password (min 8 characters)'
    )
    status = serializers.ChoiceField(
        choices=CreditAccount.Status.choices,
        default=CreditAccount.Status.STUDENT,
        required=False,
        help_text='Account type/role'
    )
    
    def validate_account_pass(self, value):
        """Validate password length"""
        if len(value) < 8:
            raise serializers.ValidationError(
                "Password must be at least 8 characters long"
            )
        return value


class LoginSerializer(serializers.Serializer):
    """Serializer for account login"""
    
    account_id = serializers.CharField(
        max_length=100,
        required=True,
        help_text='Account identifier'
    )
    account_pass = serializers.CharField(
        max_length=255,
        write_only=True,
        required=True,
        style={'input_type': 'password'},
        help_text='Account password'
    )


class PasswordChangeSerializer(serializers.Serializer):
    """Serializer for password change"""
    
    account_id = serializers.CharField(max_length=100, required=True)
    old_password = serializers.CharField(
        max_length=255,
        write_only=True,
        required=True,
        style={'input_type': 'password'}
    )
    new_password = serializers.CharField(
        max_length=255,
        write_only=True,
        required=True,
        style={'input_type': 'password'}
    )
    
    def validate_new_password(self, value):
        """Validate new password length"""
        if len(value) < 8:
            raise serializers.ValidationError(
                "New password must be at least 8 characters long"
            )
        return value