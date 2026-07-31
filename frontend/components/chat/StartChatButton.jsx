"use client";

import { useState } from "react";
import { useRouter } from "next/navigation"; // ✅ برای App Router
import { useStartConversation } from "../../hooks/useConversations";
import { MessageCircle } from "lucide-react";

const StartChatButton = ({ carId, sellerId, sellerUsername }) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const startConversation = useStartConversation();

  const handleStartChat = async () => {
    if (isLoading) return;

    setIsLoading(true);
    try {
      const result = await startConversation.mutateAsync(carId);

      if (result?.id) {
        router.push(`/dashboard/messages/${result.id}`);
      }
    } catch (error) {
      console.error("Error starting conversation:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleStartChat}
      disabled={isLoading}
      className="flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
    >
      <MessageCircle className="w-5 h-5" />
      {isLoading ? "Starting..." : `Chat with ${sellerUsername}`}
    </button>
  );
};

export default StartChatButton;
