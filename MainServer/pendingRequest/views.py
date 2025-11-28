from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.utils import timezone

# Correct imports based on your project apps
from requestTOR.models import RequestTOR
from curriculum.models import CompareResultTOR
from profiles.models import Profile
from .models import PendingRequest
from .serializers import PendingRequestSerializer

@api_view(["POST"])
def update_status(request):
    applicant_id = request.data.get("applicant_id")  # must match React
    status = request.data.get("status")

    if not applicant_id or not status:
        return Response(
            {"detail": "applicant_id and status are required."}, 
            status=400
        )

    try:
        pending = PendingRequest.objects.get(applicant_id=applicant_id)
        pending.status = status
        pending.save()
        return Response({"success": True, "status": status})
    except PendingRequest.DoesNotExist:
        return Response(
            {"detail": f"PendingRequest entry not found for applicant_id '{applicant_id}'"}, 
            status=404
        )
    
@api_view(["POST"])
def update_status_for_document(request):
    applicant_id = request.data.get("applicant_id")
    status = request.data.get("status")

    if not applicant_id or not status:
        return Response({"detail": "applicant_id and status are required."}, status=400)

    try:
        pending = PendingRequest.objects.get(applicant_id=applicant_id)
        pending.status = status
        pending.save()
        return Response({"success": True, "status": status})  # ✅ returns JSON
    except PendingRequest.DoesNotExist:
        return Response({"detail": f"No PendingRequest found for '{applicant_id}'"}, status=404)
    

@api_view(["POST"])
def update_pending_request_status(request):
    """
    Update the status of a PendingRequest entry for a given applicant
    """
    applicant_id = request.data.get("applicant_id", "").strip()
    new_status = request.data.get("status")

    if not applicant_id or not new_status:
        return Response({"detail": "applicant_id and status are required."}, status=status.HTTP_400_BAD_REQUEST)

    try:
        pending_request = PendingRequest.objects.get(applicant_id=applicant_id)
        pending_request.status = new_status
        pending_request.save()
        return Response({"detail": f"Status updated to {new_status}"}, status=status.HTTP_200_OK)

    except PendingRequest.DoesNotExist:
        return Response({"detail": f"PendingRequest entry not found for applicant_id '{applicant_id}'"}, status=status.HTTP_404_NOT_FOUND)

@api_view(["POST"])
def accept_request(request):
    applicant_id = request.data.get("applicant_id")
    if not applicant_id:
        return Response({"error": "applicant_id is required."}, status=status.HTTP_400_BAD_REQUEST)

    try:
        # Fetch RequestTOR entries for the applicant
        request_entries = RequestTOR.objects.filter(accountID=applicant_id)
        if not request_entries.exists():
            return Response({"error": "No RequestTOR entries found for this applicant."}, status=status.HTTP_404_NOT_FOUND)

        # Fetch applicant profile
        profile = Profile.objects.filter(user_id=applicant_id).first()
        if not profile:
            return Response({"error": "Applicant profile not found."}, status=status.HTTP_404_NOT_FOUND)

        # Transfer to PendingRequest
        for entry in request_entries:
            PendingRequest.objects.create(
                applicant_id=entry.accountID,
                applicant_name=entry.applicant_name,
                status="Pending",
                request_date=entry.request_date,
                accepted_date=None
            )

        # Delete the original RequestTOR entries
        request_entries.delete()

        return Response({"success": "Request accepted and moved to Pending Requests."}, status=status.HTTP_200_OK)

    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(["POST"])
def accept_request(request):
    applicant_id = request.data.get("applicant_id")

    # 1. Move RequestTOR to PendingRequest
    request_entries = RequestTOR.objects.filter(accountID=applicant_id)
    for entry in request_entries:
        PendingRequest.objects.create(
            applicant_id=entry.accountID,
            applicant_name=entry.applicant_name,
            status=entry.status,
            request_date=entry.request_date
        )

    # 2. Delete the RequestTOR entries
    RequestTOR.objects.filter(accountID=applicant_id).delete()

    return Response({"success": "Request accepted and moved to Pending Requests."})



@api_view(['DELETE'])
def deny_request(request, applicant_id):
    try:
        # Delete Profile
        Profile.objects.filter(user_id=applicant_id).delete()

        # Delete CompareResultTOR
        CompareResultTOR.objects.filter(account_id=applicant_id).delete()

        # Delete RequestTOR
        RequestTOR.objects.filter(accountID=applicant_id).delete()

        return Response({"message": "Request and all related entries denied and deleted."}, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


@api_view(["GET"])
def list_pending_requests(request):
    """
    Returns all PendingRequest entries as JSON.
    """
    try:
        pending_requests = PendingRequest.objects.all().order_by("-request_date")  # latest first
        serializer = PendingRequestSerializer(pending_requests, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
#---------------
@api_view(['GET'])
def track_user_progress(request):
    applicant_id = request.GET.get('applicant_id')
    if not applicant_id:
        return Response({"error": "Missing applicant_id"}, status=400)

    exists = PendingRequest.objects.filter(applicant_id=applicant_id).exists()
    return Response({"exists": exists})
