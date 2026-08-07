"use client";

import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { useMessages, useMarkAsRead } from "../../hooks/useMessages";
import { useChatWebSocket } from "../../hooks/useWebSocket";
import MessageBubble from "./MessageBubble";
import MessageInput from "./MessageInput";
import ChatHeader from "./ChatHeader";
import DateHeader from "./DateHeader";
import toast from "react-hot-toast";

const ChatWindow = ({ conversationId, otherUser, carInfo }) => {
  const [messages, setMessages] = useState([]);
  const [isAtBottom, setIsAtBottom] = useState(true);
  const messagesEndRef = useRef(null);
  const containerRef = useRef(null);

  // ✅ برای جلوگیری از ارسال دوبار
  const isSendingRef = useRef(false);
  // ✅ برای جلوگیری از اضافه شدن دوبار پیام
  const messageIdsRef = useRef(new Set());

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
        console.log("📩 New message received:", newMessage);

        setMessages((prev) => {
          // ✅ اگر پیام قبلاً وجود دارد، نادیده بگیر
          if (messageIdsRef.current.has(newMessage.id)) {
            console.log("⚠️ Duplicate message blocked:", newMessage.id);
            return prev;
          }

          // ✅ اگر پیام با همین متن و زمان نزدیک وجود دارد، نادیده بگیر
          const exists = prev.some(
            (msg) =>
              msg.text === newMessage.text &&
              Math.abs(
                new Date(msg.created_at) - new Date(newMessage.created_at),
              ) < 3000,
          );
          if (exists) {
            console.log("⚠️ Duplicate by content blocked:", newMessage.text);
            return prev;
          }

          messageIdsRef.current.add(newMessage.id);
          const newMessages = [...prev, newMessage];
          return newMessages.sort(
            (a, b) => new Date(a.created_at) - new Date(b.created_at),
          );
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

      newMessages.forEach((m) => messageIdsRef.current.add(m.id));
      return [...prev, ...newMessages].sort(
        (a, b) => new Date(a.created_at) - new Date(b.created_at),
      );
    });
  }, [data]);

  // ============================================
  // ✅ Group messages by sender (like Telegram) - FIXED
  // ============================================
  const groupedBySender = useCallback((dateMessages) => {
    if (!dateMessages || dateMessages.length === 0) return [];

    const groups = [];
    let currentGroup = null;

    dateMessages.forEach((message) => {
      const senderKey = message.sender;

      // ✅ گروه جدید اگر فرستنده عوض شده باشد
      if (!currentGroup || currentGroup.sender !== senderKey) {
        currentGroup = {
          sender: senderKey,
          sender_username: message.sender_username,
          messages: [message],
        };
        groups.push(currentGroup);
      } else {
        // ✅ اضافه کردن به گروه فعلی
        currentGroup.messages.push(message);
      }
    });

    return groups;
  }, []);

  // ============================================
  // Group messages by date
  // ============================================
  const getDateKey = useCallback((dateString) => {
    const date = new Date(dateString);
    return new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
    ).toISOString();
  }, []);

  const groupedByDate = useMemo(() => {
    if (!messages || messages.length === 0) return [];

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

      if (target.scrollTop === 0 && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    },
    [hasNextPage, isFetchingNextPage, fetchNextPage],
  );

  // ============================================
  // Mark as read
  // ============================================
  useEffect(() => {
    if (conversationId && messages.length > 0) {
      markAsReadMutation.mutate();
    }
  }, [conversationId, messages.length]);

  // ============================================
  // Scroll to bottom on load
  // ============================================
  useEffect(() => {
    if (!isLoading && messages.length > 0) {
      setTimeout(scrollToBottom, 300);
    }
  }, [isLoading, messages.length, scrollToBottom]);

  // ============================================
  // ✅ Handle send message - WITHOUT optimistic (wait for WebSocket)
  // ============================================
  const handleSend = useCallback(
    (text) => {
      console.log("📤 handleSend called with text:", text);

      if (!text?.trim()) {
        console.log("Empty text, ignoring");
        return;
      }

      if (!isConnected) {
        console.log("Not connected, ignoring");
        toast.error("You are offline. Please wait.");
        return;
      }

      // ✅ جلوگیری از ارسال همزمان
      if (isSendingRef.current) {
        console.log("⚠️ Already sending, ignoring");
        return;
      }

      isSendingRef.current = true;
      console.log("📤 Sending message:", text.trim());

      try {
        const success = sendMessage(text.trim());
        console.log("📤 sendMessage result:", success);

        if (success) {
          // ✅ فقط ارسال کن، منتظر WebSocket باش تا پیام برگردد
          // NO optimistic message here!
          toast.success("Message sent");

          // ✅ بعد از ۲ ثانیه قفل را آزاد کن
          setTimeout(() => {
            isSendingRef.current = false;
            console.log("🔓 Send lock released");
          }, 2000);
        } else {
          isSendingRef.current = false;
          toast.error("Failed to send message");
        }
      } catch (error) {
        console.error("❌ Error sending:", error);
        toast.error("Failed to send message");
        isSendingRef.current = false;
      }
    },
    [sendMessage, isConnected],
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

        {groupedByDate.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-[rgb(var(--muted-foreground))]">
            <p className="text-4xl mb-2">💬</p>
            <p className="text-sm sm:text-base">No messages yet</p>
            <p className="text-xs sm:text-sm">Start the conversation!</p>
          </div>
        ) : (
          groupedByDate.map(([dateKey, dateMessages]) => (
            <div key={dateKey}>
              <DateHeader date={dateKey} />

              {/* ✅ گروه‌بندی بر اساس فرستنده */}
              {groupedBySender(dateMessages).map((group, groupIndex) => (
                <div key={groupIndex}>
                  {group.messages.map((message, msgIndex) => {
                    const isFirstInGroup = msgIndex === 0;
                    return (
                      <MessageBubble
                        key={message.id}
                        message={message}
                        showAvatar={isFirstInGroup}
                        showName={isFirstInGroup}
                        isFirstInGroup={isFirstInGroup}
                      />
                    );
                  })}
                </div>
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
