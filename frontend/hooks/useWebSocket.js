import { useState, useEffect, useRef, useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { messageKeys } from "./useMessages";

export const useChatWebSocket = ({ conversationId, onMessageReceived }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const wsRef = useRef(null);
  const reconnectTimeoutRef = useRef(null);
  const reconnectAttempts = useRef(0);
  const queryClient = useQueryClient();

  // ============================================
  // 🔗 Connect to WebSocket
  // ============================================
  const connect = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) return;
    if (isConnecting) return;

    setIsConnecting(true);

    const token = localStorage.getItem("access_token");
    const wsUrl = `${process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:8000"}/ws/chat/${conversationId}/?token=${token}`;

    wsRef.current = new WebSocket(wsUrl);

    wsRef.current.onopen = () => {
      setIsConnected(true);
      setIsConnecting(false);
      reconnectAttempts.current = 0;
      console.log("🔗 Connected to chat WebSocket");
    };

    wsRef.current.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);

        // ===== Handle different message types =====
        if (data.type === "message") {
          const newMessage = data.payload;

          // Update messages cache
          queryClient.setQueryData(
            messageKeys.list(conversationId),
            (oldData) => {
              if (!oldData) return oldData;
              // Add new message to first page
              const newPages = [...oldData.pages];
              newPages[0] = {
                ...newPages[0],
                results: [newMessage, ...newPages[0].results],
              };
              return {
                ...oldData,
                pages: newPages,
              };
            },
          );

          // Call callback
          if (onMessageReceived) {
            onMessageReceived(newMessage);
          }
        }

        // ===== Handle typing indicator =====
        if (data.type === "typing") {
          // You can implement typing indicator here
          console.log("👤 User is typing...");
        }

        // ===== Handle read receipt =====
        if (data.type === "read_receipt") {
          // Update messages as read
          queryClient.invalidateQueries({
            queryKey: messageKeys.list(conversationId),
          });
        }
      } catch (error) {
        console.error("Error parsing WebSocket message:", error);
      }
    };

    wsRef.current.onclose = (event) => {
      setIsConnected(false);
      setIsConnecting(false);
      console.log(`🔌 Disconnected from chat (code: ${event.code})`);

      // ===== Reconnect with exponential backoff =====
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
      }
    };

    wsRef.current.onerror = (error) => {
      console.error("WebSocket error:", error);
      setIsConnecting(false);
    };
  }, [conversationId, onMessageReceived, queryClient, isConnecting]);

  // ============================================
  // 📤 Send message
  // ============================================
  const sendMessage = useCallback((text) => {
    if (!text?.trim()) return false;

    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(
        JSON.stringify({
          type: "message",
          payload: {
            text: text.trim(),
          },
        }),
      );
      return true;
    }

    console.warn("⚠️ WebSocket is not connected");
    return false;
  }, []);

  // ============================================
  // ⌨️ Send typing indicator
  // ============================================
  const sendTyping = useCallback((isTyping) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(
        JSON.stringify({
          type: "typing",
          payload: { is_typing: isTyping },
        }),
      );
    }
  }, []);

  // ============================================
  // 🔌 Disconnect
  // ============================================
  const disconnect = useCallback(() => {
    if (wsRef.current) {
      wsRef.current.close(1000, "User disconnected");
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
