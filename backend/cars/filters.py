import django_filters

from .models import Car


class CarFilter(django_filters.FilterSet):

    min_price = django_filters.NumberFilter(
        field_name='price',
        lookup_expr='gte'
    )

    max_price = django_filters.NumberFilter(
        field_name='price',
        lookup_expr='lte'
    )

    class Meta:
        model = Car

        fields = {
            'brand': ['exact'],
            'city': ['exact'],
            'fuel_type': ['exact'],
            'gearbox': ['exact'],
            'year': ['exact'],
        }