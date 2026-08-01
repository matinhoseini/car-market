"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useMessages, useMarkAsRead } from "../../hooks/useMessages";
import { useChatWebSocket } from "../../hooks/useChatWebSocket";
import MessageBubble from "./MessageBubble";
import MessageInput from "./MessageInput";
import ChatHeader from "./ChatHeader";
import DateHeader from "./DateHeader";

const ChatWindow = ({ conversationId, otherUser, carInfo }) => {
  const [messages, setMessages] = useState([]);
  const [isAtBottom, setIsAtBottom] = useState(true);
  const messagesEndRef = useRef(null);
  const containerRef = useRef(null);

  // ============================================
  // 📋 Load messages with infinite scroll
  // ============================================
  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useMessages(conversationId);

  // ============================================
  // 🔗 WebSocket for real-time messages
  // ============================================
  const { isConnected, sendMessage, sendTyping } = useChatWebSocket({
    conversationId,
    onMessageReceived: (newMessage) => {
      setMessages((prev) => [newMessage, ...prev]);
      if (isAtBottom) {
        scrollToBottom();
      }
    },
  });

  // ============================================
  // ✅ Mark messages as read
  // ============================================
  const markAsReadMutation = useMarkAsRead(conversationId);

  // ============================================
  // 📦 Flatten messages from paginated data
  // ============================================
  useEffect(() => {
    if (data?.pages) {
      const allMessages = data.pages.flatMap((page) => page.results || []);
      setMessages(allMessages);
    }
  }, [data]);

  // ============================================
  // 📅 Group messages by date (like WhatsApp)
  // ============================================
  const getDateKey = (dateString) => {
    const date = new Date(dateString);
    return new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
    ).toISOString();
  };

  const groupedMessages = useCallback(() => {
    const groups = {};

    messages.forEach((message) => {
      const dateKey = getDateKey(message.created_at);
      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].push(message);
    });

    return Object.entries(groups).sort((a, b) => {
      return new Date(a[0]) - new Date(b[0]);
    });
  }, [messages]);

  // ============================================
  // 📜 Scroll to bottom
  // ============================================
  const scrollToBottom = useCallback(() => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  }, []);

  // ============================================
  // 📜 Handle scroll events
  // ============================================
  const handleScroll = useCallback(
    (e) => {
      const target = e.currentTarget;
      const isBottom =
        target.scrollHeight - target.scrollTop <= target.clientHeight + 50;
      setIsAtBottom(isBottom);

      if (target.scrollTop === 0 && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    },
    [hasNextPage, isFetchingNextPage, fetchNextPage],
  );

  // ============================================
  // ✅ Mark as read when component mounts
  // ============================================
  useEffect(() => {
    if (conversationId && messages.length > 0) {
      markAsReadMutation.mutate();
    }
  }, [conversationId, messages.length]);

  // ============================================
  // 📜 Scroll to bottom on initial load
  // ============================================
  useEffect(() => {
    if (!isLoading && messages.length > 0) {
      scrollToBottom();
    }
  }, [isLoading, messages.length, scrollToBottom]);

  // ============================================
  // ⌨️ Handle typing indicator
  // ============================================
  const handleTyping = useCallback(
    (isTyping) => {
      sendTyping(isTyping);
    },
    [sendTyping],
  );

  // ============================================
  // 📤 Handle send message
  // ============================================
  const handleSend = useCallback(
    (text) => {
      const success = sendMessage(text);
      if (success) {
        const tempMessage = {
          id: Date.now(),
          text: text,
          sender: "me",
          created_at: new Date().toISOString(),
          is_read: false,
        };
        setMessages((prev) => [tempMessage, ...prev]);
        scrollToBottom();
      }
    },
    [sendMessage, scrollToBottom],
  );

  // ============================================
  // 🎨 Render
  // ============================================
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500 mx-auto"></div>
          <p className="mt-2 text-[rgb(var(--muted-foreground))] text-sm">
            Loading messages...
          </p>
        </div>
      </div>
    );
  }

  const groupedMessagesList = groupedMessages();

  return (
    <div className="flex flex-col h-full bg-[rgb(var(--background))]">
      {/* ===== Header ===== */}
      <ChatHeader
        otherUser={otherUser}
        carInfo={carInfo}
        isOnline={isConnected}
      />

      {/* ===== Messages Container ===== */}
      <div
        ref={containerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto p-4 space-y-2"
      >
        {/* Load more indicator */}
        {isFetchingNextPage && (
          <div className="text-center py-2">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-500 mx-auto"></div>
          </div>
        )}

        {/* ===== Grouped Messages ===== */}
        {groupedMessagesList.length === 0 ? (
          <div className="text-center py-16 text-[rgb(var(--muted-foreground))]">
            <p className="text-4xl mb-2">💬</p>
            <p>No messages yet</p>
            <p className="text-sm">Start the conversation!</p>
          </div>
        ) : (
          groupedMessagesList.map(([dateKey, groupMessages]) => (
            <div key={dateKey}>
              {/* ===== Date Header ===== */}
              <DateHeader date={dateKey} />

              {/* ===== Messages for this date ===== */}
              {groupMessages.map((message, index) => {
                // Show time only for first message or if previous message has different time
                const prevMessage = index > 0 ? groupMessages[index - 1] : null;
                const showTime =
                  !prevMessage ||
                  new Date(message.created_at).getHours() !==
                    new Date(prevMessage.created_at).getHours() ||
                  new Date(message.created_at).getMinutes() !==
                    new Date(prevMessage.created_at).getMinutes();

                return (
                  <MessageBubble
                    key={message.id}
                    message={message}
                    showTime={showTime}
                  />
                );
              })}
            </div>
          ))
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* ===== Input ===== */}
      <div className="border-t border-[rgb(var(--border))] p-4 bg-[rgb(var(--card))]">
        <MessageInput
          onSend={handleSend}
          onTyping={handleTyping}
          disabled={!isConnected}
          placeholder={
            !isConnected ? "⏳ Connecting..." : "Type your message..."
          }
        />
        {!isConnected && (
          <p className="text-xs text-yellow-600 mt-2 text-center">
            🔄 Attempting to reconnect...
          </p>
        )}
      </div>
    </div>
  );
};

export default ChatWindow;
