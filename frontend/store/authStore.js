import { create } from "zustand";
import { persist } from "zustand/middleware";

// ============================================
// 📦 Auth Store with Zustand
// ============================================
const useAuthStore = create(
  persist(
    (set, get) => ({
      // ===== State =====
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,

      // ===== Actions =====
      setUser: (user) => set({ user, isAuthenticated: !!user }),

      setToken: (token) => set({ token }),

      setLoading: (isLoading) => set({ isLoading }),

      login: (user, token) => {
        set({
          user,
          token,
          isAuthenticated: true,
        });
        localStorage.setItem("access_token", token);
      },

      logout: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        });
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
      },

      updateUser: (userData) => {
        set((state) => ({
          user: { ...state.user, ...userData },
        }));
      },
    }),
    {
      name: "auth-storage",
      getStorage: () => localStorage,
    },
  ),
);

// ✅ export default
export default useAuthStore;
