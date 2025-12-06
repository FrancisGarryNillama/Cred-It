"""URL configuration for pendingRequest app"""
from django.urls import path
from . import views

app_name = 'pendingrequest'

urlpatterns = [
    path('', views.list_pending_requests, name='list_pending'),
    path('update_status/', views.update_pending_request_status, name='update_status'),
    path('update_status_for_document/', views.update_status_for_document, name='update_status_document'),
    path('finalize/', views.finalize_pending_request, name='finalize'),
    path('track_user_progress/', views.track_user_progress, name='track_progress'),
]