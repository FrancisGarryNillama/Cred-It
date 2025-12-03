from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.utils import timezone

from pendingRequest.models import PendingRequest
from .models import listFinalTor
from .serializers import listFinalTorSerializer

@api_view(["POST"])
def finalize_request(request):
    account_id = request.data.get("account_id")
    if not account_id:
        return Response({"detail": "account_id is required."}, status=400)

    try:
        # Get the PendingRequest entry
        pending = PendingRequest.objects.get(applicant_id=account_id)

        # Move to listFinalTor with updated status and accepted_date
        final_entry = listFinalTor.objects.create(
            accountID=pending.applicant_id,
            applicant_name=pending.applicant_name,
            status="Finalized",                     # ✅ Set status
            request_date=pending.request_date,
            accepted_date=timezone.now()           # ✅ Set current time
        )

        # Optionally, delete from PendingRequest
        pending.delete()

        return Response({"success": True, "detail": "Request finalized successfully."})

    except PendingRequest.DoesNotExist:
        return Response({"detail": f"No PendingRequest found for account_id '{account_id}'"}, status=404)
    except Exception as e:
        return Response({"detail": str(e)}, status=500)
    
@api_view(["GET"])
def get_all_final_tor(request):
    queryset = listFinalTor.objects.all()
    serializer = listFinalTorSerializer(queryset, many=True)
    return Response(serializer.data)


#---------------------
@api_view(['GET'])
def track_user_progress(request):
    accountID = request.GET.get('accountID')
    if not accountID:
        return Response({"error": "Missing accountID"}, status=400)

    exists = listFinalTor.objects.filter(accountID=accountID).exists()
    return Response({"exists": exists})