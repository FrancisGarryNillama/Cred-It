"""Admin configuration for requestTOR app"""
from django.contrib import admin
from .models import RequestTOR


@admin.register(RequestTOR)
class RequestTORAdmin(admin.ModelAdmin):
    """Admin interface for RequestTOR"""
    
    list_display = (
        'accountID',
        'applicant_name',
        'status',
        'request_date',
        'formatted_request_date'
    )
    list_filter = ('status', 'request_date')
    search_fields = ('accountID', 'applicant_name')
    readonly_fields = ('created_at', 'updated_at')
    ordering = ('-request_date',)
    
    fieldsets = (
        ('Request Information', {
            'fields': ('accountID', 'applicant_name')
        }),
        ('Status', {
            'fields': ('status', 'request_date')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    def formatted_request_date(self, obj):
        """Format request date"""
        return obj.request_date.strftime("%B %d, %Y")
    formatted_request_date.short_description = "Request Date"