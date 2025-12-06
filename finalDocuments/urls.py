"""URL configuration for finalDocuments app"""
from django.urls import path
from . import views

app_name = 'finaldocuments'

urlpatterns = [
    path('finalize_request/', views.finalize_request, name='finalize_request'),
    path('listFinalTor/', views.get_all_final_tor, name='list_final_tor'),
    path('track_user_progress/', views.track_user_progress, name='track_progress'),
    path('statistics/', views.get_workflow_statistics, name='statistics'),
]
