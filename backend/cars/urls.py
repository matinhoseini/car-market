from django.urls import path
from .views import create_car

urlpatterns = [
    path('', create_car),
]