import django_filters

from .models import Car


class CarFilter(django_filters.FilterSet):

    price_min = django_filters.NumberFilter(
        field_name='price',
        lookup_expr='gte'
    )

    price_max = django_filters.NumberFilter(
        field_name='price',
        lookup_expr='lte'
    )

    year_min = django_filters.NumberFilter(
        field_name='year',
        lookup_expr='gte'
    )

    year_max = django_filters.NumberFilter(
        field_name='year',
        lookup_expr='lte'
    )

    class Meta:
        model = Car

        fields = [
            'brand',
            'city',
            'fuel_type',
            'gearbox',
        ]