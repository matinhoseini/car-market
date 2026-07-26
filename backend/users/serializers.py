from rest_framework import serializers
from django.contrib.auth.models import User


class RegisterSerializer(serializers.ModelSerializer):
    password2 = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'password2']
        extra_kwargs = {
            'password': {'write_only': True}
        }

    def validate(self, data):
        if data['password'] != data['password2']:
            raise serializers.ValidationError("Passwords do not match")

        return data

    def validate_username(self, value):
        if len(value) < 3:
            raise serializers.ValidationError(
                "Username must be at least 3 characters"
            )

        if User.objects.filter(username=value).exists():
            raise serializers.ValidationError(
                "Username already exists"
            )

        return value

    def validate_email(self, value):
        if not value:
            raise serializers.ValidationError(
                "Email is required"
            )

        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError(
                "Email already exists"
            )

        return value

    def create(self, validated_data):
        validated_data.pop('password2')

        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password']
        )

        return user


class ProfileSerializer(serializers.ModelSerializer):

    phone_number = serializers.CharField(
        source="profile.phone_number",
        required=False,
        allow_blank=True,
        allow_null=True,
    )

    bio = serializers.CharField(
        source="profile.bio",
        required=False,
        allow_blank=True,
        allow_null=True,
    )

    avatar = serializers.ImageField(
        source="profile.avatar",
        required=False,
        allow_null=True,
    )

    class Meta:
        model = User
        fields = [
            'id',
            'username',
            'email',
            'phone_number',
            'bio',
            'avatar',
        ]

    def update(self, instance, validated_data):

        profile_data = validated_data.pop("profile", {})

        for attr, value in profile_data.items():
            setattr(instance.profile, attr, value)

        instance.profile.save()

        return instance