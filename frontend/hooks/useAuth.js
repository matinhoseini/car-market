// hooks/useAuth.js
"use client";

import { useState, useEffect, useCallback } from "react";
import { usePathname } from "next/navigation";
import { getStorage } from "../helpers/storage";
import { STORAGE_KEYS } from "../helpers/constants";

// ============================================
// 🔐 Main Auth Hook
// ============================================
export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();

  // ============================================
  // 📥 Fetch user from localStorage
  // ============================================
  const fetchUser = useCallback(() => {
    setLoading(true);
    const userData = getStorage(STORAGE_KEYS.USER);
    if (userData) {
      try {
        setUser(JSON.parse(userData));
      } catch {
        setUser(null);
      }
    } else {
      setUser(null);
    }
    setLoading(false);
  }, []);

  // ============================================
  // 🔄 Auto-refresh user when route changes
  // ============================================
  useEffect(() => {
    fetchUser();
  }, [fetchUser, pathname]);

  // ============================================
  // 📡 Listen for storage changes (sync across tabs)
  // ============================================
  useEffect(() => {
    const handleStorageChange = () => {
      fetchUser();
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [fetchUser]);

  // ============================================
  // 🚪 Logout handler
  // ============================================
  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER);
    setUser(null);
  }, []);

  // ============================================
  // 🔄 Manual refresh
  // ============================================
  const refetch = useCallback(() => {
    fetchUser();
  }, [fetchUser]);

  // ============================================
  // ✏️ Update user (after profile edit)
  // ============================================
  const updateUser = useCallback((newUserData) => {
    setUser(newUserData);
    const storedUser = localStorage.getItem(STORAGE_KEYS.USER);
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        localStorage.setItem(
          STORAGE_KEYS.USER,
          JSON.stringify({ ...parsedUser, ...newUserData }),
        );
      } catch {
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(newUserData));
      }
    } else {
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(newUserData));
    }
    // Notify other tabs
    window.dispatchEvent(new Event("storage"));
  }, []);

  return { user, loading, logout, refetch, updateUser, setUser };
};
