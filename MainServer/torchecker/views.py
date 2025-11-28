import tempfile, os
import easyocr
import numpy as np
import re
import json
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework import viewsets, generics
from .serializers import TorTransfereeSerializer, UniqueStudentSerializer
from django.core.files.storage import default_storage
from rest_framework.parsers import MultiPartParser, FormParser
from django.http import JsonResponse
from rest_framework.decorators import api_view, parser_classes
from django.views.decorators.csrf import csrf_exempt
from django.shortcuts import get_object_or_404
from .models import TorTransferee
from curriculum.models import CompareResultTOR
from .demoocr import sort_ocr_results, extract_fields_from_lines
from curriculum.models import CitTorContent
from .ocr import process_images
from rest_framework.parsers import MultiPartParser, FormParser


class DemoOCRView(APIView):
    def post(self, request, *args, **kwargs):
        files = request.FILES.getlist("images")
        if not files:
            return Response({"error": "No images uploaded"}, status=status.HTTP_400_BAD_REQUEST)

        reader = easyocr.Reader(['en'])
        all_results = []

        for f in files:
            with tempfile.NamedTemporaryFile(delete=False, suffix=".jpg") as tmp:
                for chunk in f.chunks():
                    tmp.write(chunk)
                tmp_path = tmp.name

            try:
                results = reader.readtext(tmp_path)
                lines = sort_ocr_results(results)
                structured = extract_fields_from_lines(lines)

                all_results.append({
                    "file_name": f.name,
                    "student_name": structured.get("student_name"),
                    "school_name": structured.get("school_name"),
                    "entries": structured.get("entries", []),
                })
            finally:
                os.remove(tmp_path)

        return Response({"results": all_results}, status=status.HTTP_200_OK)
    


class TorTransfereeViewSet(viewsets.ModelViewSet):
    def list(self, request):
        # Get distinct pairs of student_name and school_name
        queryset = TorTransferee.objects.values('student_name', 'school_name').distinct()
        serializer = UniqueStudentSerializer(queryset, many=True)
        return Response(serializer.data)
    #queryset = TorTransferee.objects.all()
    #   serializer_class = TorTransfereeSerializer

class TorTransfereeListView(generics.ListAPIView):
    queryset = TorTransferee.objects.all()
    serializer_class = TorTransfereeSerializer
    
@csrf_exempt
def transferees_list(request):
    if request.method == "GET":
        # Return distinct student_name + school_name only
        data = list(
            TorTransferee.objects
            .values('id', 'student_name', 'school_name')
            .distinct()
        )
        return JsonResponse(data, safe=False)

    elif request.method == "POST":
        body = json.loads(request.body)
        transferee = TorTransferee.objects.create(
            student_name=body.get('student_name', ''),
            school_name=body.get('school_name', ''),
            subject_code='',
            subject_description='',
            student_year='',
            semester='first',
            school_year_offered='',
            total_academic_units=0,
            final_grade=0
        )
        return JsonResponse({"id": transferee.id}, status=201)

@csrf_exempt
def transferee_detail(request, pk):
    transferee = get_object_or_404(TorTransferee, pk=pk)

    if request.method == "PUT":
        body = json.loads(request.body)
        transferee.student_name = body.get('student_name', transferee.student_name)
        transferee.school_name = body.get('school_name', transferee.school_name)
        transferee.save()
        return JsonResponse({"status": "updated"})

    elif request.method == "DELETE":
        transferee.delete()
        return JsonResponse({"status": "deleted"})

def upload_preview(request):
    return JsonResponse({'message': 'Preview upload view not implemented yet'})

def upload_full(request):
    return JsonResponse({'message': 'Full upload view not implemented yet'})

# below is the function to delete DB when canceled during choices of Cancel or Request Cred

@api_view(['DELETE'])
def delete_ocr_entries(request):
    account_id = request.query_params.get('account_id')
    if not account_id:
        return Response({"error": "Account ID required"}, status=400)
    
    # Delete TorTransferee entries
    tor_deleted, _ = TorTransferee.objects.filter(account_id=account_id).delete()

    # Delete CompareResultTOR entries
    compare_deleted, _ = CompareResultTOR.objects.filter(account_id=account_id).delete()

    return Response({
        "message": "Entries deleted successfully",
        "tor_deleted": tor_deleted,
        "compare_deleted": compare_deleted,
    }, status=200)

# CREDIT/MainServer/torchecker/views.py
class OCRView(APIView):
    parser_classes = (MultiPartParser, FormParser)

    def post(self, request, *args, **kwargs):
        files = request.FILES.getlist("images")
        if not files:
            return Response({"error": "No images uploaded"}, status=400)

        account_id = request.data.get("account_id")
        all_entries = []
        student_name, school_name = None, None
        reader = easyocr.Reader(['en'])

        try:
            for file in files:
                file_path = default_storage.save(f"temp/{file.name}", file)

                try:
                    results = reader.readtext(default_storage.path(file_path))
                    lines = self.sort_ocr_results(results)
                    structured = self.extract_fields_from_lines(lines)

                    if not student_name and structured["student_name"]:
                        student_name = structured["student_name"]
                    if not school_name and structured["school_name"]:
                        school_name = structured["school_name"]

                    for entry in structured["entries"]:
                        saved = TorTransferee.objects.create(
                            account_id=account_id,
                            student_name=student_name or "Unknown",
                            school_name=school_name or "Unknown",
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
                        all_entries.append({
                            "id": saved.id,
                            "subject_code": saved.subject_code,
                            "subject_description": saved.subject_description,
                            "student_year": saved.student_year,
                            "semester": saved.semester,
                            "school_year_offered": saved.school_year_offered,
                            "total_academic_units": saved.total_academic_units,
                            "final_grade": saved.final_grade,
                            "remarks": saved.remarks,
                        })
                finally:
                    if default_storage.exists(file_path):
                        default_storage.delete(file_path)

            school_tor = list(
                CitTorContent.objects.all().values(
                    "subject_code", "prerequisite", "description", "units"
                )
            )

            return Response({
                "student_name": student_name,
                "school_name": school_name,
                "ocr_results": all_entries,
                "school_tor": school_tor,
            }, status=200)

        except Exception as e:
            return Response({"error": str(e)}, status=500)

    # === Helpers ===
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
            for r in results if r[2] > 0.3
        ]
        threshold = self.average_text_height(annotated) * 0.6
        annotated.sort(key=lambda x: x["center"][1])

        lines, current_line = [], []
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
        student_name, school_name = None, None

        subject_code_pattern = re.compile(r'^[A-Za-z]{1,}[ \-]*\d{1,4}[A-Za-z]?$')
        grade_pattern = re.compile(r'^\d+(\.\d+)?$')
        year_pattern = re.compile(r'^\d{4}-\d{4}$')

        remarks_map = {
            "inc": "Incomplete", "incomplete": "Incomplete",
            "drp": "Dropped", "dropped": "Dropped",
            "withdrawn": "Withdrawn",
            "pas": "Passed", "pass": "Passed", "passed": "Passed",
            "fail": "Failed", "failed": "Failed"
        }
        semester_keywords = ['first', 'second', 'summer']

        for line in lines:
            texts = [w["text"] for w in line]
            # cleanup OCR tokens
            cleaned = [t.strip(".,:;") for t in texts]
            lower = [t.lower() for t in cleaned]

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

            joined = " ".join(cleaned)
            if not student_name and "name" in joined.lower():
                student_name = joined.split(":")[-1].strip()
                continue
            if not school_name and any(k in joined.lower() for k in ["school", "university", "college"]):
                school_name = joined
                continue

            # detect subject code + description
            for i, word in enumerate(cleaned):
                if subject_code_pattern.match(word):
                    entry['subject_code'] = word
                    desc_parts = []
                    for j in range(i+1, len(cleaned)):
                        if grade_pattern.match(cleaned[j]) or lower[j] in remarks_map:
                            break
                        desc_parts.append(cleaned[j])
                    entry['subject_description'] = " ".join(desc_parts)
                    break

            # semester
            for word in lower:
                for sem in semester_keywords:
                    if sem in word:
                        entry['semester'] = sem
                        break

            # school year
            for word in cleaned:
                if year_pattern.match(word):
                    entry['school_year_offered'] = word

            # numbers: assign units + grade
            numbers = [float(w) for w in cleaned if grade_pattern.match(w)]
            if numbers:
                if len(numbers) >= 2:
                    entry['final_grade'] = numbers[0]          # first is grade
                    entry['total_academic_units'] = numbers[1] # second is units
                else:
                    entry['final_grade'] = numbers[0]

            # remarks
            for word in lower:
                if word in remarks_map:
                    entry['remarks'] = remarks_map[word]

            if entry['subject_code']:  # relax filter (don’t require description strictly)
                extracted_entries.append(entry)

        return {
            'student_name': student_name,
            'school_name': school_name,
            'entries': extracted_entries
        }