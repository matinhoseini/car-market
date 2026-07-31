import { api } from "./apiClient";

export const chatService = {
  // ===== Start conversation =====
  startConversation: async (carId) => {
    const response = await api.post(`/chat/${carId}/start/`);
    return response.data;
  },

  // ===== Get all conversations =====
  getConversations: async () => {
    const response = await api.get("/chat/conversations/");
    return response.data;
  },

  // ===== Get messages =====
  getMessages: async (conversationId, page = 1) => {
    const response = await api.get(
      `/chat/conversations/${conversationId}/messages/`,
      { params: { page } },
    );
    return response.data;
  },

  // ===== Mark as read =====
  markAsRead: async (conversationId) => {
    const response = await api.post(
      `/chat/conversations/${conversationId}/mark-read/`,
    );
    return response.data;
  },

  // ===== Get online users =====
  getOnlineUsers: async () => {
    const response = await api.get("/users/online/");
    return response.data;
  },
};
