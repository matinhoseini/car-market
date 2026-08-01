"use client";

import { useAuthStore } from "../../store/authStore";

const MessageBubble = ({ message }) => {
  const { user } = useAuthStore();
  const isOwn = message.sender === user?.id;

  // ============================================
  // Format time (English - 12-hour with AM/PM)
  // ============================================
  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <div className={`flex ${isOwn ? "justify-end" : "justify-start"} mb-1`}>
      <div
        className={`max-w-[85%] sm:max-w-[75%] rounded-2xl px-3 py-1.5 sm:px-4 sm:py-2 ${
          isOwn
            ? "bg-blue-500 text-white rounded-br-none"
            : "bg-gray-200 text-gray-800 rounded-bl-none"
        }`}
      >
        {!isOwn && (
          <p className="text-[10px] sm:text-xs font-semibold text-gray-600 mb-0.5 sm:mb-1">
            {message.sender_username || "User"}
          </p>
        )}

        <p className="text-sm sm:text-base md:text-lg break-words whitespace-pre-wrap leading-relaxed">
          {message.text}
        </p>

        <div
          className={`flex items-center gap-1.5 sm:gap-2 mt-0.5 sm:mt-1 ${
            isOwn ? "justify-end" : "justify-start"
          }`}
        >
          <p
            className={`text-[8px] sm:text-[10px] ${
              isOwn ? "text-blue-100" : "text-gray-500"
            }`}
          >
            {formatTime(message.created_at)}
          </p>
          {isOwn && message.is_read && (
            <span className="text-[8px] sm:text-[10px] text-blue-200">✓✓</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;
