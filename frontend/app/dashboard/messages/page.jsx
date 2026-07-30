// app/dashboard/messages/page.jsx
"use client";

import { useConversations } from "../../../hooks/useConversations";
import ChatList from "../../../components/chat/ChatList";

export default function MessagesPage() {
  const { data: conversations, isLoading, error } = useConversations();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="spinner w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-[rgb(var(--muted-foreground))]">
            Loading conversations...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500">Failed to load conversations</p>
        <button
          onClick={() => window.location.reload()}
          className="btn-primary mt-4"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-80px)] bg-[rgb(var(--background))] py-8">
      <div className="container-custom max-w-4xl">
        {/* ===== Header ===== */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold font-heading">💬 Messages</h1>
            <p className="text-sm text-[rgb(var(--muted-foreground))] mt-1">
              Your conversations with sellers and buyers
            </p>
          </div>
          <span className="text-sm text-[rgb(var(--muted-foreground))]">
            {conversations?.length || 0} conversations
          </span>
        </div>

        {/* ===== Chat List ===== */}
        {conversations && conversations.length > 0 ? (
          <ChatList conversations={conversations} />
        ) : (
          <div className="text-center py-16 bg-[rgb(var(--card))] rounded-xl border border-[rgb(var(--border))]">
            <div className="text-6xl mb-4">💬</div>
            <h3 className="text-xl font-semibold mb-2">No messages yet</h3>
            <p className="text-[rgb(var(--muted-foreground))]">
              Start a conversation by contacting a seller
            </p>
            <a href="/vehicles" className="btn-primary inline-block mt-4">
              Browse Vehicles
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
