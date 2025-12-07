"""Serializers for curriculum API endpoints"""
from rest_framework import serializers
from .models import CompareResultTOR, CitTorContent


class CompareResultTORSerializer(serializers.ModelSerializer):
    """Serializer for CompareResultTOR model"""
    
    is_accepted = serializers.BooleanField(read_only=True)
    is_denied = serializers.BooleanField(read_only=True)
    needs_investigation = serializers.BooleanField(read_only=True)
    is_passing_grade = serializers.BooleanField(read_only=True)
    
    class Meta:
        model = CompareResultTOR
        fields = [
            'id',
            'account_id',
            'subject_code',
            'subject_description',
            'total_academic_units',
            'final_grade',
            'remarks',
            'summary',
            'credit_evaluation',
            'notes',
            'is_accepted',
            'is_denied',
            'needs_investigation',
            'is_passing_grade',
            'created_at',
            'updated_at'
        ]
        read_only_fields = ['created_at', 'updated_at']


class CitTorContentSerializer(serializers.ModelSerializer):
    """Serializer for CitTorContent model"""
    
    has_prerequisites = serializers.BooleanField(read_only=True)
    description_text = serializers.CharField(read_only=True)
    
    class Meta:
        model = CitTorContent
        fields = [
            'id',
            'subject_code',
            'prerequisite',
            'description',
            'units',
            'is_active',
            'has_prerequisites',
            'description_text',
            'created_at',
            'updated_at'
        ]
        read_only_fields = ['created_at', 'updated_at']


class ApplyGradingSerializer(serializers.Serializer):
    """Serializer for applying grading system"""
    account_id = serializers.CharField(
        max_length=100,
        required=True,
        help_text='Student account ID'
    )


class UpdateCreditEvaluationSerializer(serializers.Serializer):
    """Serializer for updating credit evaluation"""
    id = serializers.IntegerField(required=True)
    credit_evaluation = serializers.ChoiceField(
        choices=CompareResultTOR.CreditEvaluation.choices,
        required=True
    )
    notes = serializers.CharField(required=False, allow_blank=True)


class UpdateNoteSerializer(serializers.Serializer):
    """Serializer for updating notes"""
    id = serializers.IntegerField(required=True)
    notes = serializers.CharField(required=True, allow_blank=True)


class UpdateCitTorEntrySerializer(serializers.Serializer):
    """Serializer for updating CIT TOR entry"""
    id = serializers.IntegerField(required=True)
    subject_code = serializers.CharField(max_length=30, required=False)
    description = serializers.ListField(
        child=serializers.CharField(),
        required=False
    )
    units = serializers.IntegerField(min_value=1, required=False)


class UpdateTorResultsSerializer(serializers.Serializer):
    """Serializer for updating TOR results"""
    account_id = serializers.CharField(max_length=100, required=True)
    failed_subjects = serializers.ListField(
        child=serializers.CharField(),
        required=False,
        default=list
    )
    passed_subjects = serializers.ListField(
        child=serializers.DictField(),
        required=False,
        default=list
    )
