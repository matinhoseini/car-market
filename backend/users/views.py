from rest_framework.decorators import api_view
from rest_framework.response import Response

from drf_spectacular.utils import extend_schema

from .serializers import RegisterSerializer


@extend_schema(
    request=RegisterSerializer,
    responses={200: dict}
)
@api_view(['POST'])
def register(request):
    serializer = RegisterSerializer(data=request.data)

    if serializer.is_valid():
        serializer.save()
        return Response({
            "message": "user created"
        })

    return Response(serializer.errors)