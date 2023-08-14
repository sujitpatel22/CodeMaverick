from channels.db import database_sync_to_async
from django.contrib.auth.models import AnonymousUser
from urllib.parse import parse_qs
from django.contrib.auth import get_user_model

User = get_user_model()

@database_sync_to_async
def get_user(scope):
    query_string = parse_qs(scope.get("query_string", b"").decode())
    user_id = query_string.get("user_id")
    if user_id:
        try:
            return User.objects.get(id=int(user_id[0]))
        except User.DoesNotExist:
            return AnonymousUser()
    return AnonymousUser()

class WebSocketAuthMiddleware:
    def __init__(self, inner):
        self.inner = inner

    async def __call__(self, scope, receive, send):
        scope['user'] = await get_user(scope)
        return await self.inner(scope, receive, send)
