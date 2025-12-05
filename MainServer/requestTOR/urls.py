"""URL configuration for requestTOR app"""
from django.urls import path
from . import views

app_name = 'requesttor'

urlpatterns = [
    path('request-tor/', views.create_request_tor, name='create_request'),
    path('requestTOR/', views.get_all_requests, name='get_all_requests'),
    path('update_status/', views.update_request_tor_status, name='update_status'),
    path('accept-request/', views.accept_request, name='accept_request'),
    path('deny/<str:applicant_id>/', views.deny_request, name='deny_request'),
    path('finalize_request/', views.finalize_request, name='finalize_request'),
    path('track_user_progress/', views.track_user_progress, name='track_progress'),
]
