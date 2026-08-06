// app/messages/page.jsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, MessageCircle, Users, Car } from "lucide-react";
import { useConversations } from "../../../hooks/useConversations";
import ChatList from "../../../components/chat/ChatList";

// ============================================
// 📱 Messages Page (Standalone - Full Screen)
// ============================================
const MessagesPage = () => {
  const router = useRouter();
  const { data: conversations, isLoading, error } = useConversations();
  const [canGoBack, setCanGoBack] = useState(false);

  // ============================================
  // Check if there is a previous page in history
  // ============================================
  useEffect(() => {
    if (window.history.length > 1) {
      setCanGoBack(true);
    }
  }, []);

  // ============================================
  // Handle back button - go to previous page or home
  // ============================================
  const handleBack = () => {
    if (canGoBack) {
      router.back();
    } else {
      router.push("/");
    }
  };

  // ============================================
  // Loading state
  // ============================================
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[rgb(var(--background))] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto relative">
            <div className="absolute inset-0 rounded-full border-4 border-primary-500/20"></div>
            <div className="absolute inset-0 rounded-full border-4 border-t-primary-500 animate-spin"></div>
          </div>
          <p className="mt-4 text-[rgb(var(--muted-foreground))]">
            Loading conversations...
          </p>
        </div>
      </div>
    );
  }

  // ============================================
  // Error state
  // ============================================
  if (error) {
    return (
      <div className="min-h-screen bg-[rgb(var(--background))] flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8 bg-[rgb(var(--card))] rounded-2xl border border-[rgb(var(--border))]">
          <div className="text-5xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-red-500 mb-2">
            Error Loading Conversations
          </h2>
          <p className="text-[rgb(var(--muted-foreground))] text-sm mb-4">
            {error.message || "Something went wrong. Please try again."}
          </p>
          <button
            onClick={() => router.refresh()}
            className="px-6 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // ============================================
  // Main render
  // ============================================
  return (
    <div className="min-h-screen bg-[rgb(var(--background))]">
      {/* ===== Fixed Header ===== */}
      <header className="sticky top-0 z-10 bg-[rgb(var(--card))] border-b border-[rgb(var(--border))] shadow-sm">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex items-center gap-3 h-16">
            {/* Back Button */}
            <button
              onClick={handleBack}
              className="p-2 rounded-full hover:bg-[rgb(var(--muted))] transition-all duration-200 hover:scale-95"
              aria-label="Go back"
            >
              <ArrowLeft className="w-5 h-5 text-[rgb(var(--foreground))]" />
            </button>

            {/* Title */}
            <div className="flex-1">
              <h1 className="text-lg font-semibold text-[rgb(var(--foreground))]">
                Messages
              </h1>
              <p className="text-xs text-[rgb(var(--muted-foreground))]">
                {conversations?.length || 0} conversations
              </p>
            </div>

            {/* Quick Stats */}
            <div className="flex items-center gap-3 text-xs text-[rgb(var(--muted-foreground))]">
              <span className="hidden sm:flex items-center gap-1">
                <MessageCircle className="w-4 h-4" />
                {conversations?.length || 0}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* ===== Main Content ===== */}
      <main className="max-w-4xl mx-auto px-4 py-6">
        {conversations?.length === 0 ? (
          // ===== Empty State =====
          <div className="flex flex-col items-center justify-center py-20 bg-[rgb(var(--card))] rounded-2xl border border-[rgb(var(--border))] shadow-sm">
            <div className="w-24 h-24 rounded-full bg-primary-500/10 flex items-center justify-center mb-4">
              <MessageCircle className="w-12 h-12 text-primary-500" />
            </div>
            <h3 className="text-xl font-semibold text-[rgb(var(--foreground))] mb-2">
              No Messages Yet
            </h3>
            <p className="text-[rgb(var(--muted-foreground))] text-center max-w-sm mb-6">
              Start a conversation by browsing cars and contacting sellers.
            </p>
            <Link
              href="/vehicles"
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors shadow-lg shadow-primary-500/30"
            >
              <Car className="w-4 h-4" />
              Browse Cars
            </Link>
          </div>
        ) : (
          // ===== Chat List =====
          <div className="bg-[rgb(var(--card))] rounded-2xl border border-[rgb(var(--border))] shadow-sm overflow-hidden">
            <ChatList conversations={conversations} />
          </div>
        )}
      </main>

      {/* ===== Footer ===== */}
      <footer className="mt-auto border-t border-[rgb(var(--border))] py-4">
        <div className="max-w-4xl mx-auto px-4">
          <p className="text-xs text-center text-[rgb(var(--muted-foreground))]">
            {conversations?.length > 0
              ? `You have ${conversations.length} active conversation${conversations.length > 1 ? "s" : ""}`
              : "Start a new conversation today!"}
          </p>
        </div>
      </footer>
    </div>
  );
};

export default MessagesPage;
