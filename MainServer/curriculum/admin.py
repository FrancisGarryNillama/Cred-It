from django.contrib import admin
from .models import TorTransferee, CitTorContent, CompareResultTOR

@admin.register(TorTransferee)
class TorTransfereeAdmin(admin.ModelAdmin):
    list_display = (
        'subject_code',
        'subject_description',
        'student_year',
        'semester',
        'school_year_offered',
        'total_academic_units',
        'final_grade',
    )
    search_fields = (
        'subject_code',
        'subject_description',
        'student_year',
        'semester',
    )
    list_filter = ('semester', 'school_year_offered', 'student_year')

@admin.register(CitTorContent)
class CitTorContentAdmin(admin.ModelAdmin):
    list_display = ("subject_code", "units", "get_prerequisite", "get_description")
    search_fields = ("subject_code", "prerequisite", "description")

    def get_prerequisite(self, obj):
        return ", ".join(obj.prerequisite) if obj.prerequisite else "-"
    get_prerequisite.short_description = "Prerequisites"

    def get_description(self, obj):
        return "; ".join(obj.description) if obj.description else "-"
    get_description.short_description = "Descriptions"

@admin.register(CompareResultTOR)
class CompareResultTORAdmin(admin.ModelAdmin):
    list_display = (
        "account_id",
        "subject_code",
        "subject_description",
        "total_academic_units",
        "final_grade",
        "remarks",
        "summary",
        "credit_evaluation", 
        "notes",
    )
    list_filter = ("account_id", "remarks", "credit_evaluation")
    search_fields = ("account_id", "subject_code", "subject_description", "remarks", "notes")
    ordering = ("account_id", "subject_code")
    readonly_fields = ("summary",)  # optional: make summary read-only if generated automatically

    