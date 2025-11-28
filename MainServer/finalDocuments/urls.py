from django.urls import path
from . import views

urlpatterns = [
    path("finalize_request/", views.finalize_request, name="finalize_request"),
    path("listFinalTor/", views.get_all_final_tor, name="listFinalTor"),
    path('track_user_progress/', views.track_user_progress, name='track_user_progress'),
]
