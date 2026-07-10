// app/vehicles/[id]/page.jsx
"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
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
  Car,
  Clock,
} from "lucide-react";
import { vehiclesService } from "../../../services/vehicles.service";
import toast from "react-hot-toast";

export default function VehicleDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id;

  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [activeImage, setActiveImage] = useState(0);

  // ===== Fetch car details =====
  useEffect(() => {
    const fetchCar = async () => {
      try {
        const data = await vehiclesService.getCarById(id);
        setCar(data);
        // Set first image as active
        setActiveImage(0);
      } catch (error) {
        console.error("Error fetching car:", error);
        toast.error("Failed to load car details");
        router.push("/vehicles");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchCar();
    }
  }, [id, router]);

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

  // ===== Loading state =====
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-80px)]">
        <div className="spinner"></div>
      </div>
    );
  }

  // ===== If no car found =====
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

  // ===== Get all images =====
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
            {/* Main Image */}
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
            </div>

            {/* Thumbnail Images */}
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
            {/* Title & Price */}
            <div className="flex justify-between items-start gap-4">
              <h1 className="text-2xl md:text-3xl font-bold font-heading">
                {car.title || `${car.brand} ${car.model}`}
              </h1>
              <button
                onClick={() => setIsLiked(!isLiked)}
                className="p-2 rounded-full hover:bg-[rgb(var(--muted))] transition"
              >
                <Heart
                  className={`w-6 h-6 ${
                    isLiked
                      ? "fill-red-500 text-red-500"
                      : "text-[rgb(var(--muted-foreground))]"
                  }`}
                />
              </button>
            </div>

            <p className="text-3xl font-bold text-primary-500 mt-2">
              ${formatPrice(car.price)}
            </p>

            {/* Specs Grid */}
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

            {/* Location */}
            <div className="flex items-center gap-2 mt-4 text-[rgb(var(--muted-foreground))]">
              <MapPin className="w-4 h-4" />
              <span>{car.city || "Location not specified"}</span>
            </div>

            {/* Description */}
            <div className="mt-6">
              <h3 className="font-semibold mb-2">Description</h3>
              <p className="text-[rgb(var(--muted-foreground))] leading-relaxed">
                {car.description || "No description available"}
              </p>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap gap-3 mt-8">
              <button className="btn-primary flex-1">
                <Phone className="w-4 h-4 mr-2" />
                Contact Seller
              </button>
              <button className="btn-outline">
                <Share2 className="w-4 h-4" />
              </button>
            </div>

            {/* Seller Info */}
            <div className="mt-6 p-4 bg-[rgb(var(--muted))] rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-primary-500 to-accent-500 flex items-center justify-center text-white font-bold">
                  {car.seller_name?.charAt(0).toUpperCase() || "U"}
                </div>
                <div>
                  <p className="font-semibold">
                    {car.seller_name || "Unknown Seller"}
                  </p>
                  <p className="text-sm text-[rgb(var(--muted-foreground))]">
                    <Clock className="w-3 h-3 inline mr-1" />
                    Member since 2026
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
