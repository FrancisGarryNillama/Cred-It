"""Serializers for pendingRequest app"""
from rest_framework import serializers
from .models import PendingRequest


class PendingRequestSerializer(serializers.ModelSerializer):
    """Serializer for PendingRequest model"""
    
    class Meta:
        model = PendingRequest
        fields = '__all__'
        read_only_fields = ['created_at', 'updated_at']