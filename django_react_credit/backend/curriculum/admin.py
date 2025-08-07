from django.contrib import admin
from .models import TorTransferee

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
