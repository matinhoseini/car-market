from django.urls import path
from .views import StartConversationView

urlpatterns = [
    path(
        "<int:car_id>/start/",
        StartConversationView.as_view(),
    ),
]