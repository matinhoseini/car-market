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

  const sentMessageIds = useRef(new Set());
  // ✅ لیستی از ID پیام‌های optimistic (به جای یک ref)
  const optimisticMessageIds = useRef(new Set());

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
          let updatedMessages = prev;

          // ✅ اگر پیام optimistic وجود داشت، حذف کن
          if (optimisticMessageIds.current.has(newMessage.id)) {
            console.log("🔄 Removing optimistic message:", newMessage.id);
            updatedMessages = prev.filter(
              (msg) => !optimisticMessageIds.current.has(msg.id),
            );
            optimisticMessageIds.current.delete(newMessage.id);
          }

          // ✅ بررسی پیام تکراری
          if (updatedMessages.some((msg) => msg.id === newMessage.id)) {
            console.log("⚠️ Duplicate message blocked:", newMessage.id);
            return updatedMessages;
          }

          const newMessages = [...updatedMessages, newMessage];
          return newMessages.sort((a, b) => {
            return new Date(a.created_at) - new Date(b.created_at);
          });
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

      const combined = [...prev, ...newMessages];
      return combined.sort((a, b) => {
        return new Date(a.created_at) - new Date(b.created_at);
      });
    });
  }, [data]);

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
  // Group messages by sender (like Telegram)
  // ============================================
  const groupedBySender = useCallback((dateMessages) => {
    const groups = [];
    let currentGroup = null;

    dateMessages.forEach((message) => {
      if (!currentGroup || currentGroup.sender !== message.sender) {
        currentGroup = {
          sender: message.sender,
          sender_username: message.sender_username,
          messages: [message],
        };
        groups.push(currentGroup);
      } else {
        currentGroup.messages.push(message);
      }
    });

    return groups;
  }, []);

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
  // Handle send message - با لیستی از IDهای optimistic
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

      const tempId = `temp_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;

      if (sentMessageIds.current.has(tempId)) {
        console.log("⚠️ Duplicate send attempt blocked:", tempId);
        return;
      }
      sentMessageIds.current.add(tempId);

      console.log("📤 Sending message:", text.trim());

      try {
        const success = sendMessage(text.trim());
        console.log("📤 sendMessage result:", success);

        if (success) {
          const tempMessage = {
            id: tempId,
            text: text.trim(),
            sender: "me",
            created_at: new Date().toISOString(),
            is_read: false,
          };

          // ✅ اضافه کردن به لیست optimistic
          optimisticMessageIds.current.add(tempId);

          console.log("📤 Adding optimistic message:", tempMessage);
          console.log("📤 Optimistic IDs:", [...optimisticMessageIds.current]);

          setMessages((prev) => {
            const exists = prev.some(
              (msg) =>
                msg.text === tempMessage.text &&
                Math.abs(
                  new Date(msg.created_at) - new Date(tempMessage.created_at),
                ) < 2000,
            );
            if (exists) {
              console.log("⚠️ Message already in state, skipping");
              return prev;
            }

            const newMessages = [...prev, tempMessage];
            return newMessages.sort((a, b) => {
              return new Date(a.created_at) - new Date(b.created_at);
            });
          });

          scrollToBottom();
        }
      } catch (error) {
        console.error("❌ Error sending:", error);
        toast.error("Failed to send message");
        optimisticMessageIds.current.delete(tempId);
      } finally {
        setTimeout(() => {
          sentMessageIds.current.delete(tempId);
          // ✅ بعد از ۵ ثانیه از لیست optimistic حذف کن (امنیت)
          setTimeout(() => {
            optimisticMessageIds.current.delete(tempId);
          }, 1000);
          console.log("🔓 Send lock released for:", tempId);
        }, 5000);
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
