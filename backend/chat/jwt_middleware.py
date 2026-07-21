from urllib.parse import parse_qs

from channels.middleware import BaseMiddleware
from channels.db import database_sync_to_async

from rest_framework_simplejwt.tokens import AccessToken


@database_sync_to_async
def get_user(user_id):
    from django.contrib.auth import get_user_model
    from django.contrib.auth.models import AnonymousUser

    User = get_user_model()

    try:
        return User.objects.get(id=user_id)
    except User.DoesNotExist:
        return AnonymousUser()


class JwtAuthMiddleware(BaseMiddleware):

    async def __call__(self, scope, receive, send):

        from django.contrib.auth.models import AnonymousUser

        scope["user"] = AnonymousUser()

        query_params = parse_qs(scope["query_string"].decode())

        token = query_params.get("token")

        if token:
            try:
                access_token = AccessToken(token[0])

                user = await get_user(access_token["user_id"])

                scope["user"] = user

                print(f"[JWT] Authenticated -> {user.username}")

            except Exception as e:
                print(f"[JWT ERROR] {e}")

        return await super().__call__(scope, receive, send)