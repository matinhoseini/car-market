// app/dashboard/page.jsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  User,
  Mail,
  Calendar,
  Shield,
  LogOut,
  Settings,
  Car,
  Heart,
  ShoppingBag,
  PlusCircle,
  MoreVertical,
} from "lucide-react";
import { authService } from "../../services/auth.service";
import { vehiclesService } from "../../services/vehicles.service";
import toast from "react-hot-toast";
import VehicleActionsModal from "../../components/dashboard/VehicleActionsModal";
import EditVehicleModal from "../../components/dashboard/EditVehicleModal";

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [myCars, setMyCars] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [carsLoading, setCarsLoading] = useState(true);
  const [favoritesLoading, setFavoritesLoading] = useState(true);

  // ===== Modal states =====
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [isActionsModalOpen, setIsActionsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // ===== Check auth =====
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      router.push("/auth/login");
      return;
    }

    const fetchProfile = async () => {
      try {
        const data = await authService.getProfile();
        setUser(data);
      } catch (error) {
        console.error("Error fetching profile:", error);
        toast.error("Failed to load profile");
        router.push("/auth/login");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [router]);

  // ===== Fetch user's cars =====
  // app/dashboard/page.jsx
  const fetchMyCars = async () => {
    setCarsLoading(true);
    try {
      console.log("🔍 Fetching my cars...");
      const data = await vehiclesService.getMyCars();
      console.log("📦 My Cars Response:", data);
      setMyCars(data.results || data || []);
    } catch (error) {
      console.error("❌ Error fetching my cars:", error);
      console.error("❌ Error response:", error.response?.data);
    } finally {
      setCarsLoading(false);
    }
  };

  // ===== Fetch favorites =====
  const fetchFavorites = async () => {
    setFavoritesLoading(true);
    try {
      const data = await vehiclesService.getFavorites();
      setFavorites(data.results || data || []);
    } catch (error) {
      console.error("Error fetching favorites:", error);
    } finally {
      setFavoritesLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchMyCars();
      fetchFavorites();
    }
  }, [user]);

  // ===== Handlers =====
  const handleLogout = () => {
    authService.logout();
    toast.success("Logged out successfully");
    router.push("/auth/login");
  };

  const openActions = (vehicle) => {
    setSelectedVehicle(vehicle);
    setIsActionsModalOpen(true);
  };

  const handleEdit = (vehicle) => {
    setSelectedVehicle(vehicle);
    setIsEditModalOpen(true);
  };

  const handleDelete = async (vehicleId) => {
    setIsDeleting(true);
    try {
      await vehiclesService.deleteCar(vehicleId);
      await fetchMyCars();
      toast.success("Vehicle deleted successfully");
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete vehicle");
    } finally {
      setIsDeleting(false);
      setIsActionsModalOpen(false);
      setSelectedVehicle(null);
    }
  };

  // ===== Helpers =====
  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-US").format(price);
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
      <div className="flex justify-center items-center min-h-[calc(100vh-80px)]">
        <div className="spinner"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-[calc(100vh-80px)] bg-[rgb(var(--background))] py-8">
      <div className="container-custom">
        {/* ===== Header ===== */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold font-heading">Dashboard</h1>
            <p className="text-[rgb(var(--muted-foreground))] mt-1">
              Welcome back, {user.username}! 👋
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="btn-danger btn-sm flex items-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>

        {/* ===== Stats ===== */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
          {/* My Vehicles */}
          <Link href="/dashboard/my-vehicles" className="block">
            <div className="card card-hover p-6 cursor-pointer transition-all hover:border-primary-500">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-500/10 rounded-xl">
                  <Car className="w-6 h-6 text-blue-500" />
                </div>
                <div>
                  <p className="text-sm text-[rgb(var(--muted-foreground))]">
                    My Vehicles
                  </p>
                  <p className="text-2xl font-bold">{myCars.length}</p>
                </div>
              </div>
            </div>
          </Link>

          {/* Favorites */}
          <Link href="/dashboard/favorites" className="block">
            <div className="card card-hover p-6 cursor-pointer transition-all hover:border-red-500">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-red-500/10 rounded-xl">
                  <Heart className="w-6 h-6 text-red-500" />
                </div>
                <div>
                  <p className="text-sm text-[rgb(var(--muted-foreground))]">
                    Favorites
                  </p>
                  <p className="text-2xl font-bold">{favorites.length}</p>
                </div>
              </div>
            </div>
          </Link>

          {/* Orders */}
          <Link href="/dashboard/orders" className="block">
            <div className="card card-hover p-6 cursor-pointer transition-all hover:border-green-500">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-green-500/10 rounded-xl">
                  <ShoppingBag className="w-6 h-6 text-green-500" />
                </div>
                <div>
                  <p className="text-sm text-[rgb(var(--muted-foreground))]">
                    Orders
                  </p>
                  <p className="text-2xl font-bold">0</p>
                </div>
              </div>
            </div>
          </Link>
        </div>

        {/* ===== My Vehicles Section ===== */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold font-heading">🚗 My Vehicles</h2>
            <Link href="/dashboard/add-vehicle">
              <button className="btn-primary btn-sm flex items-center gap-1">
                <PlusCircle className="w-4 h-4" />
                Add Vehicle
              </button>
            </Link>
          </div>

          {carsLoading ? (
            <div className="flex justify-center items-center py-12">
              <div className="spinner"></div>
            </div>
          ) : myCars.length === 0 ? (
            <div className="card p-8 text-center">
              <div className="text-5xl mb-4">🚗</div>
              <h3 className="text-lg font-semibold mb-2">No vehicles yet</h3>
              <p className="text-[rgb(var(--muted-foreground))] mb-4">
                You haven't added any vehicles to your account.
              </p>
              <Link href="/dashboard/add-vehicle">
                <button className="btn-primary">
                  <PlusCircle className="w-4 h-4 mr-2" />
                  Add Your First Vehicle
                </button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {myCars.map((car) => (
                <div key={car.id} className="card card-hover overflow-hidden">
                  <div className="relative w-full h-40 bg-gray-100">
                    <img
                      src={getImageUrl(car.images?.[0]?.image)}
                      alt={car.title}
                      className="w-full h-full object-cover"
                    />
                    <button
                      onClick={() => openActions(car)}
                      className="absolute top-2 right-2 p-1.5 bg-white/90 backdrop-blur-sm rounded-full shadow-md hover:scale-105 transition"
                    >
                      <MoreVertical className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-sm line-clamp-1">
                      {car.title || `${car.brand} ${car.model}`}
                    </h3>
                    <p className="text-lg font-bold text-primary-500">
                      ${formatPrice(car.price)}
                    </p>
                    <p className="text-xs text-[rgb(var(--muted-foreground))]">
                      {car.year} • {car.fuel_type}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ===== Profile ===== */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="card p-6 lg:col-span-1">
            <div className="text-center">
              <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-r from-primary-500 to-accent-500 flex items-center justify-center text-white text-3xl font-bold">
                {user.username.charAt(0).toUpperCase()}
              </div>
              <h2 className="text-xl font-bold mt-4">{user.username}</h2>
              <p className="text-[rgb(var(--muted-foreground))] text-sm">
                {user.email}
              </p>
              <div className="mt-4 flex justify-center gap-2">
                <span className="badge badge-primary">Member</span>
                <span className="badge badge-success">Verified</span>
              </div>
            </div>
          </div>

          <div className="card p-6 lg:col-span-2">
            <h3 className="text-lg font-semibold mb-4">Profile Details</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-[rgb(var(--muted))]">
                <User className="w-5 h-5 text-primary-500" />
                <div>
                  <p className="text-sm text-[rgb(var(--muted-foreground))]">
                    Username
                  </p>
                  <p className="font-medium">{user.username}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-[rgb(var(--muted))]">
                <Mail className="w-5 h-5 text-primary-500" />
                <div>
                  <p className="text-sm text-[rgb(var(--muted-foreground))]">
                    Email
                  </p>
                  <p className="font-medium">{user.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-[rgb(var(--muted))]">
                <Calendar className="w-5 h-5 text-primary-500" />
                <div>
                  <p className="text-sm text-[rgb(var(--muted-foreground))]">
                    Joined
                  </p>
                  <p className="font-medium">
                    {new Date().toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ===== Modals ===== */}
        <VehicleActionsModal
          isOpen={isActionsModalOpen}
          onClose={() => {
            setIsActionsModalOpen(false);
            setSelectedVehicle(null);
          }}
          vehicle={selectedVehicle}
          onEdit={handleEdit}
          onDelete={handleDelete}
          isDeleting={isDeleting}
        />

        <EditVehicleModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedVehicle(null);
          }}
          vehicle={selectedVehicle}
          onUpdated={fetchMyCars}
        />
      </div>
    </div>
  );
}
