// services/auth.service.js
import { api } from "./apiClient";

export const authService = {
  // ===== Get user profile =====
  getProfile: async () => {
    const response = await api.get("/users/profile/");
    return response.data;
  },

  // ===== Update user profile (PATCH - only changed fields) =====
  updateProfile: async (data) => {
    const response = await api.patch("/users/profile/", data);
    return response.data;
  },

  // ===== Change password =====
  changePassword: async (data) => {
    const response = await api.post("/users/change-password/", data);
    return response.data;
  },

  // ===== Login =====
  login: async (data) => {
    const response = await api.post("/users/login/", data);
    return response.data;
  },

  // ===== Register =====
  register: async (data) => {
    const response = await api.post("/users/register/", data);
    return response.data;
  },

  // ===== Logout =====
  logout: async () => {
    try {
      await api.post("/users/logout/");
    } catch {
      // Ignore errors
    } finally {
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      localStorage.removeItem("user");
    }
  },
};
