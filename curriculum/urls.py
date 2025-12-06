"""URL configuration for curriculum app"""
from django.urls import path
from . import views

app_name = 'curriculum'

urlpatterns = [
    # Grading operations
    path('apply-standard/', views.apply_standard, name='apply_standard'),
    path('apply-reverse/', views.apply_reverse, name='apply_reverse'),
    
    # TOR operations
    path('copy-tor/', views.copy_tor_entries, name='copy_tor'),
    path('sync-completed/', views.sync_completed, name='sync_completed'),
    path('update-tor-results/', views.update_tor_results, name='update_tor_results'),
    
    # Retrieval
    path('compareResultTOR/', views.get_compare_result, name='compare_result'),
    path('citTorContent/', views.get_cit_tor_content, name='cit_tor_content'),
    
    # Updates
    path('update_credit_evaluation/', views.update_credit_evaluation, name='update_credit_evaluation'),
    path('update_note/', views.update_note, name='update_note'),
    path('update_cit_tor_entry/', views.update_cit_tor_entry, name='update_cit_tor_entry'),
    
    # Tracking
    path('tracker_accreditation/', views.tracker_accreditation, name='tracker_accreditation'),
    path('comparison-statistics/', views.get_comparison_statistics, name='comparison_statistics'),
]
