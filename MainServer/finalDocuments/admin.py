from django.contrib import admin
from .models import listFinalTor

@admin.register(listFinalTor)
class ListFinalTorAdmin(admin.ModelAdmin):
    list_display = ("accountID", "applicant_name", "status", "request_date", "accepted_date")
    list_filter = ("status",)
    search_fields = ("accountID", "applicant_name")
    ordering = ("-accepted_date",)
