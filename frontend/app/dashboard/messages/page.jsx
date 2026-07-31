"use client";

import { useConversations } from "../../../hooks/useConversations";
import ChatList from "../../../components/chat/ChatList";
import DashboardLayout from "../../../components/dashboard/DashboardLayout";

const MessagesPage = () => {
  const { data: conversations, isLoading, error } = useConversations();

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
              Loading conversations...
            </p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="text-center py-10 text-red-500">
          ❌ Error loading conversations
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        {/* ===== Header ===== */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">📩 Messages</h1>
          <span className="text-sm text-[rgb(var(--muted-foreground))]">
            {conversations?.length || 0} conversations
          </span>
        </div>

        {/* ===== Chat List ===== */}
        {conversations?.length === 0 ? (
          <div className="text-center py-16 bg-[rgb(var(--card))] rounded-xl border border-[rgb(var(--border))]">
            <p className="text-4xl mb-4">💬</p>
            <p className="text-[rgb(var(--muted-foreground))]">
              No conversations yet
            </p>
            <Link
              href="/cars"
              className="text-primary-500 hover:underline mt-2 inline-block"
            >
              Browse cars and start chatting
            </Link>
          </div>
        ) : (
          <ChatList conversations={conversations} />
        )}
      </div>
    </DashboardLayout>
  );
};

export default MessagesPage;
