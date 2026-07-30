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
export const useConversations = () => {
  return useQuery({
    queryKey: conversationKeys.list(),
    queryFn: () => chatService.getConversations(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// ============================================
// 📞 Hook: Start a new conversation
// ============================================
export const useStartConversation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (carId) => chatService.startConversation(carId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: conversationKeys.lists() });
    },
  });
};
