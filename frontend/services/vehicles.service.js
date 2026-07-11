// services/vehicles.service.js
import { api } from "./apiClient";

export const vehiclesService = {
  // ============================================
  // GET: /api/cars/list/
  // لیست تمام ماشین‌ها با فیلترهای مختلف
  // ============================================
  getAllCars: async (filters = {}) => {
    // page_size: 100 برای گرفتن همه ماشین‌ها
    const response = await api.get("/cars/list/", {
      params: { ...filters, page_size: 100 },
    });
    return response.data;
  },

  // ============================================
  // GET: /api/cars/1/
  // دریافت جزئیات یک آگهی با ID
  // ============================================
  getCarById: async (id) => {
    const response = await api.get(`/cars/${id}/`);
    return response.data;
  },

  // ============================================
  // POST: /api/cars/
  // ثبت آگهی جدید (نیاز به لاگین)
  // ============================================
  createCar: async (data) => {
    const response = await api.post("/cars/", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  // ============================================
  // POST: /api/cars/1/upload-image/
  // اضافه کردن عکس به آگهی (multipart/form-data)
  // ============================================
  uploadImage: async (carId, formData) => {
    const response = await api.post(`/cars/${carId}/upload-image/`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },
};
