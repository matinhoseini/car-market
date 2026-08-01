from django.db import models
from django.contrib.auth.models import User
from cars.models import Car


class Conversation(models.Model):
    """
    Represents a conversation between a buyer and a seller for a specific car.
    """
    car = models.ForeignKey(
        Car,
        on_delete=models.CASCADE,
        related_name="conversations"
    )
    buyer = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="buyer_conversations"
    )
    seller = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="seller_conversations"
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        # Each buyer can have only one conversation per car
        unique_together = ("car", "buyer")

    def __str__(self):
        return f"{self.buyer.username} -> {self.seller.username}"


class Message(models.Model):
    """
    Represents a single message within a conversation.
    """
    conversation = models.ForeignKey(
        Conversation,
        on_delete=models.CASCADE,
        related_name="messages"
    )
    sender = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="sent_messages"
    )
    text = models.TextField()
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        # Prevent duplicate messages in the same conversation
        unique_together = ["conversation", "sender", "text"]
        ordering = ["created_at"]

    def __str__(self):
        return f"{self.sender.username}: {self.text[:20]}"