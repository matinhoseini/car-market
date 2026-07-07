from django.urls import path
from .views import register, profile

urlpatterns = [
    path('register/', register),
    path('profile/', profile),
]