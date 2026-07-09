from django.db.models import Q

from .filters import CarFilter
from .models import Car, CarImage
from .serializers import CarSerializer, CarImageSerializer

from rest_framework.generics import (
    RetrieveAPIView,
    RetrieveUpdateDestroyAPIView
)
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from drf_spectacular.utils import extend_schema

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

    search = request.GET.get("search")

    if search:
        cars = cars.filter(
            Q(brand__icontains=search) |
            Q(model__icontains=search) |
            Q(city__icontains=search)
        )


    car_filter = CarFilter(
        request.GET,
        queryset=cars
    )

    cars = car_filter.qs


    ordering = request.GET.get("ordering")

    if ordering:
        cars = cars.order_by(ordering)


    serializer = CarSerializer(
        cars,
        many=True
    )

    return Response(serializer.data)


class CarDetailView(RetrieveAPIView):

    queryset = Car.objects.all()
    serializer_class = CarSerializer


class CarManageView(RetrieveUpdateDestroyAPIView):

    queryset = Car.objects.all()
    serializer_class = CarSerializer
    permission_classes = [IsOwner]


@extend_schema(
    request={
        'multipart/form-data': {
            'type': 'object',
            'properties': {
                'image': {
                    'type': 'string',
                    'format': 'binary'
                }
            },
            'required': ['image']
        }
    },
    responses=CarImageSerializer,
)
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def upload_car_image(request, car_id):

    try:
        car = Car.objects.get(id=car_id)

    except Car.DoesNotExist:
        return Response(
            {"error": "Car not found"},
            status=404
        )

    if car.owner != request.user:
        return Response(
            {"error": "You are not owner of this car"},
            status=403
        )

    serializer = CarImageSerializer(data=request.FILES)

    if serializer.is_valid():
        serializer.save(car=car)
        return Response(serializer.data, status=201)

    return Response(serializer.errors, status=400)


@extend_schema(
    responses={204: None}
)
@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_car_image(request, image_id):

    try:
        car_image = CarImage.objects.get(id=image_id)

    except CarImage.DoesNotExist:
        return Response(
            {"error": "Image not found"},
            status=404
        )

    if car_image.car.owner != request.user:
        return Response(
            {"error": "You are not owner of this car"},
            status=403
        )

    car_image.image.delete(save=False)

    car_image.delete()

    return Response(status=204)