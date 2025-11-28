from django.contrib import admin

# Register your models here.

from .models import TorTransferee

@admin.register(TorTransferee)
class TorTransfereeAdmin(admin.ModelAdmin):
    list_display = (
        'student_name',
        'school_name',
        'subject_code',
        'subject_description',
        'student_year',
        'semester',
        'school_year_offered',
        'total_academic_units',
        'final_grade',
        'remarks',
    )
    search_fields = (
        'student_name',
        'school_name',
        'subject_code',
        'subject_description',
    )
    list_filter = ('semester', 'school_year_offered', 'student_year')

