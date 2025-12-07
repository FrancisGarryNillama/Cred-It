"""URL configuration for torchecker app"""
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

app_name = 'torchecker'

# Setup router for viewsets
router = DefaultRouter()
router.register(r'transferees', views.TorTransfereeViewSet, basename='transferees')

urlpatterns = [
    # Router URLs
    path('', include(router.urls)),
    
    # OCR endpoints
    path('ocr/', views.ocr_view, name='ocr'),
    path('demo-ocr/', views.demo_ocr_view, name='demo_ocr'),
    path('ocr/delete/', views.delete_ocr_entries, name='delete_ocr'),
    
    # TOR endpoints
    path('tor-transferees/', views.tor_transferee_list, name='tor_transferee_list'),
    path('tor-statistics/', views.get_tor_statistics, name='tor_statistics'),
]