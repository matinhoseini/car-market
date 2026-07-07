from django.db import models
from django.contrib.auth.models import User


class Car(models.Model):
    owner = models.ForeignKey(User, on_delete=models.CASCADE)
    brand = models.CharField(max_length=100)
    model = models.CharField(max_length=100)
    year = models.PositiveIntegerField()
    price = models.PositiveBigIntegerField()
    created_at = models.DateTimeField(auto_now_add=True)