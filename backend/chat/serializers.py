from rest_framework import serializers

from .models import Conversation, Message


class MessageSerializer(serializers.ModelSerializer):

    sender_username = serializers.CharField(
        source="sender.username",
        read_only=True
    )

    class Meta:
        model = Message
        fields = [
            "id",
            "conversation",
            "sender",
            "sender_username",
            "text",
            "is_read",
            "created_at",
        ]
        read_only_fields = [
            "conversation",
            "sender",
            "sender_username",
            "created_at",
        ]


class ConversationSerializer(serializers.ModelSerializer):

    class Meta:
        model = Conversation
        fields = "__all__"