"use client";

import { useAuthStore } from "../../store/authStore";

const MessageBubble = ({ message, showTime = true }) => {
  const { user } = useAuthStore();
  const isOwn = message.sender === user?.id;

  // ============================================
  // 🕐 Format time (English - 12-hour with AM/PM)
  // ============================================
  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true, // ✅ AM/PM
    });
    // خروجی: "10:30 AM" یا "02:30 PM"
  };

  return (
    <div className={`flex ${isOwn ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[75%] rounded-2xl px-4 py-2 ${
          isOwn
            ? "bg-primary-500 text-white rounded-br-none"
            : "bg-[rgb(var(--muted))] text-[rgb(var(--foreground))] rounded-bl-none"
        }`}
      >
        {/* Sender name (for other messages) */}
        {!isOwn && (
          <p className="text-xs font-semibold text-[rgb(var(--muted-foreground))] mb-1">
            {message.sender_username || "User"}
          </p>
        )}

        {/* Message text */}
        <p className="break-words whitespace-pre-wrap">{message.text}</p>

        {/* Timestamp and read receipt */}
        <div
          className={`flex items-center gap-2 mt-1 ${
            isOwn ? "justify-end" : "justify-start"
          }`}
        >
          <p
            className={`text-[10px] ${
              isOwn ? "text-primary-100" : "text-[rgb(var(--muted-foreground))]"
            }`}
          >
            {showTime && formatTime(message.created_at)}
          </p>
          {isOwn && message.is_read && (
            <span className="text-[10px] text-primary-200">✓✓</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;
