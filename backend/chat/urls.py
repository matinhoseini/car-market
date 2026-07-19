from django.urls import path
from .views import (
    StartConversationView,
    ConversationListView,
    MessageListCreateView,
)

urlpatterns = [
    path(
        "<int:car_id>/start/",
        StartConversationView.as_view(),
    ),

    path(
        "conversations/",
        ConversationListView.as_view(),
    ),

    path(
        "conversations/<int:conversation_id>/messages/",
        MessageListCreateView.as_view(),
    ),
]