import os
import easyocr
import numpy as np
import re
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import TorTransferee
from django.core.files.storage import default_storage
from rest_framework.parsers import MultiPartParser, FormParser
from django.http import JsonResponse
 
def upload_preview(request):
    return JsonResponse({'message': 'Preview upload view not implemented yet'})

def upload_full(request):
    return JsonResponse({'message': 'Full upload view not implemented yet'})
class OCRView(APIView):
    parser_classes = (MultiPartParser, FormParser)
 
    def post(self, request, *args, **kwargs):
        file = request.FILES.get("file")
        if not file:
            return Response({"error": "No file uploaded"}, status=400)
 
        # Save temporarily
        file_path = default_storage.save(f"temp/{file.name}", file)
 
        try:
            reader = easyocr.Reader(['en'])
            results = reader.readtext(default_storage.path(file_path))
            lines = self.sort_ocr_results(results)
            structured = self.extract_fields_from_lines(lines)
 
            # Save to DB
            for entry in structured["entries"]:
                TorTransferee.objects.create(
                    student_name=structured["student_name"] or "Unknown",
                    school_name=structured["school_name"] or "Unknown",
                    subject_code=entry["subject_code"],
                    subject_description=entry["subject_description"],
                    student_year=entry["student_year"],
                    pre_requisite=entry["pre_requisite"],
                    co_requisite=entry["co_requisite"],
                    semester=entry["semester"],
                    school_year_offered=entry["school_year_offered"],
                    total_academic_units=entry["total_academic_units"],
                    final_grade=entry["final_grade"],
                    remarks=entry["remarks"],
                )
 
            return Response(structured, status=200)
 
        except Exception as e:
            return Response({"error": str(e)}, status=500)
        finally:
            if default_storage.exists(file_path):
                default_storage.delete(file_path)
 
    def get_center(self, bbox):
        x_coords = [p[0] for p in bbox]
        y_coords = [p[1] for p in bbox]
        return (sum(x_coords) / 4, sum(y_coords) / 4)
 
    def average_text_height(self, annotated):
        heights = [abs(bbox[0][1] - bbox[2][1]) for bbox in [a['bbox'] for a in annotated]]
        return sum(heights) / len(heights) if heights else 15
 
    def sort_ocr_results(self, results):
        annotated = [
            {"bbox": r[0], "text": r[1], "conf": r[2], "center": self.get_center(r[0])}
            for r in results if r[2] > 0.5
        ]
        threshold = self.average_text_height(annotated) * 0.6
        annotated.sort(key=lambda x: x["center"][1])
 
        lines = []
        current_line = []
        for item in annotated:
            if not current_line:
                current_line.append(item)
                continue
            y_diff = abs(item["center"][1] - current_line[-1]["center"][1])
            if y_diff < threshold:
                current_line.append(item)
            else:
                lines.append(current_line)
                current_line = [item]
        if current_line:
            lines.append(current_line)
 
        for line in lines:
            line.sort(key=lambda x: x["center"][0])
        return lines
 
    def extract_fields_from_lines(self, lines):
        extracted_entries = []
        student_name = None
        school_name = None
 
        subject_code_pattern = re.compile(r'^[A-Z]{2,}\d{1,3}[A-Z]?$')
        grade_pattern = re.compile(r'^\d+(\.\d+)?$')
        year_pattern = re.compile(r'^\d{4}-\d{4}$')
        remarks_keywords = ['passed', 'failed', 'inc', 'dropped', 'withdrawn']
        semester_keywords = ['first', 'second', 'summer']
 
        for line in lines:
            texts = [w["text"] for w in line]
            lower_texts = [t.lower() for t in texts]
 
            entry = {
                'subject_code': '',
                'subject_description': '',
                'student_year': '',
                'semester': '',
                'school_year_offered': '',
                'total_academic_units': 0.0,
                'final_grade': 0.0,
                'remarks': '',
                'pre_requisite': '',
                'co_requisite': '',
            }
 
            joined_line = " ".join(texts)
            if not student_name and "name" in joined_line.lower():
                student_name = joined_line.split(":")[-1].strip()
                continue
            if not school_name and "school" in joined_line.lower():
                school_name = joined_line.split(":")[-1].strip()
                continue
 
            for i, word in enumerate(texts):
                if subject_code_pattern.match(word):
                    entry['subject_code'] = word
                    desc = []
                    for j in range(i+1, len(texts)):
                        if grade_pattern.match(texts[j]) or texts[j].lower() in remarks_keywords:
                            break
                        desc.append(texts[j])
                    entry['subject_description'] = " ".join(desc)
                    break
 
            for word in lower_texts:
                for sem in semester_keywords:
                    if sem in word:
                        entry['semester'] = sem
                        break
 
            for word in texts:
                if year_pattern.match(word):
                    entry['school_year_offered'] = word
 
            numbers = [float(w) for w in texts if grade_pattern.match(w)]
            if numbers:
                if len(numbers) >= 2:
                    entry['total_academic_units'] = numbers[0]
                    entry['final_grade'] = numbers[1]
                elif len(numbers) == 1:
                    entry['final_grade'] = numbers[0]
 
            for word in lower_texts:
                if word in remarks_keywords:
                    entry['remarks'] = word.capitalize()
 
            if entry['subject_code'] and entry['subject_description']:
                extracted_entries.append(entry)
 
        return {
            'student_name': student_name,
            'school_name': school_name,
            'entries': extracted_entries
        }