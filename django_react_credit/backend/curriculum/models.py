from django.db import models

class TorTransferee(models.Model):
    #student name
    #name of school 
    subject_code = models.CharField(max_length=50)
    subject_description = models.CharField(max_length=255)
    student_year = models.CharField(max_length=20)
    pre_requisite = models.CharField(max_length=255, blank=True, null=True)
    co_requisite = models.CharField(max_length=255, blank=True, null=True)
    semester = models.CharField(max_length=20) #3 values only first,second, summer
    school_year_offered = models.CharField(max_length=20)
    total_academic_units = models.FloatField()
    final_grade = models.FloatField()

    def __str__(self):
        return f"{self.subject_code} - {self.subject_description}"
