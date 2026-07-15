// app/vehicles/[id]/VehicleDetailClient.jsx
"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  Heart,
  MapPin,
  Calendar,
  Fuel,
  Gauge,
  Users,
  Phone,
  Mail,
  Share2,
  User,
} from "lucide-react";
import { vehiclesService } from "../../../services/vehicles.service";
import { useFavorites } from "../../../hooks/useFavorites";
import toast from "react-hot-toast";

// ===== Import from helpers =====
import {
  getImageUrl,
  getFirstImage,
  getImageByIndex,
} from "../../../helpers/image";
import {
  formatPrice,
  formatMileage,
  formatDate,
  formatRelativeTime,
  truncateText,
} from "../../../helpers/format";
import { getStorage } from "../../../helpers/storage";
import { STORAGE_KEYS } from "../../../helpers/constants";

// ===== Specs configuration (outside component) =====
const SPECS_CONFIG = [
  { key: "year", icon: Calendar, label: "Year" },
  { key: "mileage", icon: Gauge, label: "Mileage" },
  { key: "fuel_type", icon: Fuel, label: "Fuel" },
  { key: "gearbox", icon: Users, label: "Gearbox" },
];

export default function VehicleDetailClient({ car: initialCar }) {
  const router = useRouter();
  const [car, setCar] = useState(initialCar);
  const [activeImage, setActiveImage] = useState(0);
  const [user, setUser] = useState(null);

  // ===== Check if user is logged in =====
  useEffect(() => {
    const token = getStorage(STORAGE_KEYS.ACCESS_TOKEN);
    if (token) {
      setUser({ id: 1 });
    }
  }, []);

  // ===== Use favorites hook =====
  const { isLiked, isLoading, toggleFavorite } = useFavorites(
    car?.id,
    car?.is_favorite || false,
  );

  // ===== Memoized values =====
  const ownerName = useMemo(() => {
    if (car?.owner_username) return car.owner_username;
    if (car?.owner_id) return `User #${car.owner_id}`;
    return "Unknown Seller";
  }, [car]);

  const ownerInitial = useMemo(() => {
    return ownerName.charAt(0).toUpperCase();
  }, [ownerName]);

  const isOwner = useMemo(() => {
    return user && car?.owner_id === user.id;
  }, [user, car]);

  const images = useMemo(() => car?.images || [], [car]);

  const formattedPrice = useMemo(() => formatPrice(car?.price), [car?.price]);
  const formattedMileage = useMemo(
    () => formatMileage(car?.mileage),
    [car?.mileage],
  );
  const formattedDate = useMemo(
    () => formatDate(car?.created_at),
    [car?.created_at],
  );

  // ===== Memoized car specs =====
  const carSpecs = useMemo(() => {
    if (!car) return [];
    return SPECS_CONFIG.map((spec) => ({
      ...spec,
      value:
        spec.key === "mileage"
          ? `${formattedMileage} km`
          : car[spec.key] || "N/A",
    }));
  }, [car, formattedMileage]);

  // ===== Handlers (memoized) =====
  const handleToggleFavorite = useCallback(() => {
    toggleFavorite();
  }, [toggleFavorite]);

  const handleBack = useCallback(() => {
    router.back();
  }, [router]);

  const handleContact = useCallback(() => {
    toast.success("Contact feature coming soon!");
  }, []);

  const handleShare = useCallback(() => {
    if (navigator.share) {
      navigator
        .share({
          title: car?.title || "Car",
          text: `Check out this ${car?.title || "car"}!`,
          url: window.location.href,
        })
        .catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard!");
    }
  }, [car]);

  // ===== Memoized image gallery =====
  const imageGallery = useMemo(() => {
    if (images.length === 0) return null;

    return (
      <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
        {images.map((img, index) => (
          <button
            key={index}
            onClick={() => setActiveImage(index)}
            className={`relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden border-2 transition ${
              activeImage === index
                ? "border-primary-500"
                : "border-transparent hover:border-gray-300"
            }`}
            aria-label={`View image ${index + 1}`}
          >
            <Image
              src={getImageUrl(img.image)}
              alt={`${car?.title || "Car"} - ${index + 1}`}
              fill
              className="object-cover"
            />
          </button>
        ))}
      </div>
    );
  }, [images, activeImage, car?.title]);

  // ===== Memoized owner badge =====
  const ownerBadge = useMemo(() => {
    if (!car) return null;

    return (
      <div className="absolute bottom-4 left-4 z-10">
        <div className="flex items-center gap-2 px-3 py-2 bg-black/60 backdrop-blur-sm rounded-lg text-white">
          <User className="w-4 h-4" />
          <span className="text-sm font-medium">{ownerName}</span>
          {isOwner && (
            <span className="ml-1 text-xs bg-primary-500 px-2 py-0.5 rounded-full">
              You
            </span>
          )}
        </div>
      </div>
    );
  }, [car, ownerName, isOwner]);

  // ===== Memoized favorite button =====
  const favoriteButton = useMemo(() => {
    if (!car) return null;

    return (
      <button
        onClick={handleToggleFavorite}
        disabled={isLoading}
        className={`absolute top-4 right-4 p-3 bg-white/90 backdrop-blur-sm rounded-full shadow-md hover:scale-110 transition-transform z-10 ${
          isLoading ? "opacity-50 cursor-not-allowed" : ""
        }`}
        aria-label="Toggle favorite"
      >
        <Heart
          className={`w-6 h-6 transition-all ${
            isLiked
              ? "fill-red-500 text-red-500 animate-pulse"
              : "text-gray-600 hover:text-red-500"
          } ${isLoading ? "animate-spin" : ""}`}
        />
      </button>
    );
  }, [car, isLiked, isLoading, handleToggleFavorite]);

  // ===== Memoized seller info =====
  const sellerInfo = useMemo(() => {
    if (!car) return null;

    return (
      <div className="mt-6 p-4 bg-[rgb(var(--muted))] rounded-xl">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-gradient-to-r from-primary-500 to-accent-500 flex items-center justify-center text-white font-bold text-lg">
            {ownerInitial}
          </div>
          <div className="flex-1">
            <p className="font-semibold flex items-center gap-2">
              {ownerName}
              {isOwner && (
                <span className="text-xs bg-primary-500 text-white px-2 py-0.5 rounded-full">
                  You
                </span>
              )}
            </p>
            <p className="text-sm text-[rgb(var(--muted-foreground))]">
              <User className="w-3 h-3 inline mr-1" />
              {isOwner ? "This is your ad" : "Car seller"}
            </p>
          </div>
          {!isOwner && (
            <button onClick={handleContact} className="btn-primary btn-sm">
              <Mail className="w-4 h-4 mr-1" />
              Contact
            </button>
          )}
        </div>
      </div>
    );
  }, [car, ownerName, ownerInitial, isOwner, handleContact]);

  // ===== Memoized ad info =====
  const adInfo = useMemo(() => {
    if (!car) return null;

    return (
      <div className="mt-4 p-4 border border-[rgb(var(--border))] rounded-xl">
        <h4 className="text-sm font-semibold mb-2">📋 Ad Information</h4>
        <div className="space-y-1 text-sm text-[rgb(var(--muted-foreground))]">
          <p>
            <span className="font-medium">Ad ID:</span> #{car.id}
          </p>
          <p>
            <span className="font-medium">Owner ID:</span>{" "}
            {car.owner_id || "N/A"}
          </p>
          <p>
            <span className="font-medium">Status:</span>{" "}
            {car.status === "active" ? (
              <span className="text-green-500">Active</span>
            ) : car.status === "sold" ? (
              <span className="text-red-500">Sold</span>
            ) : (
              <span className="text-yellow-500">Pending</span>
            )}
          </p>
          <p>
            <span className="font-medium">Posted:</span> {formattedDate}
          </p>
        </div>
      </div>
    );
  }, [car, formattedDate]);

  // ===== Loading state =====
  if (!car) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-80px)]">
        <div className="text-center">
          <div className="text-6xl mb-4">🚗</div>
          <h2 className="text-2xl font-bold">Car not found</h2>
          <Link href="/vehicles" className="btn-primary mt-4 inline-block">
            Back to vehicles
          </Link>
        </div>
      </div>
    );
  }

  // ===== Render =====
  return (
    <div className="min-h-[calc(100vh-80px)] bg-[rgb(var(--background))] py-8">
      <div className="container-custom">
        {/* ===== Back Button ===== */}
        <button
          onClick={handleBack}
          className="flex items-center gap-2 text-[rgb(var(--muted-foreground))] hover:text-[rgb(var(--foreground))] transition mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to vehicles
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* ===== Left Column: Images ===== */}
          <div>
            <div className="relative w-full h-80 md:h-96 bg-gray-100 rounded-xl overflow-hidden">
              {images.length > 0 ? (
                <Image
                  src={getImageByIndex(car, activeImage)}
                  alt={car.title || "Car"}
                  fill
                  className="object-contain"
                  priority
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-6xl text-gray-400">
                  🚗
                </div>
              )}

              {ownerBadge}
              {favoriteButton}
            </div>

            {imageGallery}
          </div>

          {/* ===== Right Column: Details ===== */}
          <div>
            {/* ===== Title ===== */}
            <div className="flex justify-between items-start gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold font-heading">
                  {car.title || `${car.brand} ${car.model}`}
                </h1>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-sm text-[rgb(var(--muted-foreground))]">
                    Posted by
                  </span>
                  <span className="text-sm font-medium text-primary-500">
                    {ownerName}
                  </span>
                  {isOwner && (
                    <span className="text-xs bg-primary-500 text-white px-2 py-0.5 rounded-full">
                      Your ad
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* ===== Price ===== */}
            <p className="text-3xl font-bold text-primary-500 mt-2">
              {formattedPrice}
            </p>

            {/* ===== Specs Grid ===== */}
            <div className="grid grid-cols-2 gap-3 mt-6">
              {carSpecs.map((spec) => {
                const Icon = spec.icon;
                return (
                  <div
                    key={spec.key}
                    className="flex items-center gap-2 p-3 bg-[rgb(var(--muted))] rounded-lg"
                  >
                    <Icon className="w-4 h-4 text-primary-500" />
                    <div>
                      <p className="text-xs text-[rgb(var(--muted-foreground))]">
                        {spec.label}
                      </p>
                      <p className="font-medium">{spec.value}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* ===== Location ===== */}
            <div className="flex items-center gap-2 mt-4 text-[rgb(var(--muted-foreground))]">
              <MapPin className="w-4 h-4" />
              <span>{car.city || "Location not specified"}</span>
            </div>

            {/* ===== Description ===== */}
            <div className="mt-6">
              <h3 className="font-semibold mb-2">Description</h3>
              <p className="text-[rgb(var(--muted-foreground))] leading-relaxed">
                {car.description || "No description available"}
              </p>
            </div>

            {/* ===== Actions ===== */}
            <div className="flex flex-wrap gap-3 mt-8">
              <button onClick={handleContact} className="btn-primary flex-1">
                <Phone className="w-4 h-4 mr-2" />
                Contact Seller
              </button>
              <button onClick={handleShare} className="btn-outline">
                <Share2 className="w-4 h-4" />
              </button>
            </div>

            {/* ===== Seller Info ===== */}
            {sellerInfo}

            {/* ===== Ad Info ===== */}
            {adInfo}
          </div>
        </div>
      </div>
    </div>
  );
}
