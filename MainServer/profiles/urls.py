from django.urls import path
from . import views

urlpatterns = [
    path("profile/save/", views.save_profile, name="save_profile"),
    path("profile/<str:user_id>/", views.get_profile, name="get_profile"),
    path("profile/", views.get_profiles, name="get_profiles"),
]