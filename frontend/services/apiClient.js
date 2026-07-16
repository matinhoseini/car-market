// services/apiClient.js
import axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

console.log("🔗 API Base URL:", BASE_URL);

export const api = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

// ===== Request Interceptor =====
api.interceptors.request.use(
  (config) => {
    // ✅ فقط در مرورگر اجرا کن
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("access_token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// ===== Response Interceptor =====
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // ✅ فقط در مرورگر اجرا کن
        if (typeof window !== "undefined") {
          const refreshToken = localStorage.getItem("refresh_token");
          if (refreshToken) {
            const response = await axios.post(`${BASE_URL}/token/refresh/`, {
              refresh: refreshToken,
            });
            const newToken = response.data.access;
            localStorage.setItem("access_token", newToken);
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            return api(originalRequest);
          }
        }
      } catch (refreshError) {
        if (typeof window !== "undefined") {
          localStorage.removeItem("access_token");
          localStorage.removeItem("refresh_token");
          localStorage.removeItem("user");
          window.location.href = "/auth/login";
        }
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);
