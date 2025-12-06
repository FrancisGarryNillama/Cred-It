"""Serializers for requestTOR app"""
from rest_framework import serializers
from .models import RequestTOR


class RequestTORSerializer(serializers.ModelSerializer):
    """Serializer for RequestTOR model"""
    
    class Meta:
        model = RequestTOR
        fields = '__all__'
        read_only_fields = ['created_at', 'updated_at']

