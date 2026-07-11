// app/dashboard/favorites/page.jsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Heart,
  MapPin,
  Calendar,
  Fuel,
  Gauge,
  Users,
} from "lucide-react";
import { vehiclesService } from "@/services/vehicles.service";
import toast from "react-hot-toast";

export default function FavoritesPage() {
  const router = useRouter();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      router.push("/auth/login");
      return;
    }
    setUser({ id: 1 });
  }, [router]);

  useEffect(() => {
    if (user) {
      fetchFavorites();
    }
  }, [user]);

  const fetchFavorites = async () => {
    try {
      const data = await vehiclesService.getFavorites();
      setFavorites(Array.isArray(data) ? data : data.results || []);
    } catch (error) {
      console.error("Error fetching favorites:", error);
      toast.error("Failed to load favorites");
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFavorite = async (carId, e) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      await vehiclesService.removeFavorite(carId);
      setFavorites(favorites.filter((car) => car.id !== carId));
      toast.success("Removed from favorites");
    } catch (error) {
      console.error("Error removing favorite:", error);
      toast.error("Failed to remove from favorites");
    }
  };

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

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-80px)] flex justify-center items-center">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-80px)] bg-[rgb(var(--background))] py-8">
      <div className="container-custom">
        {/* ===== Header ===== */}
        <div className="flex items-center gap-4 mb-8">
          <Link
            href="/dashboard"
            className="p-2 rounded-lg hover:bg-[rgb(var(--muted))] transition"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold font-heading">❤️ My Favorites</h1>
            <p className="text-[rgb(var(--muted-foreground))] mt-1">
              {favorites.length} cars in your favorites list
            </p>
          </div>
        </div>

        {/* ===== Favorites Grid ===== */}
        {favorites.length === 0 ? (
          <div className="card p-12 text-center">
            <div className="text-6xl mb-4">💔</div>
            <h3 className="text-xl font-semibold mb-2">No favorites yet</h3>
            <p className="text-[rgb(var(--muted-foreground))] mb-4">
              Start exploring cars and add your favorites by clicking the heart
              icon.
            </p>
            <Link href="/">
              <button className="btn-primary">Browse Cars</button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {favorites.map((car) => (
              <div
                key={car.id}
                className="group relative bg-[rgb(var(--card))] rounded-xl border border-[rgb(var(--border))] overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
              >
                <Link href={`/vehicles/${car.id}`}>
                  <div className="relative w-full h-52 bg-gray-100 overflow-hidden">
                    {car.images?.[0]?.image ? (
                      <Image
                        src={getImageUrl(car.images[0].image)}
                        alt={car.title || "Car"}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-4xl text-gray-400">
                        🚗
                      </div>
                    )}

                    {/* ===== Remove Favorite Button ===== */}
                    <button
                      onClick={(e) => handleRemoveFavorite(car.id, e)}
                      className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-md hover:scale-110 transition-transform z-10"
                    >
                      <Heart className="w-5 h-5 fill-red-500 text-red-500" />
                    </button>
                  </div>

                  <div className="p-4 md:p-5 space-y-3">
                    <div className="flex justify-between items-start gap-2">
                      <h3 className="text-base md:text-lg font-semibold text-[rgb(var(--foreground))] hover:text-primary-500 transition line-clamp-1">
                        {car.title || `${car.brand} ${car.model}`}
                      </h3>
                      <p className="text-lg md:text-xl font-bold text-primary-500 whitespace-nowrap">
                        ${formatPrice(car.price)}
                      </p>
                    </div>

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

                    <div className="flex items-center gap-1 text-sm text-[rgb(var(--muted-foreground))]">
                      <MapPin className="w-4 h-4" />
                      <span>{car.city || "Unknown"}</span>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
