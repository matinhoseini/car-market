// app/dashboard/favorites/page.jsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { vehiclesService } from "@/services/vehicles.service";
import VehicleCard from "@/components/vehicles/VehicleCard";
import toast from "react-hot-toast";

export default function FavoritesPage() {
  const router = useRouter();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  // ===== Check authentication =====
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      router.push("/auth/login");
      return;
    }
  }, [router]);

  // ===== Fetch favorites =====
  useEffect(() => {
    fetchFavorites();
  }, []);

  const fetchFavorites = async () => {
    setLoading(true);
    try {
      const data = await vehiclesService.getFavorites();
      console.log("📦 Processed favorites:", data);

      // Ensure data is an array
      if (Array.isArray(data)) {
        setFavorites(data);
      } else if (data && typeof data === "object") {
        // If data is an object with results
        if (data.results && Array.isArray(data.results)) {
          setFavorites(data.results);
        } else {
          setFavorites([]);
        }
      } else {
        setFavorites([]);
      }
    } catch (error) {
      console.error("Error fetching favorites:", error);
      toast.error(error.response?.data?.detail || "Failed to load favorites");
      setFavorites([]);
    } finally {
      setLoading(false);
    }
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
              {favorites.length} car{favorites.length !== 1 ? "s" : ""} in your
              favorites list
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
            <Link href="/vehicles">
              <button className="btn-primary">Browse Cars</button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {favorites.map((car) => (
              <VehicleCard key={car.id || car.car_id} car={car} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
