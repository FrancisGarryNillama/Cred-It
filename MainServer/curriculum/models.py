from django.db import models
from django.contrib.postgres.fields import ArrayField

class CompareResultTOR(models.Model):
    CREDIT_EVALUATION_CHOICES = [
        ("Accepted", "Accepted"),
        ("Denied", "Denied"),
        ("Investigate", "Investigate"),
        ("Void", "Void"),  # default
    ]

    account_id = models.CharField(max_length=100, verbose_name="Account ID")
    subject_code = models.CharField(max_length=50, verbose_name="Subject Code")
    subject_description = models.CharField(max_length=255, verbose_name="Description")
    total_academic_units = models.FloatField(verbose_name="Units")
    final_grade = models.FloatField(verbose_name="Final Grade")
    remarks = models.CharField(max_length=255, blank=True, null=True, verbose_name="Remark")
    summary = models.TextField(blank=True, null=True, verbose_name="Summary")  # can store paragraphs

    credit_evaluation = models.CharField(
        max_length=20,
        choices=CREDIT_EVALUATION_CHOICES,
        default="Void",
        verbose_name="Credit Evaluation"
    )
    notes = models.TextField(blank=True, null=True, verbose_name="Notes")

    def __str__(self):
        return f"{self.subject_code} - {self.subject_description}"

class TorTransferee(models.Model):
    
    account_id = models.CharField(max_length=100, default="")
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

class CitTorContent(models.Model):
    subject_code = models.CharField(max_length=30, unique=True)

    # Example: ["CSIT101", "CSIT110", "IT400"]
    prerequisite = ArrayField(
        models.CharField(max_length=30),
        blank=True,
        default=list
    )

    # Example: ["Math of Science", "Mathematical Concepts of Science", "Science Technology"]
    description = ArrayField(
        models.TextField(),
        blank=True,
        default=list
    )

    units = models.PositiveIntegerField()

    class Meta:
        db_table = "cit_tor_content"   # explicit table name

    def __str__(self):
        return f"{self.subject_code} ({self.units} units)"