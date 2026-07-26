from django.core.cache import cache

from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view, permission_classes
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from rest_framework.response import Response

from drf_spectacular.utils import extend_schema

from .serializers import RegisterSerializer, ProfileSerializer


@extend_schema(
    request=RegisterSerializer,
    responses={201: dict}
)
@api_view(['POST'])
def register(request):
    serializer = RegisterSerializer(data=request.data)

    if serializer.is_valid():
        serializer.save()

        return Response(
            {
                "message": "user created"
            },
            status=201
        )

    return Response(serializer.errors, status=400)


@extend_schema(
    request=ProfileSerializer,
    responses=ProfileSerializer
)
@api_view(['GET', 'PATCH'])
@permission_classes([IsAuthenticated])
def profile(request):

    if request.method == 'GET':
        serializer = ProfileSerializer(request.user)
        return Response(serializer.data)

    data = request.data.copy()

    for field in ['username', 'email', 'phone_number', 'bio', 'avatar']:
        if data.get(field) == '':
            data.pop(field)

    serializer = ProfileSerializer(
        request.user,
        data=data,
        partial=True,
    )

    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)

    return Response(serializer.errors, status=400)


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