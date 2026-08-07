"use client";

import { useAuthStore } from "../../store/authStore";

const MessageBubble = ({
  message,
  showAvatar = true, // ✅ Default: true
  showName = true, // ✅ Default: true
  isFirstInGroup = true,
}) => {
  const { user } = useAuthStore();
  const isOwn = message.sender === user?.id;

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <div className={`flex ${isOwn ? "justify-end" : "justify-start"} mb-0.5`}>
      <div className="flex items-end gap-2 max-w-[85%] sm:max-w-[75%]">
        {/* ===== Avatar (only for first message in group - OTHER users only) ===== */}
        {!isOwn && showAvatar && (
          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-primary-500 to-accent-500 flex items-center justify-center text-white font-bold text-xs flex-shrink-0">
            {message.sender_username?.charAt(0).toUpperCase() || "U"}
          </div>
        )}

        {/* ===== Empty space for alignment ===== */}
        {!isOwn && !showAvatar && <div className="w-8 h-8 flex-shrink-0"></div>}

        <div
          className={`rounded-2xl px-3 py-1.5 sm:px-4 sm:py-2 ${
            isOwn
              ? "bg-blue-500 text-white rounded-br-none"
              : "bg-gray-200 text-gray-800 rounded-bl-none"
          }`}
        >
          {/* ===== Sender name (ONLY for other users' messages - first in group) ===== */}
          {!isOwn && showName && (
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
              <span className="text-[8px] sm:text-[10px] text-blue-200">
                ✓✓
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;
