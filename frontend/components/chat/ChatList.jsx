// components/chat/ChatList.jsx
"use client";

import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { faIR } from "date-fns/locale";

const ChatList = ({ conversations }) => {
  return (
    <div className="bg-[rgb(var(--card))] rounded-xl border border-[rgb(var(--border))] overflow-hidden">
      {conversations.map((conv) => (
        <Link
          key={conv.id}
          href={`/dashboard/messages/${conv.id}`}
          className="block border-b border-[rgb(var(--border))] last:border-0 hover:bg-[rgb(var(--muted))] transition-colors"
        >
          <div className="flex items-center gap-4 p-4">
            {/* ===== Avatar ===== */}
            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-primary-500 to-accent-500 flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
              {conv.seller_username?.charAt(0).toUpperCase() ||
                conv.buyer_username?.charAt(0).toUpperCase() ||
                "U"}
            </div>

            {/* ===== Info ===== */}
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-start">
                <h3 className="font-semibold truncate">
                  {conv.seller_username || conv.buyer_username || "Unknown"}
                </h3>
                {conv.last_message_time && (
                  <span className="text-xs text-[rgb(var(--muted-foreground))] flex-shrink-0">
                    {formatDistanceToNow(new Date(conv.last_message_time), {
                      addSuffix: true,
                      locale: faIR,
                    })}
                  </span>
                )}
              </div>

              <div className="flex justify-between items-center mt-1">
                <p className="text-sm text-[rgb(var(--muted-foreground))] truncate">
                  {conv.last_message || "No messages yet"}
                </p>
                {conv.unread_count > 0 && (
                  <span className="bg-primary-500 text-white text-xs font-bold px-2 py-1 rounded-full flex-shrink-0">
                    {conv.unread_count}
                  </span>
                )}
              </div>

              <p className="text-xs text-[rgb(var(--muted-foreground))] mt-1">
                🚗 {conv.car_brand} {conv.car_model}
              </p>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default ChatList;
