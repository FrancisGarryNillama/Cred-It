from django.urls import path
from . import views

urlpatterns = [
    path('upload/preview/', views.upload_preview),
    path('upload/full/', views.upload_full),
]
