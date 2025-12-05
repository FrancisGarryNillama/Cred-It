"""Serializers for profile API endpoints"""
from rest_framework import serializers
from .models import Profile


class ProfileSerializer(serializers.ModelSerializer):
    """Serializer for Profile model"""
    
    display_name = serializers.CharField(read_only=True)
    contact_info = serializers.CharField(read_only=True)
    completion_percentage = serializers.IntegerField(read_only=True)
    
    class Meta:
        model = Profile
        fields = [
            'id',
            'user_id',
            'name',
            'school_name',
            'email',
            'phone',
            'address',
            'date_of_birth',
            'is_complete',
            'display_name',
            'contact_info',
            'completion_percentage',
            'created_at',
            'updated_at'
        ]
        read_only_fields = ['is_complete', 'created_at', 'updated_at']
        extra_kwargs = {
            'user_id': {'required': True},
            'name': {'required': False, 'allow_blank': True},
            'school_name': {'required': False, 'allow_blank': True},
            'email': {'required': False, 'allow_blank': True, 'allow_null': True},
            'phone': {'required': False, 'allow_blank': True},
        }


class ProfileCreateSerializer(serializers.Serializer):
    """Serializer for creating a profile"""
    user_id = serializers.CharField(max_length=255, required=True)
    name = serializers.CharField(max_length=255, required=False, allow_blank=True)
    school_name = serializers.CharField(max_length=255, required=False, allow_blank=True)
    email = serializers.EmailField(required=False, allow_blank=True, allow_null=True)
    phone = serializers.CharField(max_length=20, required=False, allow_blank=True)
    address = serializers.CharField(required=False, allow_blank=True)
    date_of_birth = serializers.DateField(required=False, allow_null=True)


class ProfileUpdateSerializer(serializers.Serializer):
    """Serializer for updating a profile"""
    name = serializers.CharField(max_length=255, required=False, allow_blank=True)
    school_name = serializers.CharField(max_length=255, required=False, allow_blank=True)
    email = serializers.EmailField(required=False, allow_blank=True, allow_null=True)
    phone = serializers.CharField(max_length=20, required=False, allow_blank=True)
    address = serializers.CharField(required=False, allow_blank=True)
    date_of_birth = serializers.DateField(required=False, allow_null=True)
