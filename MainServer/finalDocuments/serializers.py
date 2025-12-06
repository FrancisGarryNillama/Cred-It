"""Serializers for finalDocuments app"""
from rest_framework import serializers
from .models import listFinalTor


class listFinalTorSerializer(serializers.ModelSerializer):
    """Serializer for listFinalTor model"""
    
    class Meta:
        model = listFinalTor
        fields = [
            'id',
            'accountID',
            'applicant_name',
            'status',
            'request_date',
            'accepted_date',
            'created_at',
            'updated_at'
        ]
        read_only_fields = ['created_at', 'updated_at']