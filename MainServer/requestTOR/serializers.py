from rest_framework import serializers
from .models import RequestTOR

class RequestTORSerializer(serializers.ModelSerializer):
    class Meta:
        model = RequestTOR
        fields = "__all__"
