import { create } from "zustand";
import { persist } from "zustand/middleware";

const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,

      setUser: (user) => {
        console.log("👤 Setting user:", user);
        set({ user, isAuthenticated: !!user });
      },

      setToken: (token) => set({ token }),

      setLoading: (isLoading) => set({ isLoading }),

      login: (user, token) => {
        console.log("🔐 Login:", { user, token });
        set({
          user,
          token,
          isAuthenticated: true,
        });
        if (typeof window !== "undefined") {
          localStorage.setItem("access_token", token);
        }
      },

      logout: () => {
        console.log("🚪 Logout");
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        });
        if (typeof window !== "undefined") {
          localStorage.removeItem("access_token");
          localStorage.removeItem("refresh_token");
        }
      },

      updateUser: (userData) => {
        set((state) => ({
          user: { ...state.user, ...userData },
        }));
      },
    }),
    {
      name: "auth-storage",
      storage: {
        getItem: (key) => {
          if (typeof window !== "undefined") {
            const value = localStorage.getItem(key);
            return value ? JSON.parse(value) : null;
          }
          return null;
        },
        setItem: (key, value) => {
          if (typeof window !== "undefined") {
            localStorage.setItem(key, JSON.stringify(value));
          }
        },
        removeItem: (key) => {
          if (typeof window !== "undefined") {
            localStorage.removeItem(key);
          }
        },
      },
    },
  ),
);

export default useAuthStore;
export { useAuthStore };
