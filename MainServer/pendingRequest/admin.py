from django.contrib import admin
from .models import PendingRequest

@admin.register(PendingRequest)
class PendingRequestAdmin(admin.ModelAdmin):
    list_display = ("applicant_id", "applicant_name", "status", "request_date", "accepted_date")
    list_filter = ("status", "request_date", "accepted_date")
    search_fields = ("applicant_id", "applicant_name")
