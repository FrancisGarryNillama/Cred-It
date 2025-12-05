"""Admin configuration for pendingRequest app"""
from django.contrib import admin
from .models import PendingRequest


@admin.register(PendingRequest)
class PendingRequestAdmin(admin.ModelAdmin):
    """Admin interface for PendingRequest"""
    
    list_display = (
        'applicant_id',
        'applicant_name',
        'status',
        'request_date',
        'accepted_date'
    )
    list_filter = ('status', 'request_date', 'accepted_date')
    search_fields = ('applicant_id', 'applicant_name')
    readonly_fields = ('created_at', 'updated_at')
    ordering = ('-request_date',)
    
    fieldsets = (
        ('Applicant Information', {
            'fields': ('applicant_id', 'applicant_name')
        }),
        ('Status', {
            'fields': ('status', 'request_date', 'accepted_date')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
