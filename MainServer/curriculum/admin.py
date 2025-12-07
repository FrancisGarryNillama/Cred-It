"""Admin configuration for curriculum app"""
from django.contrib import admin
from .models import CompareResultTOR, CitTorContent


@admin.register(CompareResultTOR)
class CompareResultTORAdmin(admin.ModelAdmin):
    """Admin interface for CompareResultTOR"""
    
    list_display = (
        'account_id',
        'subject_code',
        'subject_description',
        'total_academic_units',
        'final_grade',
        'remarks',
        'credit_evaluation',
        'created_at'
    )
    list_filter = (
        'credit_evaluation',
        'remarks',
        'created_at'
    )
    search_fields = (
        'account_id',
        'subject_code',
        'subject_description'
    )
    readonly_fields = ('created_at', 'updated_at')
    ordering = ('-created_at', 'account_id')
    
    fieldsets = (
        ('Student Information', {
            'fields': ('account_id',)
        }),
        ('Subject Details', {
            'fields': (
                'subject_code',
                'subject_description',
                'total_academic_units',
                'final_grade'
            )
        }),
        ('Evaluation', {
            'fields': (
                'remarks',
                'credit_evaluation',
                'summary',
                'notes'
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
            return self.readonly_fields + ('account_id', 'subject_code')
        return self.readonly_fields


@admin.register(CitTorContent)
class CitTorContentAdmin(admin.ModelAdmin):
    """Admin interface for CitTorContent"""
    
    list_display = (
        'subject_code',
        'units',
        'is_active',
        'get_prerequisites',
        'get_descriptions'
    )
    list_filter = ('is_active', 'units')
    search_fields = ('subject_code', 'description')
    readonly_fields = ('created_at', 'updated_at')
    ordering = ('subject_code',)
    
    fieldsets = (
        ('Subject Information', {
            'fields': ('subject_code', 'units', 'is_active')
        }),
        ('Course Details', {
            'fields': ('prerequisite', 'description')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    def get_prerequisites(self, obj):
        """Display prerequisites as comma-separated list"""
        return ", ".join(obj.prerequisite) if obj.prerequisite else "-"
    get_prerequisites.short_description = "Prerequisites"
    
    def get_descriptions(self, obj):
        """Display descriptions"""
        return "; ".join(obj.description[:2]) if obj.description else "-"
    get_descriptions.short_description = "Descriptions"
    
    def get_readonly_fields(self, request, obj=None):
        """Make subject_code readonly when editing"""
        if obj:
            return self.readonly_fields + ('subject_code',)
        return self.readonly_fields