from rest_framework import serializers
from .models import Car


class CarSerializer(serializers.ModelSerializer):
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
            'created_at',
        ]

        read_only_fields = [
            'id',
            'created_at',
        ]