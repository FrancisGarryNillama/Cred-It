from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Profile
from .serializers import ProfileSerializer

@api_view(["GET"])
def get_profiles(request):
    user_id = request.GET.get("user_id")
    if user_id:
        profiles = Profile.objects.filter(user_id=user_id)
    else:
        profiles = Profile.objects.all()
    serializer = ProfileSerializer(profiles, many=True)
    return Response(serializer.data)

@api_view(["POST"])
def save_profile(request):
    user_id = request.data.get("user_id")
    if not user_id:
        return Response({"user_id": ["This field is required."]}, status=status.HTTP_400_BAD_REQUEST)

    try:
        # Try to get existing profile
        profile = Profile.objects.get(user_id=user_id)
        serializer = ProfileSerializer(profile, data=request.data)  # update existing
    except Profile.DoesNotExist:
        serializer = ProfileSerializer(data=request.data)  # create new

    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_200_OK)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(["GET"])
def get_profile(request, user_id):
    try:
        profile = Profile.objects.get(user_id=user_id)
        serializer = ProfileSerializer(profile)
        return Response(serializer.data)
    except Profile.DoesNotExist:
        return Response({"detail": "Profile not found"}, status=status.HTTP_404_NOT_FOUND)
