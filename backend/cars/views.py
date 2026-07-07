from rest_framework.generics import RetrieveAPIView, RetrieveUpdateDestroyAPIView
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from drf_spectacular.utils import extend_schema

from .serializers import CarSerializer
from .models import Car
from .permissions import IsOwner


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


@extend_schema(
    responses=CarSerializer(many=True),
)
@api_view(['GET'])
def car_list(request):
    cars = Car.objects.all()

    serializer = CarSerializer(cars, many=True)

    return Response(serializer.data)


class CarDetailView(RetrieveAPIView):
    queryset = Car.objects.all()
    serializer_class = CarSerializer


class CarManageView(RetrieveUpdateDestroyAPIView):
    queryset = Car.objects.all()
    serializer_class = CarSerializer
    permission_classes = [IsOwner]