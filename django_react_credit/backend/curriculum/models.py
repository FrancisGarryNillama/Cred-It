from django.db import models

class TorTransferee(models.Model):
    student_name = models.CharField(max_length=100)
    school_name = models.CharField(max_length=255)
    subject_code = models.CharField(max_length=50)
    subject_description = models.CharField(max_length=255)
    student_year = models.CharField(max_length=20)
    pre_requisite = models.CharField(max_length=255, blank=True, null=True)
    co_requisite = models.CharField(max_length=255, blank=True, null=True)

    SEMESTER_CHOICES = [
        ('first', 'First'),
        ('second', 'Second'),
        ('summer', 'Summer'),
    ]
    semester = models.CharField(max_length=10, choices=SEMESTER_CHOICES)
    school_year_offered = models.CharField(max_length=20)
    total_academic_units = models.FloatField()
    final_grade = models.FloatField()
    remarks = models.CharField(max_length=255, blank=True, null=True)

    def __str__(self):
        return f"{self.subject_code} - {self.subject_description}"
