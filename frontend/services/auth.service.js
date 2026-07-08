// services/auth.service.js
import { api } from "./apiClient";

export const authService = {
  // ===== Register =====
  register: async (data) => {
    console.log("📤 Sending to server:", data);
    const response = await api.post("/users/register/", data);
    return response.data;
  },

  // ===== Login =====
  login: async (data) => {
    const response = await api.post("/token/", data);
    return response.data;
  },

  // ===== Get Profile =====
  getProfile: async () => {
    const response = await api.get("/auth/profile/");
    return response.data;
  },

  // ===== Logout =====
  logout: () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user");
  },
};
