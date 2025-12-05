"""Admin configuration for profiles app"""
from django.contrib import admin
from .models import Profile


@admin.register(Profile)
class ProfileAdmin(admin.ModelAdmin):
    """Admin interface for Profile"""
    
    list_display = (
        'user_id',
        'name',
        'school_name',
        'email',
        'phone',
        'is_complete',
        'completion_percentage',
        'created_at'
    )
    list_filter = ('is_complete', 'created_at')
    search_fields = ('user_id', 'name', 'email', 'school_name')
    readonly_fields = ('is_complete', 'created_at', 'updated_at', 'completion_percentage')
    ordering = ('-created_at',)
    
    fieldsets = (
        ('User Information', {
            'fields': ('user_id', 'name')
        }),
        ('School Information', {
            'fields': ('school_name',)
        }),
        ('Contact Information', {
            'fields': ('email', 'phone', 'address')
        }),
        ('Personal Information', {
            'fields': ('date_of_birth',)
        }),
        ('Status', {
            'fields': ('is_complete', 'completion_percentage')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    def get_readonly_fields(self, request, obj=None):
        """Make user_id readonly when editing"""
        if obj:  # Editing existing object
            return self.readonly_fields + ('user_id',)
        return self.readonly_fields
    
    def completion_percentage(self, obj):
        """Display completion percentage"""
        return f"{obj.completion_percentage}%"
    completion_percentage.short_description = "Completion"