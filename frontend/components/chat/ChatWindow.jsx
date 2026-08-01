"use client";

import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { useMessages, useMarkAsRead } from "../../hooks/useMessages";
import { useChatWebSocket } from "../../hooks/useWebSocket";
import MessageBubble from "./MessageBubble";
import MessageInput from "./MessageInput";
import ChatHeader from "./ChatHeader";
import DateHeader from "./DateHeader";

const ChatWindow = ({ conversationId, otherUser, carInfo }) => {
  const [messages, setMessages] = useState([]);
  const [isAtBottom, setIsAtBottom] = useState(true);
  const messagesEndRef = useRef(null);
  const containerRef = useRef(null);

  const isProcessingRef = useRef(false);
  const processedMessagesRef = useRef(new Set());
  const sentMessageIdsRef = useRef(new Set());

  // ============================================
  // Load messages with infinite scroll
  // ============================================
  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useMessages(conversationId);

  // ============================================
  // WebSocket for real-time messages
  // ============================================
  const { isConnected, sendMessage, sendTyping } = useChatWebSocket({
    conversationId,
    onMessageReceived: useCallback((newMessage) => {
      console.log("New message received:", newMessage);

      const msgKey = `${newMessage.text}_${newMessage.created_at}`;
      if (processedMessagesRef.current.has(msgKey)) {
        console.log("Duplicate message blocked in receive");
        return;
      }
      processedMessagesRef.current.add(msgKey);

      setMessages((prev) => {
        if (prev.some((msg) => msg.id === newMessage.id)) {
          return prev;
        }
        // ✅ Add new message to the END (bottom)
        return [...prev, newMessage];
      });

      setTimeout(scrollToBottom, 100);
    }, []),
  });

  // ============================================
  // Mark messages as read
  // ============================================
  const markAsReadMutation = useMarkAsRead(conversationId);

  // ============================================
  // Flatten messages from paginated data - FIXED
  // ============================================
  useEffect(() => {
    if (!data?.pages) return;

    // Get all messages from all pages
    const allMessages = data.pages.flatMap((page) => page.results || []);

    setMessages((prev) => {
      const existingIds = new Set(prev.map((m) => m.id));

      // ✅ Filter out messages that already exist
      const newMessages = allMessages.filter((m) => !existingIds.has(m.id));

      if (newMessages.length === 0) return prev;

      console.log(`Adding ${newMessages.length} new messages from pagination`);

      // ✅ Combine: existing messages + new messages (oldest first)
      // All messages should be sorted by created_at (oldest to newest)
      const combined = [...prev, ...newMessages];

      // ✅ Sort by created_at to ensure correct order
      return combined.sort((a, b) => {
        return new Date(a.created_at) - new Date(b.created_at);
      });
    });
  }, [data]);

  // ============================================
  // Group messages by date (like WhatsApp)
  // ============================================
  const getDateKey = useCallback((dateString) => {
    const date = new Date(dateString);
    return new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
    ).toISOString();
  }, []);

  const groupedMessages = useMemo(() => {
    if (!messages || messages.length === 0) return [];

    const groups = {};

    messages.forEach((message) => {
      const dateKey = getDateKey(message.created_at);
      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].push(message);
    });

    // ✅ Sort groups by date (oldest first)
    return Object.entries(groups).sort((a, b) => {
      return new Date(a[0]) - new Date(b[0]);
    });
  }, [messages, getDateKey]);

  // ============================================
  // Scroll functions
  // ============================================
  const scrollToBottom = useCallback(() => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  }, []);

  const handleScroll = useCallback(
    (e) => {
      const target = e.currentTarget;
      const isBottom =
        target.scrollHeight - target.scrollTop <= target.clientHeight + 50;
      setIsAtBottom(isBottom);

      // Load more messages when scrolling to top
      if (target.scrollTop === 0 && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    },
    [hasNextPage, isFetchingNextPage, fetchNextPage],
  );

  // ============================================
  // Mark messages as read on mount
  // ============================================
  useEffect(() => {
    if (conversationId && messages.length > 0) {
      markAsReadMutation.mutate();
    }
  }, [conversationId, messages.length]);

  // ============================================
  // Scroll to bottom on initial load - FIXED
  // ============================================
  useEffect(() => {
    if (!isLoading && messages.length > 0) {
      // Wait for DOM to render then scroll to bottom
      setTimeout(scrollToBottom, 300);
    }
  }, [isLoading, messages.length, scrollToBottom]);

  // ============================================
  // Handle send message
  // ============================================
  const handleSend = useCallback(
    (text) => {
      console.log("handleSend called with text:", text);

      if (isProcessingRef.current) {
        console.log("Already processing, ignoring");
        return;
      }

      if (!text?.trim()) {
        console.log("Empty text, ignoring");
        return;
      }

      if (!isConnected) {
        console.log("Not connected, ignoring");
        return;
      }

      const sendId = `${text.trim()}_${Date.now()}`;
      if (sentMessageIdsRef.current.has(sendId)) {
        console.log("Duplicate send attempt blocked:", sendId);
        return;
      }
      sentMessageIdsRef.current.add(sendId);

      console.log("Processing send for:", text.trim());
      isProcessingRef.current = true;

      try {
        const success = sendMessage(text.trim());
        console.log("sendMessage result:", success);

        if (success) {
          const tempId = `temp_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;

          const tempMessage = {
            id: tempId,
            text: text.trim(),
            sender: "me",
            created_at: new Date().toISOString(),
            is_read: false,
          };

          console.log("Adding temp message:", tempMessage);

          setMessages((prev) => {
            // Check for duplicate in state
            const exists = prev.some(
              (msg) =>
                msg.text === tempMessage.text &&
                Math.abs(
                  new Date(msg.created_at) - new Date(tempMessage.created_at),
                ) < 2000,
            );
            if (exists) {
              console.log("Message already in state, skipping");
              return prev;
            }
            // ✅ Add to END (bottom)
            return [...prev, tempMessage];
          });

          setTimeout(scrollToBottom, 100);
        }
      } catch (error) {
        console.error("Error sending:", error);
      } finally {
        setTimeout(() => {
          isProcessingRef.current = false;
          sentMessageIdsRef.current.clear();
          console.log("Processing lock released");
        }, 1500);
      }
    },
    [sendMessage, scrollToBottom, isConnected],
  );

  // ============================================
  // Render
  // ============================================
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500 mx-auto"></div>
          <p className="mt-2 text-[rgb(var(--muted-foreground))] text-sm sm:text-base">
            Loading messages...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-[rgb(var(--background))]">
      <ChatHeader
        otherUser={otherUser}
        carInfo={carInfo}
        isOnline={isConnected}
      />

      <div
        ref={containerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-1"
      >
        {isFetchingNextPage && (
          <div className="text-center py-2">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-500 mx-auto"></div>
          </div>
        )}

        {groupedMessages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-[rgb(var(--muted-foreground))]">
            <p className="text-4xl mb-2">💬</p>
            <p className="text-sm sm:text-base">No messages yet</p>
            <p className="text-xs sm:text-sm">Start the conversation!</p>
          </div>
        ) : (
          groupedMessages.map(([dateKey, groupMessages]) => (
            <div key={dateKey}>
              <DateHeader date={dateKey} />
              {groupMessages.map((message) => (
                <MessageBubble key={message.id} message={message} />
              ))}
            </div>
          ))
        )}

        <div ref={messagesEndRef} />
      </div>

      <div className="border-t border-[rgb(var(--border))] p-2 sm:p-4 bg-[rgb(var(--card))]">
        <MessageInput
          onSend={handleSend}
          onTyping={sendTyping}
          disabled={!isConnected}
          placeholder={
            !isConnected ? "⏳ Connecting..." : "Type your message..."
          }
        />
        {!isConnected && (
          <p className="text-[10px] sm:text-xs text-yellow-600 mt-1 sm:mt-2 text-center">
            🔄 Attempting to reconnect...
          </p>
        )}
      </div>
    </div>
  );
};

export default ChatWindow;
