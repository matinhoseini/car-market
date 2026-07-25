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

    buyer_username = serializers.CharField(source="buyer.username", read_only=True)
    seller_username = serializers.CharField(source="seller.username", read_only=True)
    car_brand = serializers.CharField(source="car.brand", read_only=True)
    car_model = serializers.CharField(source="car.model", read_only=True)

    last_message = serializers.SerializerMethodField()
    last_message_time = serializers.SerializerMethodField()
    unread_count = serializers.SerializerMethodField()

    class Meta:
        model = Conversation
        fields = [
            "id",
            "car",
            "car_brand",
            "car_model",
            "buyer",
            "buyer_username",
            "seller",
            "seller_username",
            "last_message",
            "last_message_time",
            "unread_count",
            "created_at",
        ]

    def get_last_message(self, obj):
        last = obj.messages.order_by("-created_at").first()

        if last is None:
            return None

        return last.text

    def get_last_message_time(self, obj):
        last = obj.messages.order_by("-created_at").first()

        if last is None:
            return None

        return last.created_at

    def get_unread_count(self, obj):
        request = self.context.get("request")

        if request is None or not request.user.is_authenticated:
            return 0

        return obj.messages.filter(
            is_read=False
        ).exclude(
            sender=request.user
        ).count()