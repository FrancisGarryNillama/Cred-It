from rest_framework import serializers
from .models import TorTransferee

class TorTransfereeSerializer(serializers.ModelSerializer):
    class Meta:
        model = TorTransferee
        fields = '__all__'

# Serializer that ensures unique student+school combinations
class UniqueStudentSerializer(serializers.ModelSerializer):
    class Meta:
        model = TorTransferee
        fields = ['student_name', 'school_name']


