"use client";

import { useRouter } from "next/router";
import { useConversations } from "../../../hooks/useConversations";
import ChatWindow from "../../../components/chat/ChatWindow";
import DashboardLayout from "../../../components/dashboard/DashboardLayout";

const ChatPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const conversationId = parseInt(id);

  // ============================================
  // 📋 Get conversation details
  // ============================================
  const { data: conversations, isLoading } = useConversations();
  const conversation = conversations?.find((c) => c.id === conversationId);

  // ============================================
  // 🎨 Render
  // ============================================
  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-[calc(100vh-200px)]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500 mx-auto"></div>
            <p className="mt-2 text-[rgb(var(--muted-foreground))]">
              Loading conversation...
            </p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!conversation) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-[calc(100vh-200px)]">
          <div className="text-center">
            <p className="text-4xl mb-2">🔍</p>
            <p className="text-[rgb(var(--muted-foreground))]">
              Conversation not found
            </p>
            <Link
              href="/dashboard/messages"
              className="text-primary-500 hover:underline mt-2 inline-block"
            >
              ← Back to messages
            </Link>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // Extract other user (the one who is not current user)
  const otherUser = conversation.seller_username
    ? { username: conversation.seller_username }
    : { username: conversation.buyer_username };

  const carInfo = {
    id: conversation.car_id,
    brand: conversation.car_brand,
    model: conversation.car_model,
  };

  return (
    <DashboardLayout>
      <div className="h-[calc(100vh-200px)] bg-[rgb(var(--background))] rounded-xl border border-[rgb(var(--border))] overflow-hidden">
        <ChatWindow
          conversationId={conversationId}
          otherUser={otherUser}
          carInfo={carInfo}
        />
      </div>
    </DashboardLayout>
  );
};

export default ChatPage;
