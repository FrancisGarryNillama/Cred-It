"""
Main URL configuration for the Credit System.
"""
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    # Admin interface
    path('admin/', admin.site.urls),
    
    # API endpoints - all apps with namespaces
    path('api/', include('creditapp.urls', namespace='creditapp')),
    path('api/', include('torchecker.urls', namespace='torchecker')),
    path('api/', include('curriculum.urls', namespace='curriculum')),
    path('api/', include('profiles.urls', namespace='profiles')),
    path('api/', include('requestTOR.urls', namespace='requesttor')),
    path('api/pendingRequest/', include('pendingRequest.urls', namespace='pendingrequest')),
    path('api/finalDocuments/', include('finalDocuments.urls', namespace='finaldocuments')),
]

# Serve media files in development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
    
    # Add debug toolbar in development
    if 'debug_toolbar' in settings.INSTALLED_APPS:
        import debug_toolbar
        urlpatterns = [
            path('__debug__/', include(debug_toolbar.urls)),
        ] + urlpatterns

# Custom admin site configuration
admin.site.site_header = "Credit Evaluation System Administration"
admin.site.site_title = "Credit System Admin"
admin.site.index_title = "Welcome to Credit Evaluation System"