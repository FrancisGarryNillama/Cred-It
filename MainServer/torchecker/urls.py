from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import OCRView, TorTransfereeListView, TorTransfereeViewSet, DemoOCRView, delete_ocr_entries
from . import views



router = DefaultRouter()
router.register(r'transferees', TorTransfereeViewSet, basename='transferees')


urlpatterns = [
    path('', include(router.urls)),
    path("ocr/", OCRView.as_view(), name="ocr"),
    path('upload/preview/', views.upload_preview),
    path('upload/full/', views.upload_full),
    path("demo-ocr/", DemoOCRView.as_view(), name="demo-ocr"),
    path('tor-transferees/', TorTransfereeListView.as_view(), name='tor-transferee-list'),
    path('ocr/delete', delete_ocr_entries, name='delete_ocr'),
]

