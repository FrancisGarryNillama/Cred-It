from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from rest_framework.decorators import api_view
from rest_framework.response import Response
from torchecker.models import TorTransferee
from rest_framework import status
from difflib import SequenceMatcher
from .models import CompareResultTOR, CitTorContent
from .serializers import CompareResultTORSerializer, CitTorContentSerializer
from difflib import SequenceMatcher
import json
#DocumentPage
@api_view(["POST"])
def update_cit_tor_entry(request):
    """
    Update a single School TOR entry (CitTorContent).
    Expected data: id, subject_code, description, units
    """
    entry_id = request.data.get("id")
    if not entry_id:
        return Response({"error": "Missing entry ID"}, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        tor_entry = CitTorContent.objects.get(id=entry_id)
    except CitTorContent.DoesNotExist:
        return Response({"error": "Entry not found"}, status=status.HTTP_404_NOT_FOUND)

    # Update only fields provided
    tor_entry.subject_code = request.data.get("subject_code", tor_entry.subject_code)
    tor_entry.description = request.data.get("description", tor_entry.description)
    tor_entry.units = request.data.get("units", tor_entry.units)
    
    tor_entry.save()
    serializer = CitTorContentSerializer(tor_entry)
    return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(["POST"])
def update_credit_evaluation(request):
    entry_id = request.data.get("id")
    new_status = request.data.get("credit_evaluation")

    try:
        entry = CompareResultTOR.objects.get(id=entry_id)
        entry.credit_evaluation = new_status
        entry.save()
        return Response({"message": "Credit Evaluation updated successfully."}, status=status.HTTP_200_OK)
    except CompareResultTOR.DoesNotExist:
        return Response({"error": "Entry not found."}, status=status.HTTP_404_NOT_FOUND)


@api_view(["POST"])
def update_note(request):
    entry_id = request.data.get("id")
    new_note = request.data.get("notes", "")

    try:
        entry = CompareResultTOR.objects.get(id=entry_id)
        entry.notes = new_note
        entry.save()
        return Response({"message": "Note updated successfully."}, status=status.HTTP_200_OK)
    except CompareResultTOR.DoesNotExist:
        return Response({"error": "Entry not found."}, status=status.HTTP_404_NOT_FOUND)
#DocumentPage

# Department Side
@api_view(["GET"])
def get_cit_tor_content(request):
    data = CitTorContent.objects.all()
    serializer = CitTorContentSerializer(data, many=True)
    return Response(serializer.data)

@api_view(["GET"])
def get_compare_result(request):
    account_id = request.GET.get("account_id")
    if account_id:
        data = CompareResultTOR.objects.filter(account_id=account_id)
    else:
        data = CompareResultTOR.objects.all()
    serializer = CompareResultTORSerializer(data, many=True)
    return Response(serializer.data)
# End of Department Side


# DO NOT TOUCH!
def similarity_ratio(a, b):
    return SequenceMatcher(None, a.lower(), b.lower()).ratio() * 100

def generate_summary(entry, cit_entries):
    lines = []

    # Subject Code check
    matches = [cit for cit in cit_entries if cit.subject_code == entry.subject_code]
    if len(matches) == 0:
        lines.append("Subject Code has no matches in CIT TOR")
    elif len(matches) == 1:
        lines.append("Subject Code matches one of CIT TOR")
    else:
        lines.append("Subject Code matches multiple entries in CIT TOR")

    # Description similarity
    best_match = 0
    for cit in cit_entries:
        for desc in cit.description:
            best_match = max(best_match, similarity_ratio(entry.subject_description, desc))
    lines.append(f"Description similarity: {best_match:.2f}%")

    # Units check
    units_match = any(cit.units == int(entry.total_academic_units) for cit in cit_entries)
    if units_match:
        lines.append("Course shares the same amount of Units")
    else:
        lines.append("The amount of Units vary")

    return "\n".join(lines)


@api_view(["POST"])
def apply_standard(request):
    account_id = request.data.get("account_id")
    if not account_id:
        return Response({"error": "account_id required"}, status=400)

    entries = CompareResultTOR.objects.filter(account_id=account_id)
    cit_entries = CitTorContent.objects.all()

    for entry in entries:
        if 1.0 <= entry.final_grade <= 2.9:
            entry.remarks = "PASSED"
        elif 3.0 <= entry.final_grade <= 5.0:
            entry.remarks = "FAILED"
        entry.summary = generate_summary(entry, cit_entries)
        entry.save()

    serializer = CompareResultTORSerializer(entries, many=True)
    return Response({"message": "Standard grading applied", "data": serializer.data})


@api_view(["POST"])
def apply_reverse(request):
    account_id = request.data.get("account_id")
    if not account_id:
        return Response({"error": "account_id required"}, status=400)

    entries = CompareResultTOR.objects.filter(account_id=account_id)
    cit_entries = CitTorContent.objects.all()

    for entry in entries:
        if 3.0 <= entry.final_grade <= 5.0:
            entry.remarks = "PASSED"
        elif 1.0 <= entry.final_grade <= 2.9:
            entry.remarks = "FAILED"
        entry.summary = generate_summary(entry, cit_entries)
        entry.save()

    serializer = CompareResultTORSerializer(entries, many=True)
    return Response({"message": "Reverse grading applied", "data": serializer.data})
# DO NOT TOUCH

# Create your views here.
@api_view(['POST'])
def copy_tor_entries(request):
    account_id = request.data.get("account_id")

    if not account_id:
        return Response({"error": "account_id is required"}, status=status.HTTP_400_BAD_REQUEST)

    # Get all transferee records for this account
    transferee_entries = TorTransferee.objects.filter(account_id=account_id)

    if not transferee_entries.exists():
        return Response({"message": "No entries found for this account_id"}, status=status.HTTP_404_NOT_FOUND)

    copied_entries = []
    for entry in transferee_entries:
        compare_entry = CompareResultTOR.objects.create(
            account_id=entry.account_id,
            subject_code=entry.subject_code,
            subject_description=entry.subject_description,
            total_academic_units=entry.total_academic_units,
            final_grade=entry.final_grade,
            remarks=entry.remarks,
            summary=""  # leave blank initially, can be updated later
        )
        copied_entries.append(compare_entry)

    return Response(
        {
            "message": f"Copied {len(copied_entries)} entries to CompareResultTOR",
            "data": [
                {
                    "subject_code": e.subject_code,
                    "subject_description": e.subject_description,
                    "total_academic_units": e.total_academic_units,
                    "final_grade": e.final_grade,
                    "remarks": e.remarks,
                    "summary": e.summary,
                }
                for e in copied_entries
            ],
        },
        status=status.HTTP_201_CREATED,
    )

@csrf_exempt
def update_tor_results(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            account_id = data.get('account_id')
            failed_subjects = data.get('failed_subjects', [])
            passed_subjects = data.get('passed_subjects', [])

            # Delete all failed subjects
            CompareResultTOR.objects.filter(
                account_id=account_id,
                subject_code__in=failed_subjects
            ).delete()

            # Update remarks for passed subjects
            for subject in passed_subjects:
                CompareResultTOR.objects.filter(
                    account_id=account_id,
                    subject_code=subject["subject_code"]
                ).update(remarks=subject["remarks"])

            return JsonResponse({"message": "TOR results updated successfully."}, status=200)

        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)

    return JsonResponse({"error": "Invalid request method."}, status=400)

@csrf_exempt
def sync_completed(request):
    if request.method != 'POST':
        return JsonResponse({"error": "Invalid request method."}, status=400)
    
    try:
        data = json.loads(request.body)
        account_id = data.get("account_id")

        tor_entries = CompareResultTOR.objects.filter(account_id=account_id)
        cit_contents = CitTorContent.objects.all()

        result_data = []

        for tor in tor_entries:
            best_match = None
            best_accuracy = 0

            for cit in cit_contents:
                acc = SequenceMatcher(None, tor.subject_description.lower(), " ".join(cit.description).lower()).ratio() * 100
                if acc > best_accuracy:
                    best_accuracy = acc
                    best_match = cit

            if best_accuracy >= 20:
                tor.summary = f"Subjection Description matched with Subject Code: {best_match.subject_code}\nwith {int(best_accuracy)}% similarity."
            else:
                tor.summary = "Failed, Curriculum of BSIT, null.\nDescription Similarity: is below 20% margin"

            tor.save()
            result_data.append({
                "subject_code": tor.subject_code,
                "subject_description": tor.subject_description,
                "total_academic_units": tor.total_academic_units,
                "final_grade": tor.final_grade,
                "remarks": tor.remarks,
                "summary": tor.summary,
            })

        return JsonResponse({"data": result_data}, status=200)

    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)
    
#---------------
@api_view(['GET'])
def tracker_accreditation(request):
    account_id = request.GET.get('account_id')
    if not account_id:
        return Response({"error": "Missing account_id"}, status=400)

    results = CompareResultTOR.objects.filter(account_id=account_id).values(
        "account_id",
        "subject_code",
        "subject_description",
        "credit_evaluation"
    )

    return Response(list(results))