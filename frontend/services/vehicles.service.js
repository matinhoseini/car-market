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
  // GET: /api/cars/{id}
  // Get car details by ID
  // Returns: { ..., owner_id, owner_username, is_favorite }
  // ============================================
  getCarById: async (id) => {
    const response = await api.get(`/cars/${id}`);
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
  // DELETE: /api/cars/{car_id}/favorite/
  // Remove car from favorites (requires JWT)
  // ============================================
  removeFavorite: async (carId) => {
    const response = await api.delete(`/cars/${carId}/favorite/`);
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
  // PUT: /api/cars/manage/{id}
  // Update car listing (owner only)
  // ============================================
  updateCar: async (id, data) => {
    const response = await api.put(`/cars/manage/${id}`, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  // ============================================
  // PATCH: /api/cars/manage/{id}
  // Partial update car listing (owner only)
  // ============================================
  patchCar: async (id, data) => {
    const response = await api.patch(`/cars/manage/${id}`, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  // ============================================
  // DELETE: /api/cars/manage/{id}
  // Delete car listing (owner only)
  // ============================================
  deleteCar: async (id) => {
    const response = await api.delete(`/cars/manage/${id}`);
    return response.data;
  },

  // ============================================
  // GET: /api/cars/manage/{id}
  // Get car for editing (owner only)
  // ============================================
  getCarForEdit: async (id) => {
    const response = await api.get(`/cars/manage/${id}`);
    return response.data;
  },

  // ============================================
  // POST: /api/cars/{car_id}/upload-image/
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
  // DELETE: /api/cars/{image}/{image_id}
  // Delete specific image
  // NOTE: API uses /cars/{car_id}/images/{image_id}/
  // ============================================
  deleteImage: async (carId, imageId) => {
    // Based on API docs: DELETE /api/cars/{image}/{image_id}
    // Using the correct endpoint format
    const response = await api.delete(`/cars/${carId}/images/${imageId}/`);
    return response.data;
  },
};
