from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view, permission_classes
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
    responses=ProfileSerializer
)
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def profile(request):
    serializer = ProfileSerializer(request.user)

    return Response(serializer.data)