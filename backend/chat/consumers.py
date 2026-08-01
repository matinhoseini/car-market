import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from django.core.cache import cache


class ChatConsumer(AsyncWebsocketConsumer):

    async def connect(self):
        self.room_name = self.scope["url_route"]["kwargs"]["conversation_id"]
        self.room_group_name = f"chat_{self.room_name}"

        user = self.scope["user"]

        if user.is_anonymous:
            print("❌ Anonymous user rejected")
            await self.close()
            return

        # ============================================
        # ✅ بررسی دسترسی
        # ============================================
        has_access = await self.check_user_access(user)

        if not has_access:
            print(f"❌ {user.username} has no access to conversation {self.room_name}")
            await self.close()
            return

        # ============================================
        # ✅ پیوستن به گروه و قبول اتصال
        # ============================================
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )

        await self.accept()

        print(f"✅ {user.username} connected to conversation {self.room_name}")

        # ============================================
        # ✅ ارسال پیام خوش‌آمدگویی (اختیاری)
        # ============================================
        await self.send(
            text_data=json.dumps(
                {
                    "type": "connection",
                    "status": "connected",
                    "conversation": self.room_name,
                },
                ensure_ascii=False,
            )
        )

    async def disconnect(self, close_code):
        user = self.scope.get("user")
        username = user.username if user and not user.is_anonymous else "Unknown"
        
        print(f"🔌 {username} disconnected from conversation {self.room_name} (code: {close_code})")
        
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    async def receive(self, text_data):
        print(f"📩 Received: {text_data}")

        try:
            data = json.loads(text_data)
        except json.JSONDecodeError as e:
            print(f"❌ JSON ERROR: {e}")
            return

        event_type = data.get("type")
        sender = self.scope["user"]

        # ============================================
        # ⌨️ Typing indicator
        # ============================================
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

        # ============================================
        # 💬 Message
        # ============================================
        message = data.get("message") or data.get("payload", {}).get("text")

        if not message:
            print("❌ No message found in data")
            return

        print(f"💬 Message from {sender.username}: {message}")

        try:
            # ذخیره در دیتابیس
            saved_message = await self.save_message(message, sender)

            # ارسال به گروه
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    "type": "chat_message",
                    "message": {
                        "id": saved_message.id,
                        "sender": sender.id,
                        "sender_username": sender.username,
                        "text": saved_message.text,
                        "created_at": saved_message.created_at.isoformat(),
                        "is_read": saved_message.is_read,
                    }
                }
            )
        except Exception as e:
            print(f"❌ Error saving message: {e}")
            await self.send(
                text_data=json.dumps(
                    {
                        "type": "error",
                        "message": "Failed to save message",
                    },
                    ensure_ascii=False,
                )
            )

    async def chat_message(self, event):
        await self.send(
            text_data=json.dumps(
                {
                    "type": "message",
                    "payload": event["message"],
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
            
            # ✅ چک کردن دسترسی کاربر (با 2 روش)
            has_access = (
                conversation.buyer_id == user.id or
                conversation.seller_id == user.id
            )
            
            print(f"🔍 Access check for {user.username}:")
            print(f"   Conversation {self.room_name} - Buyer: {conversation.buyer_id}, Seller: {conversation.seller_id}")
            print(f"   User ID: {user.id}")
            print(f"   Has access: {has_access}")
            
            return has_access

        except Conversation.DoesNotExist:
            print(f"❌ Conversation {self.room_name} does not exist!")
            return False
        except Exception as e:
            print(f"❌ Error in check_user_access: {e}")
            return False

    @database_sync_to_async
    def save_message(self, text, sender):
        from .models import Conversation, Message

        conversation = Conversation.objects.get(id=self.room_name)
        
        message = Message.objects.create(
            conversation=conversation,
            sender=sender,
            text=text,
        )
        
        print(f"💾 Message saved: {message.id}")
        return message


# ============================================
# 📍 Presence Consumer (Online Status)
# ============================================
PRESENCE_CACHE_KEY = "online_user_counts"


class PresenceConsumer(AsyncWebsocketConsumer):
    GROUP_NAME = "online_users"

    async def connect(self):
        user = self.scope["user"]

        if user.is_anonymous:
            print("❌ Anonymous user rejected for presence")
            await self.close()
            return

        await self.channel_layer.group_add(
            self.GROUP_NAME,
            self.channel_name
        )

        await self.accept()

        became_online = await self.mark_user_online(user.id)

        if became_online:
            await self.channel_layer.group_send(
                self.GROUP_NAME,
                {
                    "type": "presence_event",
                    "user_id": user.id,
                    "username": user.username,
                    "is_online": True,
                }
            )

        print(f"✅ {user.username} connected to presence")

    async def disconnect(self, close_code):
        user = self.scope["user"]

        if not user.is_anonymous:
            became_offline = await self.mark_user_offline(user.id)

            if became_offline:
                await self.channel_layer.group_send(
                    self.GROUP_NAME,
                    {
                        "type": "presence_event",
                        "user_id": user.id,
                        "username": user.username,
                        "is_online": False,
                    }
                )

        await self.channel_layer.group_discard(
            self.GROUP_NAME,
            self.channel_name
        )

        print(f"🔌 User disconnected from presence")

    async def presence_event(self, event):
        await self.send(
            text_data=json.dumps(
                {
                    "type": "presence",
                    "user_id": event["user_id"],
                    "username": event["username"],
                    "is_online": event["is_online"],
                },
                ensure_ascii=False,
            )
        )

    @database_sync_to_async
    def mark_user_online(self, user_id):
        counts = cache.get(PRESENCE_CACHE_KEY, {})
        counts[user_id] = counts.get(user_id, 0) + 1

        became_online = counts[user_id] == 1

        cache.set(PRESENCE_CACHE_KEY, counts, timeout=None)

        return became_online

    @database_sync_to_async
    def mark_user_offline(self, user_id):
        counts = cache.get(PRESENCE_CACHE_KEY, {})

        if user_id in counts:
            counts[user_id] -= 1

            if counts[user_id] <= 0:
                del counts[user_id]
                became_offline = True
            else:
                became_offline = False
        else:
            became_offline = True

        cache.set(PRESENCE_CACHE_KEY, counts, timeout=None)

        return became_offline