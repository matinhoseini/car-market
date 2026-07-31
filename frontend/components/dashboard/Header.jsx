"use client";

import useAuthStore from "../../store/authStore"; // ✅ import default

const Header = () => {
  const { user } = useAuthStore();

  return (
    <header className="border-b border-[rgb(var(--border))] bg-[rgb(var(--card))] px-6 py-3">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Dashboard</h2>

        <div className="flex items-center gap-3">
          <span className="text-sm text-[rgb(var(--muted-foreground))]">
            {user?.username || "Guest"}
          </span>
          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-primary-500 to-accent-500 flex items-center justify-center text-white font-bold">
            {user?.username?.charAt(0).toUpperCase() || "G"}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
