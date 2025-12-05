"""URL configuration for credit app"""
from django.urls import path
from . import views

app_name = 'creditapp'

urlpatterns = [
    path('register/', views.register_credit_profile, name='register'),
    path('login/', views.login_credit_profile, name='login'),
    path('change-password/', views.change_password, name='change_password'),
    path('account/', views.get_account_info, name='account_info'),
    path('statistics/', views.get_statistics, name='statistics'),
]