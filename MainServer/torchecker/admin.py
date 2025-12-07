"""Admin configuration for torchecker app"""
from django.contrib import admin
from .models import TorTransferee


@admin.register(TorTransferee)
class TorTransfereeAdmin(admin.ModelAdmin):
    """Admin interface for TorTransferee"""
    
    list_display = (
        'account_id',
        'student_name',
        'school_name',
        'subject_code',
        'subject_description',
        'student_year',
        'semester',
        'school_year_offered',
        'total_academic_units',
        'final_grade',
        'remarks',
        'created_at'
    )
    list_filter = (
        'semester',
        'school_year_offered',
        'student_year',
        'created_at'
    )
    search_fields = (
        'account_id',
        'student_name',
        'school_name',
        'subject_code',
        'subject_description'
    )
    readonly_fields = ('created_at', 'updated_at')
    ordering = ('-created_at', 'account_id')
    
    fieldsets = (
        ('Student Information', {
            'fields': ('account_id', 'student_name', 'school_name')
        }),
        ('Subject Details', {
            'fields': (
                'subject_code',
                'subject_description',
                'student_year',
                'pre_requisite',
                'co_requisite'
            )
        }),
        ('Academic Details', {
            'fields': (
                'semester',
                'school_year_offered',
                'total_academic_units',
                'final_grade',
                'remarks'
            )
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    def get_readonly_fields(self, request, obj=None):
        """Make certain fields readonly when editing"""
        if obj:  # Editing existing object
            return self.readonly_fields + ('account_id',)
        return self.readonly_fields