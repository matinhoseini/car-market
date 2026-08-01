"use client";

import { useState, useRef, useEffect } from "react";

const MessageInput = ({
  onSend,
  onTyping,
  disabled = false,
  placeholder = "Type your message...",
}) => {
  const [text, setText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const textareaRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const lastSentRef = useRef(""); // Track last sent message

  // ============================================
  // Handle send message
  // ============================================
  const handleSubmit = (e) => {
    e.preventDefault();

    // Block if sending, disabled, or empty
    if (isSending || disabled || !text.trim()) {
      console.log("Blocked:", { isSending, disabled, text: text.trim() });
      return;
    }

    // Block duplicate text
    if (text.trim() === lastSentRef.current) {
      console.log("Duplicate text blocked:", text.trim());
      return;
    }

    console.log("Sending message:", text.trim());
    setIsSending(true);
    lastSentRef.current = text.trim();

    try {
      onSend(text.trim());
      setText("");
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
      }
    } catch (error) {
      console.error("Error sending:", error);
    } finally {
      // Release lock after 800ms
      setTimeout(() => {
        setIsSending(false);
      }, 800);
    }
  };

  // ============================================
  // Handle Enter key
  // ============================================
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  // ============================================
  // Handle typing indicator
  // ============================================
  const handleChange = (e) => {
    const value = e.target.value;
    setText(value);

    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }

    if (!isTyping && value.trim()) {
      setIsTyping(true);
      if (onTyping) onTyping(true);
    }

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      if (isTyping) {
        setIsTyping(false);
        if (onTyping) onTyping(false);
      }
    }, 2000);
  };

  // ============================================
  // Cleanup
  // ============================================
  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, []);

  return (
    <form onSubmit={handleSubmit} className="flex gap-1.5 sm:gap-2 items-end">
      <textarea
        ref={textareaRef}
        value={text}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        disabled={disabled || isSending}
        rows={1}
        className="flex-1 p-2 sm:p-3 border border-[rgb(var(--border))] rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:bg-[rgb(var(--muted))] max-h-32 min-h-[40px] sm:min-h-[44px] bg-[rgb(var(--background))] text-[rgb(var(--foreground))] text-sm sm:text-base"
      />
      <button
        type="submit"
        disabled={disabled || isSending || !text.trim()}
        className="btn-primary flex items-center gap-1.5 sm:gap-2 h-[40px] sm:h-[44px] px-3 sm:px-4 flex-shrink-0 text-sm sm:text-base"
      >
        {isSending ? "Sending..." : "Send"}
      </button>
    </form>
  );
};

export default MessageInput;
