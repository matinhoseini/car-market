// components/common/Modal.jsx
"use client";

import { useEffect, useRef } from "react";
import { X } from "lucide-react";

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  size = "md",
  showCloseButton = true,
}) {
  const modalRef = useRef(null);

  // Close on Escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  // Close on click outside
  const handleBackdropClick = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      onClose();
    }
  };

  if (!isOpen) return null;

  const sizeClasses = {
    sm: "max-w-md",
    md: "max-w-lg",
    lg: "max-w-2xl",
    xl: "max-w-4xl",
    full: "max-w-6xl",
  };

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade-in p-4"
      onClick={handleBackdropClick}
    >
      <div
        ref={modalRef}
        className={`bg-[rgb(var(--card))] rounded-xl shadow-2xl w-full ${sizeClasses[size]} max-h-[90vh] flex flex-col animate-scale-in`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* ===== Header ===== */}
        <div className="flex justify-between items-center p-4 md:p-6 border-b border-[rgb(var(--border))] flex-shrink-0">
          <h2 className="text-lg md:text-xl font-bold font-heading">{title}</h2>
          {showCloseButton && (
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-[rgb(var(--muted))] transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* ===== Body ===== */}
        <div className="p-4 md:p-6 overflow-y-auto flex-1">{children}</div>
      </div>
    </div>
  );
}
