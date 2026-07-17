import json

from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async


class ChatConsumer(AsyncWebsocketConsumer):

    async def connect(self):
        print("CONNECT START")

        self.room_name = self.scope["url_route"]["kwargs"]["conversation_id"]
        self.room_group_name = f"chat_{self.room_name}"

        print("ROOM =", self.room_group_name)

        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )

        await self.accept()

        print("ACCEPTED")

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

        print("DISCONNECTED", close_code)

    async def receive(self, text_data):
        print("RAW:", text_data)

        data = json.loads(text_data)
        message = data["message"]

        print("MESSAGE:", message)

        # ذخیره در دیتابیس
        await self.save_message(message)

        # ارسال برای همه اعضای روم
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                "type": "chat_message",
                "message": message,
            }
        )

    async def chat_message(self, event):
        await self.send(
            text_data=json.dumps(
                {
                    "message": event["message"]
                },
                ensure_ascii=False
            )
        )

    @database_sync_to_async
    def save_message(self, text):
        from .models import Conversation, Message

        conversation = Conversation.objects.get(id=self.room_name)

        # فعلاً فرستنده را تستی گذاشتیم
        Message.objects.create(
            conversation=conversation,
            sender=conversation.buyer,
            text=text
        )