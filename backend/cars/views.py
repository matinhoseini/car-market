from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from drf_spectacular.utils import extend_schema

from .serializers import CarSerializer


@extend_schema(
    request=CarSerializer,
    responses=CarSerializer,
)
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_car(request):
    serializer = CarSerializer(data=request.data)

    if serializer.is_valid():
        serializer.save(owner=request.user)
        return Response(serializer.data, status=201)

    return Response(serializer.errors, status=400)