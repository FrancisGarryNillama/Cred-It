from django.http import JsonResponse
from django.contrib.auth.hashers import make_password, check_password
from django.views.decorators.csrf import csrf_exempt
import json
from .models import CreditAccount

@csrf_exempt
def register_credit_profile(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            account_id = data.get("AccountID")
            account_pass = data.get("AccountPass")

            if not account_id or not account_pass:
                return JsonResponse({"error": "AccountID and Password are required"}, status=400)

            if CreditAccount.objects.filter(AccountID=account_id).exists():
                return JsonResponse({"error": "(ID taken, try again.)"}, status=409)

            # Save with hashed password
            credit_profile = CreditAccount(
                AccountID=account_id,
                AccountPass=make_password(account_pass),  
                Status="Student"
            )
            credit_profile.save()

            return JsonResponse({"message": "Registered successfully!"}, status=201)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)
    return JsonResponse({"error": "Invalid request"}, status=400)

@csrf_exempt
def login_credit_profile(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            account_id = data.get("AccountID")
            account_pass = data.get("AccountPass")

            if not account_id or not account_pass:
                return JsonResponse({"error": "AccountID and Password are required"}, status=400)

            try:
                profile = CreditAccount.objects.get(AccountID=account_id)
                role = profile.Status.capitalize()  # ensure "Student" or "Faculty"

                if role == "Student":
                    if check_password(account_pass, profile.AccountPass):
                        return JsonResponse({"message": "Login successful", "status": role}, status=200)
                    else:
                        return JsonResponse({"error": "Incorrect password"}, status=401)
                else:  # Faculty/Admin
                    if account_pass == profile.AccountPass:
                        return JsonResponse({"message": "Login successful", "status": role}, status=200)
                    else:
                        return JsonResponse({"error": "Incorrect password"}, status=401)

            except CreditAccount.DoesNotExist:
                return JsonResponse({"error": "Account not found"}, status=404)

        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)

    return JsonResponse({"error": "Invalid request"}, status=400)