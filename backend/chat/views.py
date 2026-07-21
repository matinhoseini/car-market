from django.db.models import Q

from rest_framework import status
from rest_framework.generics import ListAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from cars.models import Car
from .models import Conversation, Message
from .serializers import ConversationSerializer, MessageSerializer


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


class ConversationListView(ListAPIView):
    serializer_class = ConversationSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Conversation.objects.filter(
            Q(buyer=self.request.user) |
            Q(seller=self.request.user)
        ).order_by("-created_at")


class MessageListCreateView(APIView):
    permission_classes = [IsAuthenticated]

    def get_conversation(self, conversation_id, user):
        try:
            conversation = Conversation.objects.get(id=conversation_id)
        except Conversation.DoesNotExist:
            return None, Response(
                {"error": "Conversation not found"},
                status=status.HTTP_404_NOT_FOUND
            )

        if user not in [conversation.buyer, conversation.seller]:
            return None, Response(
                {"error": "Access denied"},
                status=status.HTTP_403_FORBIDDEN
            )

        return conversation, None

    def get(self, request, conversation_id):

        conversation, error = self.get_conversation(
            conversation_id,
            request.user
        )

        if error:
            return error

        messages = Message.objects.filter(
            conversation=conversation
        ).order_by("created_at")

        serializer = MessageSerializer(messages, many=True)

        return Response(serializer.data)

    def post(self, request, conversation_id):

        conversation, error = self.get_conversation(
            conversation_id,
            request.user
        )

        if error:
            return error

        serializer = MessageSerializer(data=request.data)

        if serializer.is_valid():

            serializer.save(
                conversation=conversation,
                sender=request.user
            )

            return Response(
                serializer.data,
                status=status.HTTP_201_CREATED
            )

        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )