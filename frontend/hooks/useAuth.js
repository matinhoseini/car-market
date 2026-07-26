// hooks/useAuth.js
"use client";

import { useState, useEffect, useCallback } from "react";
import { usePathname } from "next/navigation";
import { authService } from "../services/auth.service";
import { getStorage } from "../helpers/storage";
import { STORAGE_KEYS } from "../helpers/constants";

// ============================================
// 🔐 Main Auth Hook - fetches user from API
// ============================================
export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();

  // ============================================
  // 📥 Fetch user from API (not localStorage)
  // ============================================
  const fetchUser = useCallback(async () => {
    setLoading(true);
    const token = getStorage(STORAGE_KEYS.ACCESS_TOKEN);

    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      const userData = await authService.getProfile();
      setUser(userData);

      // ===== Update localStorage for other components =====
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(userData));
    } catch (error) {
      console.error("❌ Error fetching user:", error);
      setUser(null);
      localStorage.removeItem(STORAGE_KEYS.USER);
    } finally {
      setLoading(false);
    }
  }, []);

  // ============================================
  // 🔄 Auto-fetch user when route changes
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
    window.addEventListener("user-updated", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("user-updated", handleStorageChange);
    };
  }, [fetchUser]);

  // ============================================
  // 🚪 Logout
  // ============================================
  const logout = useCallback(async () => {
    await authService.logout();
    setUser(null);
  }, []);

  // ============================================
  // 🔄 Manual refresh
  // ============================================
  const refetch = useCallback(() => {
    fetchUser();
  }, [fetchUser]);

  return { user, loading, logout, refetch, setUser };
};
