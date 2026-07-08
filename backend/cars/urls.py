from django.urls import path
from .views import (
    create_car,
    car_list,
    CarDetailView,
    CarManageView,
    upload_car_image,
)

urlpatterns = [
    path('', create_car),
    path('list/', car_list),
    path('<int:pk>/', CarDetailView.as_view()),
    path('manage/<int:pk>/', CarManageView.as_view()),

    path('<int:car_id>/upload-image/', upload_car_image),
]