"use client";

import { useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useConversations } from "../../../../hooks/useConversations";
import ChatWindow from "../../../../components/chat/ChatWindow";
import DashboardLayout from "../../../../components/dashboard/DashboardLayout";

const ChatPage = () => {
  const router = useRouter();
  const params = useParams();
  const conversationId = parseInt(params.id);

  // ============================================
  // Replace chat page in history with messages page
  // ============================================
  useEffect(() => {
    if (conversationId) {
      // Replace the current URL (chat) with messages page in history
      // This way, when user clicks back from messages, they go to previous page
      window.history.replaceState(
        { ...window.history.state, url: "/dashboard/messages" },
        "",
        "/dashboard/messages",
      );
    }
  }, [conversationId]);

  // ============================================
  // Handle back button - go to previous page before messages
  // ============================================
  const handleBack = () => {
    // Go back two steps: chat → messages → previous page
    router.back();
  };

  // ============================================
  // Get conversation details
  // ============================================
  const { data: conversations, isLoading } = useConversations();
  const conversation = conversations?.find((c) => c.id === conversationId);

  // ============================================
  // Render
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

  // Extract other user
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
      <div className="h-[calc(100vh-200px)] bg-[rgb(var(--background))] rounded-xl border border-[rgb(var(--border))] overflow-hidden relative">
        {/* ===== Back Button inside chat ===== */}
        <div className="absolute top-4 left-4 z-10">
          <button
            onClick={handleBack}
            className="p-2 bg-[rgb(var(--card))] rounded-full shadow-lg hover:bg-[rgb(var(--muted))] transition-all duration-200 hover:scale-95 border border-[rgb(var(--border))]"
            aria-label="Go back"
          >
            <ArrowLeft className="w-5 h-5 text-[rgb(var(--foreground))]" />
          </button>
        </div>

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
