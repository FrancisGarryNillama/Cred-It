from django.urls import path
from .views import register_credit_profile, login_credit_profile

urlpatterns = [
    path("register/", register_credit_profile, name="register_credit_profile"),
    path("login/", login_credit_profile, name="login_credit_profile"),
]