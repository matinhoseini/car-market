from django.db import models
from django.contrib.auth.models import User


FUEL_CHOICES = [
    ('gasoline', 'Gasoline'),
    ('diesel', 'Diesel'),
    ('hybrid', 'Hybrid'),
    ('electric', 'Electric'),
]

GEARBOX_CHOICES = [
    ('manual', 'Manual'),
    ('automatic', 'Automatic'),
]


class Car(models.Model):

    owner = models.ForeignKey(User, on_delete=models.CASCADE)

    brand = models.CharField(max_length=100)

    model = models.CharField(max_length=100)

    year = models.PositiveIntegerField()

    price = models.PositiveBigIntegerField()

    description = models.TextField()

    mileage = models.PositiveIntegerField()

    city = models.CharField(max_length=100)

    fuel_type = models.CharField(
        max_length=20,
        choices=FUEL_CHOICES
    )

    gearbox = models.CharField(
        max_length=20,
        choices=GEARBOX_CHOICES
    )

    created_at = models.DateTimeField(auto_now_add=True)


class CarImage(models.Model):

    car = models.ForeignKey(
        Car,
        on_delete=models.CASCADE,
        related_name='images'
    )

    image = models.ImageField(
        upload_to='cars/'
    )

    uploaded_at = models.DateTimeField(
        auto_now_add=True
    )

    def __str__(self):
        return f"Image for {self.car.brand} {self.car.model}"
    
class Favorite(models.Model):

    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="favorites"
    )

    car = models.ForeignKey(
        Car,
        on_delete=models.CASCADE,
        related_name="favorited_by"
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    class Meta:
        unique_together = ("user", "car")

    def __str__(self):
        return f"{self.user.username} -> {self.car.brand} {self.car.model}"
