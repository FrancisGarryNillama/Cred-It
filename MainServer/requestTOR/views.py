from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.utils import timezone
from .models import RequestTOR
from .serializers import RequestTORSerializer
from profiles.models import Profile  # ✅ check if profile exists
from finalDocuments.models import listFinalTor

#DocumentPage
@api_view(["POST"])
def update_request_tor_status(request):
    account_id = request.data.get("account_id", "").strip()
    new_status = request.data.get("status")

    if not account_id or not new_status:
        return Response({"detail": "account_id and status are required."}, status=400)

    try:
        print("Searching RequestTOR for accountID:", account_id)
        request_tor = RequestTOR.objects.get(accountID=account_id)
        request_tor.status = new_status
        request_tor.save()
        return Response({"detail": f"Status updated to {new_status}"}, status=200)

    except RequestTOR.DoesNotExist:
        return Response({"detail": f"RequestTOR entry not found for accountID '{account_id}'"}, status=404)



@api_view(["POST"])
def finalize_request(request):
    """
    Finalize a RequestTOR entry — moves it into listFinalTor with 'Finalized' status
    and timestamps the accepted_date.
    """
    account_id = request.data.get("account_id")

    if not account_id:
        return Response({"error": "Missing account_id"}, status=status.HTTP_400_BAD_REQUEST)

    try:
        tor_request = RequestTOR.objects.get(accountID=account_id)
    except RequestTOR.DoesNotExist:
        return Response({"error": "RequestTOR entry not found"}, status=status.HTTP_404_NOT_FOUND)

    # Create or update final record
    listFinalTor.objects.update_or_create(
        accountID=tor_request.accountID,
        defaults={
            "applicant_name": tor_request.applicant_name,
            "status": "Finalized",
            "request_date": tor_request.request_date,
            "accepted_date": timezone.now(),
        },
    )

    # Optionally delete the original RequestTOR entry (uncomment if you want to move, not copy)
    # tor_request.delete()

    return Response(
        {"message": "Request successfully finalized and moved to listFinalTor."},
        status=status.HTTP_200_OK,
    )
#DocumentPage

@api_view(['GET'])
def get_all_requests(request):
    requests = RequestTOR.objects.all()
    serializer = RequestTORSerializer(requests, many=True)
    return Response(serializer.data)

@api_view(["POST"])
def create_request_tor(request):
    account_id = request.data.get("account_id")

    if not account_id:
        return Response({"error": "Missing account_id"}, status=status.HTTP_400_BAD_REQUEST)

    # ✅ Check if Profile exists
    try:
        profile = Profile.objects.get(user_id=account_id)
    except Profile.DoesNotExist:
        return Response(
            {"error": "Please Fill up your Profile First, This can be found in the Navbar"},
            status=status.HTTP_400_BAD_REQUEST
        )

    # ✅ Create RequestTOR
    request_tor = RequestTOR.objects.create(
        accountID=account_id,
        applicant_name=profile.name,
        status="Pending",
        request_date=timezone.now(),
    )

    serializer = RequestTORSerializer(request_tor)
    return Response(serializer.data, status=status.HTTP_201_CREATED)

#---------------------
@api_view(['GET'])
def track_user_progress(request):
    accountID = request.GET.get('accountID')
    if not accountID:
        return Response({"error": "Missing accountID"}, status=400)

    exists = RequestTOR.objects.filter(accountID=accountID).exists()
    return Response({"exists": exists})