from django.urls import path
from .views import RegisterUser, LoginUser, login_view

urlpatterns = [
    path('register/', RegisterUser.as_view(), name='register'),
    path('login/', login_view, name='login'),
]
