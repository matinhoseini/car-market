// hooks/useMessages.js
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { chatService } from "../services/chat.service";
import { conversationKeys } from "./useConversations";

// ============================================
// 📋 Query keys
// ============================================
export const messageKeys = {
  all: ["messages"],
  lists: () => [...messageKeys.all, "list"],
  list: (conversationId) => [...messageKeys.lists(), conversationId],
  details: () => [...messageKeys.all, "detail"],
  detail: (id) => [...messageKeys.details(), id],
};

// ============================================
// 💬 Get messages with infinite scroll
// ============================================
export const useMessages = (conversationId) => {
  return useInfiniteQuery({
    queryKey: messageKeys.list(conversationId),
    queryFn: ({ pageParam = 1 }) =>
      chatService.getMessages(conversationId, pageParam),
    getNextPageParam: (lastPage) => {
      if (lastPage.next) {
        const urlParams = new URLSearchParams(lastPage.next.split("?")[1]);
        return parseInt(urlParams.get("page"));
      }
      return undefined;
    },
    enabled: !!conversationId,
    staleTime: 2 * 60 * 1000,
  });
};

// ============================================
// ✅ Mark messages as read
// ============================================
export const useMarkAsRead = (conversationId) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => chatService.markAsRead(conversationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: conversationKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: messageKeys.list(conversationId),
      });
    },
  });
};
