"""URL configuration for profiles app"""
from django.urls import path
from . import views

app_name = 'profiles'

urlpatterns = [
    # CRUD operations
    path('profile/save/', views.save_profile, name='save_profile'),
    path('profile/<str:user_id>/', views.get_profile, name='get_profile'),
    path('profile/', views.get_profiles, name='get_profiles'),
    path('profile/<str:user_id>/update/', views.update_profile, name='update_profile'),
    path('profile/<str:user_id>/delete/', views.delete_profile, name='delete_profile'),
    
    # Utility endpoints
    path('profile/exists/', views.check_profile_exists, name='check_profile_exists'),
    path('profile/incomplete/', views.get_incomplete_profiles, name='incomplete_profiles'),
    path('profile/statistics/', views.get_profile_statistics, name='profile_statistics'),
]