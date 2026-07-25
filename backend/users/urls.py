from django.urls import path
from .views import register, profile, online_users

urlpatterns = [
    path('register/', register),
    path('profile/', profile),
    path('online/', online_users),
]