// services/auth.service.js
import { api } from "./apiClient";

export const authService = {
  // ============================================
  // 📝 Register
  // ============================================
  register: async (data) => {
    console.log("📤 Sending to server:", data);
    const response = await api.post("/users/register/", data);
    return response.data;
  },

  // ============================================
  // 🔑 Login (JWT)
  // ============================================
  login: async (data) => {
    const response = await api.post("/token/", data);
    return response.data;
  },

  // ============================================
  // 🔄 Refresh Token
  // ============================================
  refreshToken: async (refresh) => {
    const response = await api.post("/token/refresh/", { refresh });
    return response.data;
  },

  // ============================================
  // 👤 Get Profile (GET)
  // ============================================
  getProfile: async () => {
    const response = await api.get("/users/profile/");
    return response.data;
  },

  // ============================================
  // ✏️ Update Profile (PATCH - only changed fields)
  // ============================================
  updateProfile: async (data) => {
    const response = await api.patch("/users/profile/", data);
    return response.data;
  },

  // ============================================
  // 🚪 Logout
  // ============================================
  logout: () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user");
  },
};
