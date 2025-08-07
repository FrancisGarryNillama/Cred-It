from django.urls import path
from .views import OCRView
from . import views


urlpatterns = [
    path("ocr/", OCRView.as_view(), name="ocr"),
    path('upload/preview/', views.upload_preview),
    path('upload/full/', views.upload_full),
]

