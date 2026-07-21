import os

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings")

from django.core.asgi import get_asgi_application

# اول جنگو بالا بیاد
django_asgi_app = get_asgi_application()

from channels.routing import ProtocolTypeRouter, URLRouter
from chat.routing import websocket_urlpatterns
from chat.jwt_middleware import JwtAuthMiddleware

application = ProtocolTypeRouter(
    {
        "http": django_asgi_app,
        "websocket": JwtAuthMiddleware(
            URLRouter(websocket_urlpatterns)
        ),
    }
)