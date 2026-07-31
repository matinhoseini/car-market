"use client";

import Link from "next/link";
import { ArrowLeft, Phone, Video, MoreVertical } from "lucide-react";

const ChatHeader = ({ otherUser, carInfo, isOnline }) => {
  return (
    <div className="flex items-center justify-between p-4 border-b border-[rgb(var(--border))] bg-[rgb(var(--card))]">
      {/* ===== Left side ===== */}
      <div className="flex items-center gap-3">
        <Link
          href="/dashboard/messages"
          className="p-2 hover:bg-[rgb(var(--muted))] rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>

        {/* Avatar */}
        <div className="relative">
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-primary-500 to-accent-500 flex items-center justify-center text-white font-bold">
            {otherUser?.username?.charAt(0).toUpperCase() || "U"}
          </div>
          {isOnline && (
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-[rgb(var(--card))]"></div>
          )}
        </div>

        {/* User info */}
        <div>
          <h3 className="font-semibold">
            {otherUser?.username || "Unknown User"}
          </h3>
          <p className="text-xs text-[rgb(var(--muted-foreground))]">
            {isOnline ? (
              <span className="text-green-500">🟢 Online</span>
            ) : (
              <span className="text-gray-400">⚪ Offline</span>
            )}
          </p>
        </div>
      </div>

      {/* ===== Right side ===== */}
      <div className="flex items-center gap-1">
        {carInfo && (
          <Link
            href={`/cars/${carInfo.id}`}
            className="text-xs text-[rgb(var(--muted-foreground))] hover:text-primary-500 transition-colors px-2"
          >
            🚗 {carInfo.brand} {carInfo.model}
          </Link>
        )}

        <button className="p-2 hover:bg-[rgb(var(--muted))] rounded-lg transition-colors">
          <Phone className="w-5 h-5" />
        </button>
        <button className="p-2 hover:bg-[rgb(var(--muted))] rounded-lg transition-colors">
          <Video className="w-5 h-5" />
        </button>
        <button className="p-2 hover:bg-[rgb(var(--muted))] rounded-lg transition-colors">
          <MoreVertical className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default ChatHeader;
