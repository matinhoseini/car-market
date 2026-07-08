from rest_framework import serializers
from .models import Car, CarImage


class CarImageSerializer(serializers.ModelSerializer):

    image = serializers.ImageField(
        required=True
    )

    class Meta:
        model = CarImage

        fields = [
            'id',
            'image',
            'uploaded_at',
        ]

        read_only_fields = [
            'id',
            'uploaded_at',
        ]


class CarSerializer(serializers.ModelSerializer):

    images = CarImageSerializer(
        many=True,
        read_only=True
    )

    class Meta:
        model = Car

        fields = [
            'id',
            'brand',
            'model',
            'year',
            'price',
            'description',
            'mileage',
            'city',
            'fuel_type',
            'gearbox',
            'images',
            'created_at',
        ]

        read_only_fields = [
            'id',
            'created_at',
        ]