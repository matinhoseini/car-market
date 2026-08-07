"use client";

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
  const maxReconnectAttempts = 5;
  const hasShownErrorRef = useRef(false);
  const processedMessageIds = useRef(new Set()); // ✅ Track processed message IDs
  const queryClient = useQueryClient();

  const connect = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      console.log("WebSocket already connected");
      return;
    }

    if (isConnecting) {
      console.log("WebSocket is already connecting");
      return;
    }

    if (reconnectAttempts.current >= maxReconnectAttempts) {
      console.error("Max reconnection attempts reached");
      if (!hasShownErrorRef.current) {
        toast.error("Connection failed. Please refresh the page.");
        hasShownErrorRef.current = true;
      }
      return;
    }

    setIsConnecting(true);

    const token = localStorage.getItem("access_token");

    if (!token) {
      console.error("No access token found");
      setIsConnecting(false);
      if (!hasShownErrorRef.current) {
        toast.error("Please login again");
        hasShownErrorRef.current = true;
      }
      return;
    }

    const wsUrl = `${process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:8000"}/ws/chat/${conversationId}/?token=${token}`;

    console.log(
      `Connecting (${reconnectAttempts.current + 1}/${maxReconnectAttempts})`,
    );
    wsRef.current = new WebSocket(wsUrl);

    wsRef.current.onopen = () => {
      console.log("WebSocket connected!");
      setIsConnected(true);
      setIsConnecting(false);
      reconnectAttempts.current = 0;
      hasShownErrorRef.current = false;
      processedMessageIds.current.clear(); // ✅ Clear on reconnect
    };

    wsRef.current.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log("Message received:", data);

        if (data.type === "message" || data.type === "chat_message") {
          const newMessage = data.payload || data.message;

          // ✅ Check if message already processed
          if (processedMessageIds.current.has(newMessage.id)) {
            console.log("⚠️ Duplicate message blocked:", newMessage.id);
            return;
          }

          // ✅ Mark as processed
          processedMessageIds.current.add(newMessage.id);

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

        if (data.type === "connection") {
          console.log("Connection confirmed:", data);
          processedMessageIds.current.clear(); // ✅ Clear on reconnection
        }

        if (data.type === "error") {
          console.error("Server error:", data.message);
          if (!hasShownErrorRef.current) {
            toast.error(data.message);
            hasShownErrorRef.current = true;
          }
        }
      } catch (error) {
        console.error("Error parsing WebSocket message:", error);
      }
    };

    wsRef.current.onclose = (event) => {
      console.log(`WebSocket closed (code: ${event.code})`);
      setIsConnected(false);
      setIsConnecting(false);

      if (event.code === 1000) {
        console.log("Normal closure");
        hasShownErrorRef.current = false;
        processedMessageIds.current.clear();
        return;
      }

      if (reconnectAttempts.current < maxReconnectAttempts) {
        const delay = Math.min(
          1000 * Math.pow(1.5, reconnectAttempts.current),
          5000,
        );
        reconnectAttempts.current++;
        reconnectTimeoutRef.current = setTimeout(() => {
          console.log(`Reconnecting... Attempt ${reconnectAttempts.current}`);
          connect();
        }, delay);
      } else {
        console.error("Max reconnection attempts reached");
        if (!hasShownErrorRef.current) {
          toast.error("Unable to connect. Please refresh the page.");
          hasShownErrorRef.current = true;
        }
      }
    };

    wsRef.current.onerror = (error) => {
      console.error("WebSocket error:", error);
      setIsConnecting(false);
      if (!hasShownErrorRef.current) {
        toast.error("Connection error. Please refresh the page.");
        hasShownErrorRef.current = true;
      }
    };
  }, [conversationId, onMessageReceived, queryClient, isConnecting]);

  // ============================================
  // Send message
  // ============================================
  const sendMessage = useCallback((text) => {
    console.log("sendMessage called with:", text);

    if (!text?.trim()) {
      toast.error("Please write a message");
      return false;
    }

    if (wsRef.current?.readyState !== WebSocket.OPEN) {
      if (!hasShownErrorRef.current) {
        toast.error("You are offline. Please wait for reconnection.");
        hasShownErrorRef.current = true;
      }
      return false;
    }

    try {
      const messageData = {
        type: "message",
        message: text.trim(),
      };
      wsRef.current.send(JSON.stringify(messageData));
      console.log("Message sent successfully!");
      return true;
    } catch (error) {
      console.error("Error sending message:", error);
      if (!hasShownErrorRef.current) {
        toast.error("Failed to send message");
        hasShownErrorRef.current = true;
      }
      return false;
    }
  }, []);

  // ============================================
  // Send typing indicator
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
  // Disconnect
  // ============================================
  const disconnect = useCallback(() => {
    if (wsRef.current) {
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
    reconnectAttempts.current = 0;
    hasShownErrorRef.current = false;
    processedMessageIds.current.clear();
  }, []);

  // ============================================
  // Lifecycle
  // ============================================
  useEffect(() => {
    if (conversationId) {
      connect();
    }

    return () => {
      disconnect();
    };
  }, [conversationId]);

  return {
    isConnected,
    isConnecting,
    sendMessage,
    sendTyping,
    disconnect,
    reconnect: connect,
  };
};
