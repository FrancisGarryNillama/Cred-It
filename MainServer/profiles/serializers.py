from rest_framework import serializers
from .models import Profile

class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = ["user_id", "name", "school_name", "email", "phone"]
        extra_kwargs = {
            "user_id": {"required": True},
            "name": {"required": False, "allow_blank": True},
            "school_name": {"required": False, "allow_blank": True},
            "email": {"required": False, "allow_blank": True, "allow_null": True},
            "phone": {"required": False, "allow_blank": True},
        }