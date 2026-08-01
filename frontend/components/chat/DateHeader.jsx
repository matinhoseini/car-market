"use client";

const DateHeader = ({ date }) => {
  // ============================================
  // 🕐 Format date like WhatsApp
  // ============================================
  const formatDateHeader = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    // Reset time part for comparison
    const compareDate = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
    );

    if (compareDate.getTime() === today.getTime()) {
      return "Today";
    } else if (compareDate.getTime() === yesterday.getTime()) {
      return "Yesterday";
    } else {
      // Format: "August 1, 2026" or "1 Aug 2026"
      return date.toLocaleDateString("en-US", {
        weekday: "long", // Monday, Tuesday, etc.
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    }
  };

  return (
    <div className="flex justify-center my-4">
      <div className="bg-[rgb(var(--muted))] px-4 py-1.5 rounded-full text-xs text-[rgb(var(--muted-foreground))] shadow-sm">
        {formatDateHeader(date)}
      </div>
    </div>
  );
};

export default DateHeader;
