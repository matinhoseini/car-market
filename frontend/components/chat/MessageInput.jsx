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
  const textareaRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  // ============================================
  // 📤 Handle send
  // ============================================
  const handleSubmit = (e) => {
    e.preventDefault();
    if (text.trim() && !disabled) {
      onSend(text.trim());
      setText("");
      // Reset textarea height
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
      }
    }
  };

  // ============================================
  // ⌨️ Handle key down (Enter to send)
  // ============================================
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  // ============================================
  // ⌨️ Handle typing indicator
  // ============================================
  const handleChange = (e) => {
    const value = e.target.value;
    setText(value);

    // Auto-resize
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }

    // Typing indicator
    if (!isTyping && value.trim()) {
      setIsTyping(true);
      if (onTyping) onTyping(true);
    }

    // Clear typing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Stop typing after 2 seconds of no input
    typingTimeoutRef.current = setTimeout(() => {
      if (isTyping) {
        setIsTyping(false);
        if (onTyping) onTyping(false);
      }
    }, 2000);
  };

  // ============================================
  // 🧹 Cleanup
  // ============================================
  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, []);

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 items-end">
      <textarea
        ref={textareaRef}
        value={text}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        disabled={disabled}
        rows={1}
        className="flex-1 p-2 border border-[rgb(var(--border))] rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:bg-[rgb(var(--muted))] max-h-32 min-h-[44px] bg-[rgb(var(--background))] text-[rgb(var(--foreground))]"
      />
      <button
        type="submit"
        disabled={disabled || !text.trim()}
        className="btn-primary flex items-center gap-2 h-[44px] px-4 flex-shrink-0"
      >
        Send
      </button>
    </form>
  );
};

export default MessageInput;
