# backend/apps/users/views.py
from django.core.cache import cache
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from drf_spectacular.utils import extend_schema

from .serializers import RegisterSerializer, UserSerializer


# ============================================
# 📝 REGISTER
# ============================================
@extend_schema(
    request=RegisterSerializer,
    responses={201: dict}
)
@api_view(['POST'])
@permission_classes([AllowAny])
def register(request):
    serializer = RegisterSerializer(data=request.data)

    if serializer.is_valid():
        serializer.save()
        return Response(
            {"message": "User created successfully"},
            status=status.HTTP_201_CREATED
        )
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# ============================================
# 👤 PROFILE (GET + PATCH)
# ============================================
@extend_schema(
    responses=UserSerializer
)
@api_view(['GET', 'PATCH'])
@permission_classes([IsAuthenticated])
def profile(request):
    user = request.user

    # ===== GET =====
    if request.method == 'GET':
        serializer = UserSerializer(user)
        return Response(serializer.data)

    # ===== PATCH =====
    # Only allow updating these fields
    allowed_fields = ['username', 'email']
    data = {key: value for key, value in request.data.items() if key in allowed_fields and value != ''}

    if not data:
        return Response(
            {"error": "No valid fields to update"},
            status=status.HTTP_400_BAD_REQUEST
        )

    # Update user directly
    for key, value in data.items():
        setattr(user, key, value)

    user.save()

    serializer = UserSerializer(user)
    return Response(serializer.data)


# ============================================
# 🟢 ONLINE USERS
# ============================================
@extend_schema(
    responses={200: dict}
)
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def online_users(request):
    counts = cache.get("online_user_counts", {})
    online_user_ids = list(counts.keys())
    return Response({
        "online_user_ids": online_user_ids
    })