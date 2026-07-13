from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status

from .models import Conversation
from .serializers import ConversationSerializer
from cars.models import Car


class StartConversationView(APIView):

    permission_classes = [IsAuthenticated]

    def post(self, request, car_id):

        try:
            car = Car.objects.get(id=car_id)

        except Car.DoesNotExist:
            return Response(
                {"error": "Car not found"},
                status=status.HTTP_404_NOT_FOUND
            )

        # جلوگیری از چت با خود
        if car.owner == request.user:
            return Response(
                {"error": "You cannot chat with yourself"},
                status=status.HTTP_400_BAD_REQUEST
            )

        conversation, created = Conversation.objects.get_or_create(
            car=car,
            buyer=request.user,
            seller=car.owner,
        )

        serializer = ConversationSerializer(conversation)

        return Response(
            serializer.data,
            status=status.HTTP_201_CREATED if created else status.HTTP_200_OK
        )