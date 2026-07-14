// app/vehicles/[id]/VehicleDetailClient.jsx
"use client";

import { useState, useEffect } from "react";
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

export default function VehicleDetailClient({ car: initialCar }) {
  const router = useRouter();
  const [car, setCar] = useState(initialCar);
  const [activeImage, setActiveImage] = useState(0);
  const [user, setUser] = useState(null);

  // ===== Check if user is logged in =====
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token) {
      setUser({ id: 1 });
    }
  }, []);

  // ===== Use favorites hook =====
  const { isLiked, isLoading, toggleFavorite } = useFavorites(
    car?.id,
    car?.is_favorite || false,
  );

  // ===== Format helpers =====
  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-US").format(price);
  };

  const formatMileage = (mileage) => {
    return new Intl.NumberFormat("en-US").format(mileage);
  };

  const getImageUrl = (imagePath) => {
    if (!imagePath) return "";
    if (imagePath.startsWith("/media/")) {
      return `http://localhost:8000${imagePath}`;
    }
    return imagePath;
  };

  const getOwnerName = () => {
    if (car?.owner_username) {
      return car.owner_username;
    }
    if (car?.owner_id) {
      return `User #${car.owner_id}`;
    }
    return "Unknown Seller";
  };

  const getOwnerInitial = () => {
    const name = getOwnerName();
    return name.charAt(0).toUpperCase();
  };

  const isOwner = user && car?.owner_id === user.id;

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

  const images = car.images || [];

  return (
    <div className="min-h-[calc(100vh-80px)] bg-[rgb(var(--background))] py-8">
      <div className="container-custom">
        {/* ===== Back Button ===== */}
        <button
          onClick={() => router.back()}
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
                  src={getImageUrl(images[activeImage]?.image)}
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

              {/* ===== Owner Badge ===== */}
              <div className="absolute bottom-4 left-4 z-10">
                <div className="flex items-center gap-2 px-3 py-2 bg-black/60 backdrop-blur-sm rounded-lg text-white">
                  <User className="w-4 h-4" />
                  <span className="text-sm font-medium">{getOwnerName()}</span>
                  {isOwner && (
                    <span className="ml-1 text-xs bg-primary-500 px-2 py-0.5 rounded-full">
                      You
                    </span>
                  )}
                </div>
              </div>

              {/* ===== Favorite Button ===== */}
              <button
                onClick={toggleFavorite}
                disabled={isLoading}
                className={`absolute top-4 right-4 p-3 bg-white/90 backdrop-blur-sm rounded-full shadow-md hover:scale-110 transition-transform z-10 ${
                  isLoading ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                <Heart
                  className={`w-6 h-6 transition-all ${
                    isLiked
                      ? "fill-red-500 text-red-500 animate-pulse"
                      : "text-gray-600 hover:text-red-500"
                  } ${isLoading ? "animate-spin" : ""}`}
                />
              </button>
            </div>

            {images.length > 1 && (
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
                  >
                    <Image
                      src={getImageUrl(img.image)}
                      alt={`${car.title} - ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ===== Right Column: Details ===== */}
          <div>
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
                    {getOwnerName()}
                  </span>
                  {isOwner && (
                    <span className="text-xs bg-primary-500 text-white px-2 py-0.5 rounded-full">
                      Your ad
                    </span>
                  )}
                </div>
              </div>
            </div>

            <p className="text-3xl font-bold text-primary-500 mt-2">
              ${formatPrice(car.price)}
            </p>

            <div className="grid grid-cols-2 gap-3 mt-6">
              <div className="flex items-center gap-2 p-3 bg-[rgb(var(--muted))] rounded-lg">
                <Calendar className="w-4 h-4 text-primary-500" />
                <div>
                  <p className="text-xs text-[rgb(var(--muted-foreground))]">
                    Year
                  </p>
                  <p className="font-medium">{car.year}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 p-3 bg-[rgb(var(--muted))] rounded-lg">
                <Gauge className="w-4 h-4 text-primary-500" />
                <div>
                  <p className="text-xs text-[rgb(var(--muted-foreground))]">
                    Mileage
                  </p>
                  <p className="font-medium">{formatMileage(car.mileage)} km</p>
                </div>
              </div>
              <div className="flex items-center gap-2 p-3 bg-[rgb(var(--muted))] rounded-lg">
                <Fuel className="w-4 h-4 text-primary-500" />
                <div>
                  <p className="text-xs text-[rgb(var(--muted-foreground))]">
                    Fuel
                  </p>
                  <p className="font-medium capitalize">{car.fuel_type}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 p-3 bg-[rgb(var(--muted))] rounded-lg">
                <Users className="w-4 h-4 text-primary-500" />
                <div>
                  <p className="text-xs text-[rgb(var(--muted-foreground))]">
                    Gearbox
                  </p>
                  <p className="font-medium capitalize">{car.gearbox}</p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 mt-4 text-[rgb(var(--muted-foreground))]">
              <MapPin className="w-4 h-4" />
              <span>{car.city || "Location not specified"}</span>
            </div>

            <div className="mt-6">
              <h3 className="font-semibold mb-2">Description</h3>
              <p className="text-[rgb(var(--muted-foreground))] leading-relaxed">
                {car.description || "No description available"}
              </p>
            </div>

            <div className="flex flex-wrap gap-3 mt-8">
              <button className="btn-primary flex-1">
                <Phone className="w-4 h-4 mr-2" />
                Contact Seller
              </button>
              <button className="btn-outline">
                <Share2 className="w-4 h-4" />
              </button>
            </div>

            <div className="mt-6 p-4 bg-[rgb(var(--muted))] rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-primary-500 to-accent-500 flex items-center justify-center text-white font-bold text-lg">
                  {getOwnerInitial()}
                </div>
                <div className="flex-1">
                  <p className="font-semibold flex items-center gap-2">
                    {getOwnerName()}
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
                  <button className="btn-primary btn-sm">
                    <Mail className="w-4 h-4 mr-1" />
                    Contact
                  </button>
                )}
              </div>
            </div>

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
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
