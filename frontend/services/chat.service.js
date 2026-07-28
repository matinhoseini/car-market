// services/chat.service.js
import { api } from "./apiClient";

// ============================================
// 📞 Chat Service - All chat API calls
// ============================================
export const chatService = {
  // ============================================
  // 1️⃣ Start a conversation with car owner
  // ============================================
  /**
   * Start a conversation with the car owner
   * @param {number} carId - Car ID
   * @returns {Promise} - Conversation data
   */
  startConversation: async (carId) => {
    const response = await api.post(`/chat/${carId}/start/`);
    return response.data;
  },

  // ============================================
  // 2️⃣ Get all conversations for current user
  // ============================================
  /**
   * Get all conversations for the current user
   * @returns {Promise} - List of conversations with last message and unread count
   */
  getConversations: async () => {
    const response = await api.get("/chat/conversations/");
    return response.data;
  },

  // ============================================
  // 3️⃣ Get messages of a conversation (paginated)
  // ============================================
  /**
   * Get message history of a conversation (paginated)
   * @param {number} conversationId - Conversation ID
   * @param {number} page - Page number (default: 1)
   * @returns {Promise} - List of messages with pagination info
   */
  getMessages: async (conversationId, page = 1) => {
    const response = await api.get(
      `/chat/conversations/${conversationId}/messages/`,
      {
        params: { page },
      },
    );
    return response.data;
  },

  // ============================================
  // 4️⃣ Mark messages as read
  // ============================================
  /**
   * Mark all messages in a conversation as read
   * @param {number} conversationId - Conversation ID
   * @returns {Promise} - Number of messages marked as read
   */
  markAsRead: async (conversationId) => {
    const response = await api.post(
      `/chat/conversations/${conversationId}/mark-read/`,
    );
    return response.data;
  },

  // ============================================
  // 5️⃣ Get online users
  // ============================================
  /**
   * Get list of online users
   * @returns {Promise} - List of online user IDs
   */
  getOnlineUsers: async () => {
    const response = await api.get("/users/online/");
    return response.data;
  },
};
