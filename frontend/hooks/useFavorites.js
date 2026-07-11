// hooks/useFavorites.js
import { useState, useEffect } from "react";
import { vehiclesService } from "@/services/vehicles.service";
import toast from "react-hot-toast";

export function useFavorites(carId, initialIsFavorite = false) {
  const [isLiked, setIsLiked] = useState(initialIsFavorite);
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [isMounted, setIsMounted] = useState(false);

  // ===== Check if component is mounted (client-side only) =====
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // ===== Check if user is logged in (only on client) =====
  useEffect(() => {
    if (isMounted) {
      const token = localStorage.getItem("access_token");
      if (token) {
        setUser({ id: 1 });
      }
    }
  }, [isMounted]);

  // ===== Sync with initial value when it changes =====
  useEffect(() => {
    setIsLiked(initialIsFavorite);
  }, [initialIsFavorite]);

  // ===== Toggle favorite =====
  const toggleFavorite = async () => {
    if (!user) {
      toast.error("Please login to add favorites");
      return;
    }

    if (isLoading) return;

    // Optimistic update
    const previousState = isLiked;
    setIsLiked(!isLiked);
    setIsLoading(true);

    try {
      if (isLiked) {
        await vehiclesService.removeFavorite(carId);
        toast.success("Removed from favorites");
      } else {
        await vehiclesService.addFavorite(carId);
        toast.success("Added to favorites");
      }
    } catch (error) {
      // Revert on error
      setIsLiked(previousState);

      console.error("Error toggling favorite:", error);

      let errorMessage = "Failed to update favorites. Please try again.";

      if (error.response) {
        if (error.response.status === 404) {
          errorMessage = "API endpoint not found.";
        } else if (error.response.status === 401) {
          errorMessage = "Please login again.";
          localStorage.removeItem("access_token");
        } else if (error.response.data?.detail) {
          errorMessage = error.response.data.detail;
        }
      }

      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLiked,
    isLoading,
    toggleFavorite,
    user,
  };
}
