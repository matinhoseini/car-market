import { useState, useEffect, useRef, useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { messageKeys } from "./useMessages";
import toast from "react-hot-toast";

export const useChatWebSocket = ({ conversationId, onMessageReceived }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const wsRef = useRef(null);
  const reconnectTimeoutRef = useRef(null);
  const reconnectAttempts = useRef(0);
  const queryClient = useQueryClient();

  const connect = useCallback(() => {
    // ✅ جلوگیری از اتصال مجدد اگر قبلاً متصل است
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      console.log("ℹ️ WebSocket already connected");
      return;
    }

    // ✅ جلوگیری از اتصال همزمان
    if (isConnecting) {
      console.log("ℹ️ WebSocket is already connecting");
      return;
    }

    setIsConnecting(true);

    const token = localStorage.getItem("access_token");

    if (!token) {
      console.error("❌ No access token found");
      setIsConnecting(false);
      return;
    }

    const wsUrl = `${process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:8000"}/ws/chat/${conversationId}/?token=${token}`;

    console.log("🔄 Connecting to WebSocket:", wsUrl);
    wsRef.current = new WebSocket(wsUrl);

    wsRef.current.onopen = () => {
      console.log("✅ WebSocket connected!");
      setIsConnected(true);
      setIsConnecting(false);
      reconnectAttempts.current = 0;
    };

    wsRef.current.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log("📩 Message received:", data);

        // ✅ Handle different message types
        if (data.type === "message" || data.type === "chat_message") {
          const newMessage = data.payload || data.message;

          // Update cache
          queryClient.setQueryData(
            messageKeys.list(conversationId),
            (oldData) => {
              if (!oldData) return oldData;
              const newPages = [...oldData.pages];
              if (newPages[0]) {
                newPages[0] = {
                  ...newPages[0],
                  results: [newMessage, ...newPages[0].results],
                };
              }
              return {
                ...oldData,
                pages: newPages,
              };
            },
          );

          if (onMessageReceived) {
            onMessageReceived(newMessage);
          }
        }

        // ✅ Handle connection confirmation
        if (data.type === "connection") {
          console.log("🔗 Connection confirmed:", data);
        }

        // ✅ Handle errors
        if (data.type === "error") {
          console.error("❌ Server error:", data.message);
          toast.error(data.message);
        }
      } catch (error) {
        console.error("❌ Error parsing WebSocket message:", error);
      }
    };

    wsRef.current.onclose = (event) => {
      console.log(`🔌 WebSocket closed (code: ${event.code})`);
      setIsConnected(false);
      setIsConnecting(false);

      // ✅ اگر کد 1000 نباشد، دوباره وصل شو
      if (reconnectAttempts.current < 10 && event.code !== 1000) {
        const delay = Math.min(
          1000 * Math.pow(1.5, reconnectAttempts.current),
          30000,
        );
        reconnectTimeoutRef.current = setTimeout(() => {
          reconnectAttempts.current++;
          console.log(
            `🔄 Reconnecting... Attempt ${reconnectAttempts.current}`,
          );
          connect();
        }, delay);
      } else if (event.code === 1000) {
        console.log("✅ Normal closure, no reconnect needed");
      }
    };

    wsRef.current.onerror = (error) => {
      console.error("❌ WebSocket error:", error);
      setIsConnecting(false);
    };
  }, [conversationId, onMessageReceived, queryClient, isConnecting]);

  // ============================================
  // 📤 Send message
  // ============================================
  const sendMessage = useCallback((text) => {
    if (!text?.trim()) {
      toast.error("Please write a message");
      return false;
    }

    if (wsRef.current?.readyState !== WebSocket.OPEN) {
      toast.error("You are offline. Please wait for reconnection.");
      return false;
    }

    try {
      const messageData = {
        type: "message",
        message: text.trim(), // ✅ ارسال به فرمت مورد انتظار Backend
      };
      wsRef.current.send(JSON.stringify(messageData));
      console.log("📤 Message sent:", text);
      return true;
    } catch (error) {
      console.error("❌ Error sending message:", error);
      toast.error("Failed to send message");
      return false;
    }
  }, []);

  // ============================================
  // ⌨️ Send typing indicator
  // ============================================
  const sendTyping = useCallback((isTyping) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(
        JSON.stringify({
          type: "typing",
          is_typing: isTyping,
        }),
      );
    }
  }, []);

  // ============================================
  // 🔌 Disconnect
  // ============================================
  const disconnect = useCallback(() => {
    if (wsRef.current) {
      // ✅ بستن با کد 1000 (بستن عادی)
      if (wsRef.current.readyState === WebSocket.OPEN) {
        wsRef.current.close(1000, "User disconnected");
      }
      wsRef.current = null;
    }
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }
    setIsConnected(false);
    setIsConnecting(false);
  }, []);

  // ============================================
  // 🔄 Lifecycle
  // ============================================
  useEffect(() => {
    if (conversationId) {
      connect();
    }

    return () => {
      disconnect();
    };
  }, [conversationId, connect, disconnect]);

  return {
    isConnected,
    isConnecting,
    sendMessage,
    sendTyping,
    disconnect,
    reconnect: connect,
  };
};
