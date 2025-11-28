from rest_framework import serializers
from .models import CompareResultTOR, CitTorContent  

class CompareResultTORSerializer(serializers.ModelSerializer):
    class Meta:
        model = CompareResultTOR
        fields = "__all__"

class CitTorContentSerializer(serializers.ModelSerializer):
    class Meta:
        model = CitTorContent
        fields = "__all__"
