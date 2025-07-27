from django.shortcuts import render
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from django.contrib.auth import get_user_model
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework import status
from django.db import IntegrityError
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json


User = get_user_model()

class RegisterUser(APIView):
    def post(self, request):
        print("DATA RECEIVED:", request.data)
        email = request.data.get('email')
        full_name = request.data.get('full_name')
        password = request.data.get('password')

        if not email or not password or not full_name:
            return Response({"message": "All fields are required."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user = User.objects.create_user(email=email, full_name=full_name, password=password)
            return Response({"message": "Successfully Created"}, status=status.HTTP_201_CREATED)
        except IntegrityError:
            return Response({"message": "Account taken, try again"}, status=status.HTTP_400_BAD_REQUEST)


@csrf_exempt
def LoginUser(request):
    if request.method == "POST":
        data = json.loads(request.body)
        email = data.get('email')
        password = data.get('password')
        user = authenticate(username=email, password=password)
        if user:
            return JsonResponse({'message': 'Login successful'}, status=200)
        else:
            return JsonResponse({'message': 'Invalid credentials'}, status=401)


@csrf_exempt
def login_view(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            email = data.get('email')
            password = data.get('password')

            try:
                user = User.objects.get(email=email)
            except User.DoesNotExist:
                return JsonResponse({'error': 'Account does not exist'}, status=404)

            user = authenticate(username=user.email, password=password)  # ✅ double check username=email here
            if user is None:
                return JsonResponse({'error': 'Incorrect password'}, status=401)

            print("LOGIN SUCCESS — FULL NAME:", user.full_name)  # ✅ server log check

            return JsonResponse({
                'message': 'Login successful',
                'name': user.full_name,  # ✅ must be here
            }, status=200)

        except Exception as e:
            print("ERROR:", str(e))
            return JsonResponse({'error': 'Invalid request format.'}, status=400)

    return JsonResponse({'error': 'Invalid request method.'}, status=405)


