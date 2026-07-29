// hooks/useConversations.js
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { chatService } from "../services/chat.service";

// ============================================
// 📋 Query keys for cache management
// ============================================
export const conversationKeys = {
  all: ["conversations"],
  lists: () => [...conversationKeys.all, "list"],
  list: () => [...conversationKeys.lists()],
  details: () => [...conversationKeys.all, "detail"],
  detail: (id) => [...conversationKeys.details(), id],
};

// ============================================
// 📋 Hook: Get all conversations
// ============================================
/**
 * Get all conversations for the current user
 * Uses React Query for caching and auto-refresh
 *
 * @returns {Object} - { data, isLoading, error, refetch }
 *
 * @example
 * const { data: conversations, isLoading } = useConversations();
 * // conversations = [{ id, car, last_message, unread_count, ... }]
 */
export const useConversations = () => {
  return useQuery({
    queryKey: conversationKeys.list(),
    queryFn: () => chatService.getConversations(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: true,
  });
};

// ============================================
// 📞 Hook: Start a new conversation
// ============================================
/**
 * Start a new conversation with a car owner
 * Automatically invalidates conversations list on success
 *
 * @returns {Object} - { mutate, isLoading, error }
 *
 * @example
 * const { mutate: startConversation } = useStartConversation();
 * startConversation(carId, {
 *   onSuccess: (data) => {
 *     router.push(`/dashboard/messages/${data.id}`);
 *   }
 * });
 */
export const useStartConversation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (carId) => chatService.startConversation(carId),
    onSuccess: () => {
      // Invalidate conversations list to refetch
      queryClient.invalidateQueries({ queryKey: conversationKeys.lists() });
    },
  });
};
