// components/vehicles/VehicleCard.jsx
"use client";

import Link from "next/link";
import Image from "next/image";
import {
  Heart,
  MapPin,
  Calendar,
  Fuel,
  Gauge,
  Users,
  MoreVertical,
} from "lucide-react";
import { useState, useMemo, useCallback, memo } from "react";
import { useFavorites } from "@/hooks/useFavorites";
import { getFirstImage } from "@/helpers/image";
import { formatPrice, formatMileage } from "@/helpers/format";

// ===== Memoized VehicleCard =====
const VehicleCard = memo(
  ({ car, showActions = false, onActionClick = null }) => {
    const [imgError, setImgError] = useState(false);

    // ===== Memoized values =====
    const imageUrl = useMemo(() => getFirstImage(car), [car]);
    const formattedPrice = useMemo(() => formatPrice(car.price), [car.price]);
    const formattedMileage = useMemo(
      () => formatMileage(car.mileage),
      [car.mileage],
    );

    // ===== Use favorites hook =====
    const { isLiked, isLoading, toggleFavorite } = useFavorites(
      car.id,
      car.is_favorite || false,
    );

    // ===== Memoized handlers =====
    const handleFavoriteClick = useCallback(
      (e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleFavorite();
      },
      [toggleFavorite],
    );

    const handleImageError = useCallback(() => {
      setImgError(true);
    }, []);

    const handleActionClick = useCallback(
      (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (onActionClick) onActionClick(car);
      },
      [car, onActionClick],
    );

    // ===== Memoized car specs =====
    const carSpecs = useMemo(
      () => [
        { icon: Calendar, value: car.year },
        { icon: Gauge, value: `${formattedMileage} km` },
        { icon: Fuel, value: car.fuel_type },
        { icon: Users, value: car.gearbox },
      ],
      [car.year, formattedMileage, car.fuel_type, car.gearbox],
    );

    const hasImage = imageUrl && !imgError;
    const showFavoriteButton = !showActions;

    return (
      <div className="group relative bg-[rgb(var(--card))] rounded-xl border border-[rgb(var(--border))] overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 will-change-transform h-full flex flex-col">
        {/* ===== Image Section ===== */}
        <Link
          href={`/vehicles/${car.id}`}
          prefetch={false}
          className="block flex-shrink-0"
        >
          <div className="relative w-full aspect-[16/10] bg-gray-100 overflow-hidden">
            {hasImage ? (
              <Image
                src={imageUrl}
                alt={car.title || "Car"}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                onError={handleImageError}
                loading="lazy"
                quality={80}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-5xl text-gray-400 bg-gray-100">
                🚗
              </div>
            )}

            {/* ===== Status Badges ===== */}
            {(car.is_featured || car.status === "new") && (
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
            )}

            {/* ===== Owner Badge ===== */}
            {car.owner_username && (
              <div className="absolute bottom-3 left-3 z-10">
                <span className="px-3 py-1 bg-black/60 backdrop-blur-sm text-white text-xs rounded-full">
                  👤 {car.owner_username}
                </span>
              </div>
            )}

            {/* ===== Actions Button (Dashboard Only) ===== */}
            {showActions && onActionClick && (
              <button
                onClick={handleActionClick}
                className="absolute top-3 right-3 p-2 bg-[rgb(var(--card))] rounded-full shadow-md hover:scale-105 transition border border-[rgb(var(--border))] z-20"
                aria-label="Vehicle actions"
              >
                <MoreVertical className="w-5 h-5 text-[rgb(var(--foreground))]" />
              </button>
            )}

            {/* ===== Favorite Button ===== */}
            {showFavoriteButton && (
              <button
                onClick={handleFavoriteClick}
                disabled={isLoading}
                className={`absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-md hover:scale-110 transition-transform z-10 ${
                  isLoading ? "opacity-50 cursor-not-allowed" : ""
                }`}
                aria-label="Toggle favorite"
              >
                <Heart
                  className={`w-5 h-5 transition-all ${
                    isLiked
                      ? "fill-red-500 text-red-500"
                      : "text-gray-600 hover:text-red-500"
                  } ${isLoading ? "animate-spin" : ""}`}
                />
              </button>
            )}
          </div>
        </Link>

        {/* ===== Content Section ===== */}
        <div className="p-4 md:p-5 flex flex-col flex-1">
          {/* ===== Title & Price ===== */}
          <div className="flex justify-between items-start gap-2 mb-2">
            <Link
              href={`/vehicles/${car.id}`}
              prefetch={false}
              className="flex-1 min-w-0"
            >
              <h3 className="text-base md:text-lg font-semibold text-[rgb(var(--foreground))] hover:text-primary-500 transition line-clamp-1">
                {car.title || `${car.brand} ${car.model}`}
              </h3>
            </Link>
            <p className="text-lg md:text-xl font-bold text-primary-500 whitespace-nowrap flex-shrink-0">
              {formattedPrice}
            </p>
          </div>

          {/* ===== Car Specs ===== */}
          <div className="flex flex-wrap items-center gap-2 text-xs md:text-sm text-[rgb(var(--muted-foreground))] mb-2">
            {carSpecs.map((spec, index) => {
              const Icon = spec.icon;
              return (
                <span key={index} className="flex items-center gap-1">
                  <Icon className="w-3.5 h-3.5" />
                  {spec.value}
                  {index < carSpecs.length - 1 && (
                    <span className="w-px h-4 bg-[rgb(var(--border))] mx-1" />
                  )}
                </span>
              );
            })}
          </div>

          {/* ===== Location ===== */}
          <div className="flex items-center gap-1 text-sm text-[rgb(var(--muted-foreground))] mb-3">
            <MapPin className="w-4 h-4" />
            <span className="truncate">{car.city || "Unknown"}</span>
          </div>

          {/* ===== View Details Button ===== */}
          <Link
            href={`/vehicles/${car.id}`}
            prefetch={false}
            className="mt-auto"
          >
            <button className="w-full btn-primary btn-sm text-sm group-hover:shadow-lg transition-all">
              View Details
              <span className="inline-block group-hover:translate-x-1 transition-transform">
                →
              </span>
            </button>
          </Link>
        </div>
      </div>
    );
  },
);

VehicleCard.displayName = "VehicleCard";

export default VehicleCard;
