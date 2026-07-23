from rest_framework import serializers
from .models import Car, CarImage, Favorite


class CarImageSerializer(serializers.ModelSerializer):

    image = serializers.ImageField(required=True)

    class Meta:
        model = CarImage

        fields = [
            "id",
            "image",
            "uploaded_at",
        ]

        read_only_fields = [
            "id",
            "uploaded_at",
        ]


class CarSerializer(serializers.ModelSerializer):

    images = CarImageSerializer(
        many=True,
        read_only=True
    )

    owner_id = serializers.SerializerMethodField()
    owner_username = serializers.SerializerMethodField()
    is_favorite = serializers.SerializerMethodField()

    class Meta:
        model = Car

        fields = [
            "id",
            "brand",
            "model",
            "year",
            "price",
            "description",
            "mileage",
            "city",
            "fuel_type",
            "gearbox",
            "owner_id",
            "owner_username",
            "is_favorite",
            "images",
            "created_at",
        ]

        read_only_fields = [
            "id",
            "created_at",
            "owner_id",
            "owner_username",
            "images",
        ]

    def get_owner_id(self, obj):
        return obj.owner.id

    def get_owner_username(self, obj):
        return obj.owner.username

    def get_is_favorite(self, obj):

        request = self.context.get("request")

        if request is None:
            return False

        if not request.user.is_authenticated:
            return False

        return Favorite.objects.filter(
            user=request.user,
            car=obj
        ).exists()


class FavoriteSerializer(serializers.ModelSerializer):

    car = CarSerializer(read_only=True)

    class Meta:
        model = Favorite

        fields = [
            "id",
            "car",
            "created_at",
        ]

    def get_fields(self):
        fields = super().get_fields()
        fields["car"] = CarSerializer(
            read_only=True,
            context=self.context
        )
        return fields


class PublicUserSerializer(serializers.Serializer):

    id = serializers.IntegerField()
    username = serializers.CharField()
    cars_count = serializers.IntegerField()
    cars = CarSerializer(many=True)