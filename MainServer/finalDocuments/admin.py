"""Admin configuration for finalDocuments app"""
from django.contrib import admin
from .models import listFinalTor


@admin.register(listFinalTor)
class ListFinalTorAdmin(admin.ModelAdmin):
    """Admin interface for listFinalTor"""
    
    list_display = (
        'accountID',
        'applicant_name',
        'status',
        'request_date',
        'accepted_date'
    )
    list_filter = ('status', 'accepted_date')
    search_fields = ('accountID', 'applicant_name')
    readonly_fields = ('created_at', 'updated_at')
    ordering = ('-accepted_date',)
    
    fieldsets = (
        ('Applicant Information', {
            'fields': ('accountID', 'applicant_name')
        }),
        ('Status', {
            'fields': ('status', 'request_date', 'accepted_date')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )