from django.urls import path
from . import views

urlpatterns = [
    path("copy-tor/", views.copy_tor_entries, name="copy-tor"),
    path("apply-reverse/", views.apply_reverse, name="apply_reverse"),
    path("apply-standard/", views.apply_standard, name="apply_standard"),
    path("citTorContent/", views.get_cit_tor_content, name="cit_tor_content"),
    path("compareResultTOR/", views.get_compare_result, name="compare_result_tor"),
    path("update_credit_evaluation/", views.update_credit_evaluation, name="update_credit_evaluation"),
    path("update_note/", views.update_note, name="update_note"),
    path("update_cit_tor_entry/", views.update_cit_tor_entry, name="update_cit_tor_entry"),
    path("update-tor-results/", views.update_tor_results, name="update_tor_results"),
    path("sync-completed/", views.sync_completed, name="sync_completed"),
    #new
    path("tracker_accreditation/", views.tracker_accreditation, name="tracker_accreditation"),
]
