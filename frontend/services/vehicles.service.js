// services/vehicles.service.js
import { api } from "./apiClient";

export const vehiclesService = {
  // ============================================
  // GET: /api/cars/list/
  // Get all cars with filters
  // Returns: { results: [...], owner_id, owner_username, is_favorite }
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
  // Returns: { ..., owner_id, owner_username, is_favorite }
  // ============================================
  getCarById: async (id) => {
    const response = await api.get(`/cars/${id}/`);
    return response.data;
  },

  // ============================================
  // POST: /api/cars/
  // Create a new car listing
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
  // Add car to favorites (requires JWT)
  // ============================================
  addFavorite: async (carId) => {
    const response = await api.post(`/cars/${carId}/favorite/`);
    return response.data;
  },

  // ============================================
  // POST: /api/cars/{car_id}/favorite/remove/
  // Remove car from favorites (requires JWT)
  // ============================================
  removeFavorite: async (carId) => {
    const response = await api.post(`/cars/${carId}/favorite/remove/`);
    return response.data;
  },

  // ============================================
  // GET: /api/cars/favorites/
  // Get all favorite cars (requires JWT)
  // Returns: [{ id, car: {...}, created_at }]
  // ============================================
  getFavorites: async () => {
    const response = await api.get("/cars/favorites/");

    // Transform response: extract car data from nested structure
    if (
      Array.isArray(response.data) &&
      response.data.length > 0 &&
      response.data[0].car
    ) {
      return response.data.map((item) => ({
        ...item.car,
        favorite_id: item.id,
        favorited_at: item.created_at,
      }));
    }

    if (Array.isArray(response.data)) {
      return response.data;
    }

    if (response.data.results) {
      return response.data.results;
    }

    return response.data;
  },

  // ============================================
  // PUT: /api/cars/{id}/
  // Update car listing
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
  // Delete car listing
  // ============================================
  deleteCar: async (id) => {
    const response = await api.delete(`/cars/${id}/`);
    return response.data;
  },

  // ============================================
  // POST: /api/cars/{id}/upload-image/
  // Upload image to car listing
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
  // Delete specific image
  // ============================================
  deleteImage: async (carId, imageId) => {
    const response = await api.delete(`/cars/${carId}/images/${imageId}/`);
    return response.data;
  },
};
