// components/vehicles/VehicleCard.jsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { Heart, MapPin, Calendar, Fuel, Gauge, Users } from "lucide-react";
import { useState, useEffect } from "react";
import { vehiclesService } from "@/services/vehicles.service";

export default function VehicleCard({ car }) {
  const [isLiked, setIsLiked] = useState(car.is_favorite || false);
  const [isLoading, setIsLoading] = useState(false);
  const [imgError, setImgError] = useState(false);
  const [user, setUser] = useState(null);

  // ===== Check if user is logged in =====
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token) {
      setUser({ id: 1 });
    }
  }, []);

  // ===== Update isLiked when car prop changes =====
  useEffect(() => {
    setIsLiked(car.is_favorite || false);
  }, [car.is_favorite]);

  // ===== Get image URL with full path =====
  const getImageUrl = () => {
    if (!car.images?.[0]?.image) return "";

    const imagePath = car.images[0].image;

    if (imagePath.startsWith("/media/")) {
      return `http://localhost:8000${imagePath}`;
    }
    return imagePath;
  };

  const imageUrl = getImageUrl();

  // ===== Format helpers =====
  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-US").format(price);
  };

  const formatMileage = (mileage) => {
    return new Intl.NumberFormat("en-US").format(mileage);
  };

  // ===== Handle favorite toggle =====
  const handleFavoriteToggle = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      alert("Please login to add favorites");
      return;
    }

    if (isLoading) return;

    // Optimistic update
    const previousState = isLiked;
    setIsLiked(!isLiked);
    setIsLoading(true);

    try {
      if (isLiked) {
        await vehiclesService.removeFavorite(car.id);
        console.log("Favorite removed successfully");
      } else {
        await vehiclesService.addFavorite(car.id);
        console.log("Favorite added successfully");
      }
    } catch (error) {
      // Revert on error
      setIsLiked(previousState);

      console.error("Error toggling favorite:", error);
      console.error("Error response:", error.response);
      console.error("Error message:", error.message);

      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.detail ||
        error.message ||
        "Failed to update favorites. Please try again.";
      alert(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="group relative bg-[rgb(var(--card))] rounded-xl border border-[rgb(var(--border))] overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
      {/* ===== Image with next/image ===== */}
      <Link href={`/vehicles/${car.id}`}>
        <div className="relative w-full h-52 md:h-56 lg:h-60 bg-gray-100 overflow-hidden">
          {imageUrl && !imgError ? (
            <Image
              src={imageUrl}
              alt={car.title || "Car"}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-contain group-hover:scale-105 transition-transform duration-700"
              onError={() => setImgError(true)}
              priority={false}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-4xl text-gray-400 bg-gray-100">
              🚗
            </div>
          )}

          {/* ===== Status Badges ===== */}
          <div className="absolute top-3 left-3 flex gap-2 z-10">
            {car.is_featured && (
              <span className="px-3 py-1 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white text-xs font-semibold rounded-full shadow-lg">
                ⭐ Featured
              </span>
            )}
            {car.status === "new" && (
              <span className="px-3 py-1 bg-gradient-to-r from-green-500 to-emerald-600 text-white text-xs font-semibold rounded-full shadow-lg">
                🆕 New
              </span>
            )}
          </div>

          {/* ===== Owner Badge ===== */}
          <div className="absolute bottom-3 left-3 z-10">
            <span className="px-3 py-1 bg-black/60 backdrop-blur-sm text-white text-xs rounded-full">
              👤 {car.owner_username || "Unknown"}
            </span>
          </div>

          {/* ===== Favorite Button ===== */}
          <button
            onClick={handleFavoriteToggle}
            disabled={isLoading}
            className={`absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-md hover:scale-110 transition-transform z-10 ${
              isLoading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            <Heart
              className={`w-5 h-5 transition-all ${
                isLiked
                  ? "fill-red-500 text-red-500 animate-pulse"
                  : "text-gray-600 hover:text-red-500"
              } ${isLoading ? "animate-spin" : ""}`}
            />
          </button>
        </div>
      </Link>

      {/* ===== Content ===== */}
      <div className="p-4 md:p-5 space-y-3">
        {/* ===== Title & Price ===== */}
        <div className="flex justify-between items-start gap-2">
          <Link href={`/vehicles/${car.id}`}>
            <h3 className="text-base md:text-lg font-semibold text-[rgb(var(--foreground))] hover:text-primary-500 transition line-clamp-1">
              {car.title || `${car.brand} ${car.model}`}
            </h3>
          </Link>
          <p className="text-lg md:text-xl font-bold text-primary-500 whitespace-nowrap">
            ${formatPrice(car.price)}
          </p>
        </div>

        {/* ===== Car Specs ===== */}
        <div className="flex flex-wrap items-center gap-2 text-xs md:text-sm text-[rgb(var(--muted-foreground))]">
          <span className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" />
            {car.year}
          </span>
          <span className="w-px h-4 bg-[rgb(var(--border))]" />
          <span className="flex items-center gap-1">
            <Gauge className="w-3.5 h-3.5" />
            {formatMileage(car.mileage)} km
          </span>
          <span className="w-px h-4 bg-[rgb(var(--border))]" />
          <span className="flex items-center gap-1">
            <Fuel className="w-3.5 h-3.5" />
            {car.fuel_type}
          </span>
          <span className="w-px h-4 bg-[rgb(var(--border))]" />
          <span className="flex items-center gap-1">
            <Users className="w-3.5 h-3.5" />
            {car.gearbox}
          </span>
        </div>

        {/* ===== Location ===== */}
        <div className="flex items-center gap-1 text-sm text-[rgb(var(--muted-foreground))]">
          <MapPin className="w-4 h-4" />
          <span>{car.city || "Unknown"}</span>
        </div>

        {/* ===== View Details Button ===== */}
        <Link href={`/vehicles/${car.id}`}>
          <button className="w-full mt-2 btn-primary btn-sm text-sm group-hover:shadow-lg transition-all">
            View Details
            <span className="inline-block group-hover:translate-x-1 transition-transform">
              →
            </span>
          </button>
        </Link>
      </div>
    </div>
  );
}
