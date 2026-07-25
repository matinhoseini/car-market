import json

from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async


class ChatConsumer(AsyncWebsocketConsumer):

    async def connect(self):

        self.room_name = self.scope["url_route"]["kwargs"]["conversation_id"]
        self.room_group_name = f"chat_{self.room_name}"

        user = self.scope["user"]

        if user.is_anonymous:
            print("Anonymous user rejected")
            await self.close()
            return

        has_access = await self.check_user_access(user)

        if not has_access:
            print(f"{user.username} has no access")
            await self.close()
            return

        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )

        await self.accept()

        print(f"{user.username} connected")

    async def disconnect(self, close_code):

        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

        print("DISCONNECTED", close_code)

    async def receive(self, text_data):

        print("=================================")
        print("RAW =", text_data)
        print("=================================")

        try:
            data = json.loads(text_data)
        except Exception as e:
            print("JSON ERROR =", e)
            return

        event_type = data.get("type")

        sender = self.scope["user"]

        if event_type == "typing":

            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    "type": "typing_event",
                    "sender": sender.username,
                    "is_typing": data.get("is_typing", True),
                }
            )

            return

        message = data.get("message")

        print("MESSAGE =", message)

        await self.save_message(message, sender)

        await self.channel_layer.group_send(
            self.room_group_name,
            {
                "type": "chat_message",
                "message": message,
                "sender": sender.username,
            }
        )

    async def chat_message(self, event):

        await self.send(
            text_data=json.dumps(
                {
                    "message": event["message"],
                    "sender": event["sender"],
                },
                ensure_ascii=False,
            )
        )

    async def typing_event(self, event):

        await self.send(
            text_data=json.dumps(
                {
                    "type": "typing",
                    "sender": event["sender"],
                    "is_typing": event["is_typing"],
                },
                ensure_ascii=False,
            )
        )

    @database_sync_to_async
    def check_user_access(self, user):

        from .models import Conversation

        try:
            conversation = Conversation.objects.get(id=self.room_name)

            return (
                conversation.buyer_id == user.id
                or
                conversation.seller_id == user.id
            )

        except Conversation.DoesNotExist:
            return False

    @database_sync_to_async
    def save_message(self, text, sender):

        from .models import Conversation, Message

        conversation = Conversation.objects.get(id=self.room_name)

        return Message.objects.create(
            conversation=conversation,
            sender=sender,
            text=text,
        )