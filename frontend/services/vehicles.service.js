// services/vehicles.service.js
import { api } from "./apiClient";

export const vehiclesService = {
  // ============================================
  // GET: /api/cars/list/
  // Get all cars with various filters
  // ============================================
  getAllCars: async (filters = {}) => {
    const response = await api.get("/cars/list/", {
      params: { ...filters, page_size: 100 },
    });
    return response.data;
  },

  // ============================================
  // GET: /api/cars/{id}/
  // Get car details by ID
  // ============================================
  getCarById: async (id) => {
    const response = await api.get(`/cars/${id}/`);
    return response.data;
  },

  // ============================================
  // POST: /api/cars/
  // Create a new car listing (requires login)
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
  // POST: /api/cars/{car_id}/favorite/
  // Add car to favorites (requires login)
  // ============================================
  addFavorite: async (carId) => {
    const response = await api.post(`/cars/${carId}/favorite/`);
    return response.data;
  },

  // ============================================
  // POST: /api/cars/{car_id}/favorite/remove/
  // Remove car from favorites (requires login)
  // ============================================
  removeFavorite: async (carId) => {
    const response = await api.post(`/cars/${carId}/favorite/remove/`);
    return response.data;
  },

  // ============================================
  // GET: /api/cars/favorites/
  // Get all favorite cars for current user (requires login)
  // ============================================
  getFavorites: async () => {
    const response = await api.get("/cars/favorites/");
    return response.data;
  },

  // ============================================
  // PUT: /api/cars/{id}/
  // Update car listing (requires login)
  // ============================================
  updateCar: async (id, data) => {
    const response = await api.put(`/cars/${id}/`, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  // ============================================
  // DELETE: /api/cars/{id}/
  // Delete car listing (requires login)
  // ============================================
  deleteCar: async (id) => {
    const response = await api.delete(`/cars/${id}/`);
    return response.data;
  },

  // ============================================
  // POST: /api/cars/{id}/upload-image/
  // Upload image to car listing (multipart/form-data)
  // ============================================
  uploadImage: async (carId, formData) => {
    const response = await api.post(`/cars/${carId}/upload-image/`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  // ============================================
  // DELETE: /api/cars/{id}/images/{image_id}/
  // Delete specific image from car listing (requires login)
  // ============================================
  deleteImage: async (carId, imageId) => {
    const response = await api.delete(`/cars/${carId}/images/${imageId}/`);
    return response.data;
  },

  // ============================================
  // GET: /api/cars/search/
  // Search cars by query string
  // ============================================
  searchCars: async (query, filters = {}) => {
    const response = await api.get("/cars/search/", {
      params: { q: query, ...filters },
    });
    return response.data;
  },

  // ============================================
  // GET: /api/cars/filter-options/
  // Get all available filter options
  // ============================================
  getFilterOptions: async () => {
    const response = await api.get("/cars/filter-options/");
    return response.data;
  },

  // ============================================
  // POST: /api/cars/{id}/views/
  // Track car view (increments view count)
  // ============================================
  trackCarView: async (carId) => {
    const response = await api.post(`/cars/${carId}/views/`);
    return response.data;
  },

  // ============================================
  // GET: /api/cars/popular/
  // Get popular cars (most viewed/favorited)
  // ============================================
  getPopularCars: async (limit = 10) => {
    const response = await api.get("/cars/popular/", {
      params: { limit },
    });
    return response.data;
  },
};
