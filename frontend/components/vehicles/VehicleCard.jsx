// components/vehicles/VehicleCard.jsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { Heart, MapPin, Calendar, Fuel, Gauge, Users } from "lucide-react";
import { useState, useMemo, useCallback } from "react";
import { useFavorites } from "@/hooks/useFavorites";
import { getFirstImage } from "@/helpers/image";
import { formatPrice, formatMileage } from "@/helpers/format";

export default function VehicleCard({ car }) {
  const [imgError, setImgError] = useState(false);

  // ===== Memoized values (prevent unnecessary re-renders) =====
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

  // ===== Memoized handler (prevents new function creation) =====
  const handleFavoriteClick = useCallback(
    (e) => {
      e.preventDefault();
      e.stopPropagation();
      toggleFavorite();
    },
    [toggleFavorite],
  );

  // ===== Memoized image error handler =====
  const handleImageError = useCallback(() => {
    setImgError(true);
  }, []);

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

  return (
    <div className="group relative bg-[rgb(var(--card))] rounded-xl border border-[rgb(var(--border))] overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 will-change-transform">
      {/* ===== Image Section ===== */}
      <Link href={`/vehicles/${car.id}`} prefetch={false}>
        <div className="relative w-full aspect-[4/3] bg-gray-100 overflow-hidden">
          {hasImage ? (
            <Image
              src={imageUrl}
              alt={car.title || "Car"}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              onError={handleImageError}
              loading="lazy"
              quality={75}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-4xl text-gray-400 bg-gray-100">
              🚗
            </div>
          )}

          {/* ===== Status Badges ===== */}
          {(car.is_featured || car.status === "new") && (
            <div className="absolute top-3 left-3 flex gap-2 z-10">
              {car.is_featured && (
                <span className="px-2.5 py-0.5 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white text-[10px] font-semibold rounded-full shadow-lg">
                  ⭐ Featured
                </span>
              )}
              {car.status === "new" && (
                <span className="px-2.5 py-0.5 bg-gradient-to-r from-green-500 to-emerald-600 text-white text-[10px] font-semibold rounded-full shadow-lg">
                  🆕 New
                </span>
              )}
            </div>
          )}

          {/* ===== Owner Badge ===== */}
          {car.owner_username && (
            <div className="absolute bottom-3 left-3 z-10">
              <span className="px-2.5 py-0.5 bg-black/60 backdrop-blur-sm text-white text-[10px] rounded-full">
                👤 {car.owner_username}
              </span>
            </div>
          )}

          {/* ===== Favorite Button ===== */}
          <button
            onClick={handleFavoriteClick}
            disabled={isLoading}
            className={`absolute top-3 right-3 p-1.5 bg-white/90 backdrop-blur-sm rounded-full shadow-md hover:scale-110 transition-transform z-10 ${
              isLoading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            aria-label="Toggle favorite"
          >
            <Heart
              className={`w-4 h-4 transition-all ${
                isLiked
                  ? "fill-red-500 text-red-500"
                  : "text-gray-600 hover:text-red-500"
              } ${isLoading ? "animate-spin" : ""}`}
            />
          </button>
        </div>
      </Link>

      {/* ===== Content Section ===== */}
      <div className="p-4 space-y-2.5">
        {/* ===== Title & Price ===== */}
        <div className="flex justify-between items-start gap-2">
          <Link href={`/vehicles/${car.id}`} prefetch={false}>
            <h3 className="text-sm md:text-base font-semibold text-[rgb(var(--foreground))] hover:text-primary-500 transition line-clamp-1">
              {car.title || `${car.brand} ${car.model}`}
            </h3>
          </Link>
          <p className="text-base md:text-lg font-bold text-primary-500 whitespace-nowrap">
            {formattedPrice}
          </p>
        </div>

        {/* ===== Car Specs ===== */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs text-[rgb(var(--muted-foreground))]">
          {carSpecs.map((spec, index) => {
            const Icon = spec.icon;
            return (
              <span key={index} className="flex items-center gap-1">
                <Icon className="w-3 h-3" />
                {spec.value}
                {index < carSpecs.length - 1 && (
                  <span className="w-px h-3 bg-[rgb(var(--border))] mx-0.5" />
                )}
              </span>
            );
          })}
        </div>

        {/* ===== Location ===== */}
        <div className="flex items-center gap-1 text-xs text-[rgb(var(--muted-foreground))]">
          <MapPin className="w-3.5 h-3.5" />
          <span>{car.city || "Unknown"}</span>
        </div>

        {/* ===== View Details Button ===== */}
        <Link href={`/vehicles/${car.id}`} prefetch={false}>
          <button className="w-full mt-1.5 btn-primary btn-sm text-xs group-hover:shadow-lg transition-all">
            View Details
            <span className="inline-block group-hover:translate-x-0.5 transition-transform">
              →
            </span>
          </button>
        </Link>
      </div>
    </div>
  );
}
