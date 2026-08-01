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

  // Strongest duplicate prevention
  const isSendingRef = useRef(false);
  const lastSentMessageRef = useRef("");
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
    onMessageReceived: useCallback(
      (newMessage) => {
        console.log("New message received:", newMessage);
        setMessages((prev) => {
          // Check for duplicate by ID or content + time
          if (
            prev.some(
              (msg) =>
                msg.id === newMessage.id ||
                (msg.text === newMessage.text &&
                  msg.created_at === newMessage.created_at),
            )
          ) {
            console.log("Duplicate message blocked");
            return prev;
          }
          return [newMessage, ...prev];
        });
        if (isAtBottom) {
          scrollToBottom();
        }
      },
      [isAtBottom],
    ),
  });

  // ============================================
  // Mark messages as read
  // ============================================
  const markAsReadMutation = useMarkAsRead(conversationId);

  // ============================================
  // Flatten messages from paginated data
  // ============================================
  useEffect(() => {
    if (!data?.pages) return;

    const allMessages = data.pages.flatMap((page) => page.results || []);

    setMessages((prev) => {
      const existingIds = new Set(prev.map((m) => m.id));
      const newMessages = allMessages.filter((m) => !existingIds.has(m.id));
      if (newMessages.length === 0) return prev;
      console.log(`Adding ${newMessages.length} new messages from pagination`);
      return [...newMessages, ...prev];
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
  // Scroll to bottom on initial load
  // ============================================
  useEffect(() => {
    if (!isLoading && messages.length > 0) {
      setTimeout(scrollToBottom, 300);
    }
  }, [isLoading, messages.length, scrollToBottom]);

  // ============================================
  // Handle send message with 4-layer protection
  // ============================================
  const handleSend = useCallback(
    (text) => {
      console.log("handleSend called with text:", text);

      // Layer 1: Check for empty text
      if (!text?.trim()) {
        console.log("Empty text, ignoring");
        return;
      }

      // Layer 2: Check for concurrent send
      if (isSendingRef.current) {
        console.log("Already sending, ignoring");
        return;
      }

      // Layer 3: Check for duplicate text
      if (text.trim() === lastSentMessageRef.current) {
        console.log("Duplicate text blocked:", text.trim());
        return;
      }

      // Layer 4: Check WebSocket connection
      if (!isConnected) {
        console.log("Not connected, ignoring");
        return;
      }

      console.log("Sending message:", text.trim());

      // Lock the send process
      isSendingRef.current = true;
      lastSentMessageRef.current = text.trim();

      try {
        const success = sendMessage(text.trim());
        console.log("sendMessage result:", success);

        if (success) {
          // Generate unique temp ID
          const tempId = `temp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

          // Check for duplicate temp ID
          if (sentMessageIdsRef.current.has(tempId)) {
            console.log("Duplicate temp ID blocked");
            return;
          }

          const tempMessage = {
            id: tempId,
            text: text.trim(),
            sender: "me",
            created_at: new Date().toISOString(),
            is_read: false,
          };

          console.log("Adding temp message:", tempMessage);
          sentMessageIdsRef.current.add(tempId);

          setMessages((prev) => {
            // Check if message already exists in state
            const exists = prev.some(
              (msg) =>
                msg.text === tempMessage.text &&
                msg.sender === tempMessage.sender &&
                Math.abs(
                  new Date(msg.created_at) - new Date(tempMessage.created_at),
                ) < 1000,
            );
            if (exists) {
              console.log("Message already in state, skipping");
              return prev;
            }
            return [tempMessage, ...prev];
          });

          scrollToBottom();

          // Release lock after 1.5 seconds
          setTimeout(() => {
            sentMessageIdsRef.current.delete(tempId);
            isSendingRef.current = false;
            console.log("Sending lock released");
          }, 1500);
        } else {
          // Release lock if send failed
          isSendingRef.current = false;
          lastSentMessageRef.current = "";
        }
      } catch (error) {
        console.error("Error sending:", error);
        isSendingRef.current = false;
        lastSentMessageRef.current = "";
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

  const groupedMessagesList = groupedMessages;

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

        {groupedMessagesList.length === 0 ? (
          <div className="text-center py-16 text-[rgb(var(--muted-foreground))]">
            <p className="text-4xl mb-2">💬</p>
            <p className="text-sm sm:text-base">No messages yet</p>
            <p className="text-xs sm:text-sm">Start the conversation!</p>
          </div>
        ) : (
          groupedMessagesList.map(([dateKey, groupMessages]) => (
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
