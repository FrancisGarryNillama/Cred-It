from django.contrib import admin
from .models import RequestTOR

@admin.register(RequestTOR)
class RequestTORAdmin(admin.ModelAdmin):
    list_display = ("accountID", "applicant_name", "status", "formatted_request_date")
    list_filter = ("status", "request_date")
    search_fields = ("accountID", "applicant_name")
    ordering = ("-request_date",)

    def formatted_request_date(self, obj):
        return obj.request_date.strftime("%B %d %Y")
    formatted_request_date.short_description = "Request Date"
