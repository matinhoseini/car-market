// app/dashboard/page.jsx
"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
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

// ===== Import helpers =====
import { formatPrice } from "../../helpers/format";
import { getImageUrl } from "../../helpers/image";
import { getStorage, removeStorage } from "../../helpers/storage";
import { STORAGE_KEYS } from "../../helpers/constants";

// ===== Initial stats =====
const INITIAL_STATS = {
  vehicles: 0,
  favorites: 0,
  orders: 0,
};

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [myCars, setMyCars] = useState([]);
  const [carsLoading, setCarsLoading] = useState(true);
  const [favorites, setFavorites] = useState([]);
  const [favoritesLoading, setFavoritesLoading] = useState(true);

  // ===== Modal states =====
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [isActionsModalOpen, setIsActionsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // ===== Memoized stats =====
  const stats = useMemo(
    () => ({
      vehicles: myCars.length,
      favorites: favorites.length,
      orders: 0,
    }),
    [myCars.length, favorites.length],
  );

  // ===== Check auth and get user =====
  useEffect(() => {
    const token = getStorage(STORAGE_KEYS.ACCESS_TOKEN);
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
  const fetchMyCars = useCallback(async () => {
    setCarsLoading(true);
    try {
      const data = await vehiclesService.getMyCars();
      setMyCars(data.results || data || []);
    } catch (error) {
      console.error("Error fetching my cars:", error);
      toast.error("Failed to load your cars");
      setMyCars([]);
    } finally {
      setCarsLoading(false);
    }
  }, []);

  // ===== Fetch favorites =====
  const fetchFavorites = useCallback(async () => {
    setFavoritesLoading(true);
    try {
      const data = await vehiclesService.getFavorites();
      setFavorites(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching favorites:", error);
      setFavorites([]);
    } finally {
      setFavoritesLoading(false);
    }
  }, []);

  // ===== Initial fetch =====
  useEffect(() => {
    if (user) {
      fetchMyCars();
      fetchFavorites();
    }
  }, [user, fetchMyCars, fetchFavorites]);

  // ===== Handlers =====
  const handleLogout = useCallback(() => {
    removeStorage(STORAGE_KEYS.ACCESS_TOKEN);
    removeStorage(STORAGE_KEYS.REFRESH_TOKEN);
    removeStorage(STORAGE_KEYS.USER);
    toast.success("Logged out successfully");
    router.push("/auth/login");
  }, [router]);

  const openActions = useCallback((vehicle) => {
    setSelectedVehicle(vehicle);
    setIsActionsModalOpen(true);
  }, []);

  const handleEdit = useCallback((vehicle) => {
    setSelectedVehicle(vehicle);
    setIsEditModalOpen(true);
  }, []);

  const handleDelete = useCallback(
    async (vehicleId) => {
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
    },
    [fetchMyCars],
  );

  const closeActionsModal = useCallback(() => {
    setIsActionsModalOpen(false);
    setSelectedVehicle(null);
  }, []);

  const closeEditModal = useCallback(() => {
    setIsEditModalOpen(false);
    setSelectedVehicle(null);
  }, []);

  // ===== Memoized stats cards =====
  const statsCards = useMemo(
    () => [
      {
        href: "/dashboard/my-vehicles",
        icon: Car,
        iconColor: "text-blue-500",
        bgColor: "bg-blue-500/10",
        label: "My Vehicles",
        value: stats.vehicles,
        borderColor: "hover:border-primary-500",
      },
      {
        href: "/dashboard/favorites",
        icon: Heart,
        iconColor: "text-red-500",
        bgColor: "bg-red-500/10",
        label: "Favorites",
        value: stats.favorites,
        borderColor: "hover:border-red-500",
      },
      {
        href: "/dashboard/orders",
        icon: ShoppingBag,
        iconColor: "text-green-500",
        bgColor: "bg-green-500/10",
        label: "Orders",
        value: stats.orders,
        borderColor: "hover:border-green-500",
      },
    ],
    [stats],
  );

  // ===== Memoized vehicle card =====
  const vehicleCards = useMemo(() => {
    if (myCars.length === 0) return null;

    return myCars.map((car) => ({
      id: car.id,
      title: car.title || `${car.brand} ${car.model}`,
      price: formatPrice(car.price),
      year: car.year,
      fuel_type: car.fuel_type,
      image: getImageUrl(car.images?.[0]?.image),
    }));
  }, [myCars]);

  // ===== Memoized profile details =====
  const profileDetails = useMemo(() => {
    if (!user) return [];
    return [
      { icon: User, label: "Username", value: user.username },
      { icon: Mail, label: "Email", value: user.email },
      {
        icon: Calendar,
        label: "Joined",
        value: new Date().toLocaleDateString(),
      },
    ];
  }, [user]);

  // ===== Loading state =====
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
          {statsCards.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Link key={index} href={stat.href} className="block">
                <div
                  className={`card card-hover p-6 cursor-pointer transition-all ${stat.borderColor}`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`p-3 ${stat.bgColor} rounded-xl`}>
                      <Icon className={`w-6 h-6 ${stat.iconColor}`} />
                    </div>
                    <div>
                      <p className="text-sm text-[rgb(var(--muted-foreground))]">
                        {stat.label}
                      </p>
                      <p className="text-2xl font-bold">{stat.value}</p>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* ===== My Vehicles Section ===== */}
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
              {vehicleCards?.map((car) => (
                <div key={car.id} className="card card-hover overflow-hidden">
                  <div className="relative w-full h-40 bg-gray-100">
                    {car.image ? (
                      <img
                        src={car.image}
                        alt={car.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-4xl text-gray-400">
                        🚗
                      </div>
                    )}

                    {/* ✅ دکمه سه نقطه اصلاح‌شده */}
                    <button
                      onClick={() =>
                        openActions(myCars.find((c) => c.id === car.id))
                      }
                      className="absolute top-2 right-2 p-1.5 bg-[rgb(var(--card))] rounded-full shadow-md hover:scale-105 transition border border-[rgb(var(--border))]"
                      aria-label="Vehicle actions"
                    >
                      <MoreVertical className="w-5 h-5 text-[rgb(var(--foreground))]" />
                    </button>
                  </div>

                  <div className="p-4">
                    <h3 className="font-semibold text-sm line-clamp-1">
                      {car.title}
                    </h3>
                    <p className="text-lg font-bold text-primary-500">
                      {car.price}
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
              {profileDetails.map((detail, index) => {
                const Icon = detail.icon;
                return (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-3 rounded-lg bg-[rgb(var(--muted))]"
                  >
                    <Icon className="w-5 h-5 text-primary-500" />
                    <div>
                      <p className="text-sm text-[rgb(var(--muted-foreground))]">
                        {detail.label}
                      </p>
                      <p className="font-medium">{detail.value}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* ===== Quick Actions ===== */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Link href="/dashboard/add-vehicle">
            <button className="btn-primary w-full">
              <PlusCircle className="w-4 h-4 mr-2" />
              Add Vehicle
            </button>
          </Link>
          <Link href="/dashboard/profile">
            <button className="btn-outline w-full">
              <Settings className="w-4 h-4 mr-2" />
              Edit Profile
            </button>
          </Link>
          <Link href="/dashboard/favorites">
            <button className="btn-outline w-full">
              <Heart className="w-4 h-4 mr-2" />
              View Favorites
            </button>
          </Link>
        </div>

        {/* ===== Modals ===== */}
        <VehicleActionsModal
          isOpen={isActionsModalOpen}
          onClose={closeActionsModal}
          vehicle={selectedVehicle}
          onEdit={handleEdit}
          onDelete={handleDelete}
          isDeleting={isDeleting}
        />

        <EditVehicleModal
          isOpen={isEditModalOpen}
          onClose={closeEditModal}
          vehicle={selectedVehicle}
          onUpdated={fetchMyCars}
        />
      </div>
    </div>
  );
}
