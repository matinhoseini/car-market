"use client";

import { useEffect, useState } from "react";
import { FiMoon, FiSun } from "react-icons/fi";

export default function DarkToggle() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("theme");
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)",
    ).matches;

    if (saved === "dark" || (!saved && prefersDark)) {
      document.documentElement.classList.add("dark");
      setIsDark(true);
    }
  }, []);

  const toggle = () => {
    if (isDark) {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    }
    setIsDark(!isDark);
  };

  return (
    <button
      onClick={toggle}
      className="relative w-14 h-8 rounded-full bg-[rgb(var(--muted))] transition-colors duration-300 hover:bg-[rgb(var(--muted))]/80 focus:outline-none focus:ring-2 focus:ring-primary-500"
      aria-label="Toggle dark mode"
    >
      <span
        className={`
          absolute top-1 left-1 w-6 h-6 rounded-full bg-white shadow-md 
          flex items-center justify-center text-sm transition-all duration-300
          ${isDark ? "translate-x-6" : "translate-x-0"}
        `}
      >
        {isDark ? (
          <FiMoon className="text-gray-800" size={14} />
        ) : (
          <FiSun className="text-yellow-500" size={14} />
        )}
      </span>
    </button>
  );
}
