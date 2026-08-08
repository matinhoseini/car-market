"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useConversations } from "../../../../hooks/useConversations";
import ChatWindow from "../../../../components/chat/ChatWindow";
import DashboardLayout from "../../../../components/dashboard/DashboardLayout";

const ChatPage = () => {
  const router = useRouter();
  const params = useParams();
  const [conversationId, setConversationId] = useState(null);

  // ============================================
  // Get conversation ID from params
  // ============================================
  useEffect(() => {
    if (params?.id) {
      const id = parseInt(params.id);
      console.log("📌 Conversation ID from params:", id);
      setConversationId(id);
    }
  }, [params]);

  // ============================================
  // Replace chat page in history
  // ============================================
  useEffect(() => {
    if (conversationId) {
      window.history.replaceState(
        { ...window.history.state, url: "/dashboard/messages" },
        "",
        "/dashboard/messages",
      );
    }
  }, [conversationId]);

  // ============================================
  // Handle back button
  // ============================================
  const handleBack = () => {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push("/dashboard");
    }
  };

  // ============================================
  // Get conversation details
  // ============================================
  const { data: conversations, isLoading } = useConversations();

  // ✅ پیدا کردن مکالمه با ID
  const conversation = conversations?.find((c) => {
    console.log(`🔍 Checking conversation: ${c.id} === ${conversationId}`);
    return c.id === conversationId;
  });

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

  if (!conversation || !conversationId) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center h-[calc(100vh-200px)]">
          <div className="text-center max-w-md">
            <p className="text-6xl mb-4">🔍</p>
            <h2 className="text-2xl font-bold mb-2">Conversation Not Found</h2>
            <p className="text-[rgb(var(--muted-foreground))] mb-2">
              Conversation ID: {conversationId || "Unknown"}
            </p>
            <p className="text-[rgb(var(--muted-foreground))] mb-6">
              The conversation you're looking for doesn't exist or you don't
              have access to it.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/dashboard/messages"
                className="btn-primary inline-flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Messages
              </Link>
              <Link
                href="/vehicles"
                className="btn-outline inline-flex items-center gap-2"
              >
                Browse Vehicles
              </Link>
            </div>
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

  console.log("✅ Rendering chat for conversation:", conversationId);

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
