from django.urls import path
from .views import create_request_tor
from . import views

urlpatterns = [
    path("request-tor/", create_request_tor, name="request-tor"),
    path('requestTOR/', views.get_all_requests, name='get_all_requests'),
    path("update_status/", views.update_request_tor_status, name="update_request_tor_status"),
    path("finalize_request/", views.finalize_request, name="finalize_request"),
    path("track_user_progress/", views.track_user_progress, name="track_user_progress"),
]
