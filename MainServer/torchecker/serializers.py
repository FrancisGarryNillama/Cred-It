"""Serializers for torchecker API endpoints"""
from rest_framework import serializers
from .models import TorTransferee


class TorTransfereeSerializer(serializers.ModelSerializer):
    """Serializer for TorTransferee model"""
    
    is_passing_grade = serializers.BooleanField(read_only=True)
    display_grade = serializers.CharField(read_only=True)
    
    class Meta:
        model = TorTransferee
        fields = [
            'id',
            'account_id',
            'student_name',
            'school_name',
            'subject_code',
            'subject_description',
            'student_year',
            'pre_requisite',
            'co_requisite',
            'semester',
            'school_year_offered',
            'total_academic_units',
            'final_grade',
            'remarks',
            'is_passing_grade',
            'display_grade',
            'created_at',
            'updated_at'
        ]
        read_only_fields = ['created_at', 'updated_at']


class UniqueStudentSerializer(serializers.Serializer):
    """Serializer for unique student/school combinations"""
    student_name = serializers.CharField()
    school_name = serializers.CharField()
