import { api } from "./apiClient";

// ============================================
// 📦 Vehicles Service
// ============================================
export const vehiclesService = {
  // ============================================
  // GET: /api/cars/list/
  // Get all cars with filters (Backend supported)
  // ============================================
  getAllCars: async (filters = {}) => {
    const allowedFilters = {
      search: filters.search || undefined,
      brand: filters.brand || undefined,
      city: filters.city || undefined,
      fuel_type: filters.fuel_type || undefined,
      gearbox: filters.gearbox || undefined,
      price_min: filters.price_min || undefined,
      price_max: filters.price_max || undefined,
      year_min: filters.year_min || undefined,
      year_max: filters.year_max || undefined,
      ordering: filters.ordering || "-created_at",
      page_size: filters.page_size || 100,
    };

    Object.keys(allowedFilters).forEach((key) => {
      if (
        allowedFilters[key] === undefined ||
        allowedFilters[key] === "" ||
        allowedFilters[key] === null
      ) {
        delete allowedFilters[key];
      }
    });

    console.log("📡 Fetching cars with filters:", allowedFilters);

    const response = await api.get("/cars/list/", {
      params: allowedFilters,
    });

    return response.data;
  },

  // ============================================
  // GET: /api/cars/{id}
  // Get car details by ID
  // ============================================
  getCarById: async (id) => {
    console.log("📡 getCarById called with id:", id);
    const response = await api.get(`/cars/${id}/`);
    console.log("✅ Car received:", response.data);
    return response.data;
  },

  // ============================================
  // GET: /api/cars/manage/
  // Get all cars owned by current user
  // ============================================
  getMyCars: async () => {
    try {
      const response = await api.get("/cars/manage/");
      return response.data;
    } catch (error) {
      console.error(
        "❌ Error fetching my cars:",
        error.response?.data || error,
      );
      throw error;
    }
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
  // Add car to favorites
  // ============================================
  addFavorite: async (carId) => {
    const response = await api.post(`/cars/${carId}/favorite/`);
    return response.data;
  },

  // ============================================
  // DELETE: /api/cars/{car_id}/favorite/
  // Remove car from favorites
  // ============================================
  removeFavorite: async (carId) => {
    const response = await api.delete(`/cars/${carId}/favorite/`);
    return response.data;
  },

  // ============================================
  // GET: /api/cars/favorites/
  // Get all favorite cars
  // ============================================
  getFavorites: async () => {
    try {
      const response = await api.get("/cars/favorites/");

      if (Array.isArray(response.data) && response.data.length > 0) {
        if (response.data[0].car) {
          return response.data.map((item) => ({
            ...item.car,
            favorite_id: item.id,
            favorited_at: item.created_at,
          }));
        }
        if (response.data[0].id && response.data[0].title) {
          return response.data;
        }
      }

      if (response.data.results) {
        return response.data.results;
      }

      return response.data;
    } catch (error) {
      console.error(
        "❌ Error fetching favorites:",
        error.response?.data || error,
      );
      throw error;
    }
  },

  // ============================================
  // PUT: /api/cars/manage/{id}
  // Update car listing (owner only)
  // ============================================
  updateCar: async (id, data) => {
    const response = await api.put(`/cars/manage/${id}/`, data, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  },

  // ============================================
  // PATCH: /api/cars/manage/{id}
  // Partial update car listing (owner only)
  // ============================================
  patchCar: async (id, data) => {
    const response = await api.patch(`/cars/manage/${id}/`, data, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  },

  // ============================================
  // DELETE: /api/cars/manage/{id}
  // Delete car listing (owner only)
  // ============================================
  deleteCar: async (id) => {
    const response = await api.delete(`/cars/manage/${id}/`);
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
  // DELETE: /api/cars/image/{image_id}
  // Delete specific image
  // ============================================
  deleteImage: async (imageId) => {
    const response = await api.delete(`/cars/image/${imageId}/`);
    return response.data;
  },
};
