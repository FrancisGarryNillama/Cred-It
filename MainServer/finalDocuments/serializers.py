from rest_framework import serializers
from .models import listFinalTor

class listFinalTorSerializer(serializers.ModelSerializer):
    class Meta:
        model = listFinalTor
        fields = ['accountID', 'applicant_name', 'status', 'request_date', 'accepted_date']
