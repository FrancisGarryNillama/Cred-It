from django.urls import path
from . import views

urlpatterns = [
    path('accept/', views.accept_request, name='accept_request'),
    path('deny/<str:applicant_id>/', views.deny_request, name='deny-request'),
    path("", views.list_pending_requests, name="list_pending_requests"),
    path('update_status/', views.update_pending_request_status, name='update_pending_request_status'),
    path('update_status_for_document/', views.update_status_for_document, name='update_status_for_document'),
    path('track_user_progress/', views.track_user_progress, name='track_user_progress'),
]