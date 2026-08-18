"use client";

import { useState, useEffect, useMemo, useCallback, memo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  User,
  Mail,
  Calendar,
  LogOut,
  Settings,
  Car,
  Heart,
  ShoppingBag,
  PlusCircle,
  RefreshCw,
  Edit,
  MessageCircle,
  Bell,
} from "lucide-react";
import { authService } from "../../services/auth.service";
import { vehiclesService } from "../../services/vehicles.service";
import { chatService } from "../../services/chat.service";
import toast from "react-hot-toast";
import VehicleActionsModal from "../../components/dashboard/VehicleActionsModal";
import EditVehicleModal from "../../components/dashboard/EditVehicleModal";
import EditProfileModal from "../../components/dashboard/EditProfileModal";
import VehicleCard from "../../components/vehicles/VehicleCard";

// ===== Import helpers =====
import { getStorage, removeStorage } from "../../helpers/storage";
import { STORAGE_KEYS } from "../../helpers/constants";

function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [myCars, setMyCars] = useState([]);
  const [carsLoading, setCarsLoading] = useState(true);
  const [favorites, setFavorites] = useState([]);
  const [favoritesLoading, setFavoritesLoading] = useState(true);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);

  // ===== Chat states =====
  const [conversations, setConversations] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [conversationsLoading, setConversationsLoading] = useState(true);

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
      messages: unreadCount,
    }),
    [myCars.length, favorites.length, unreadCount],
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

  // ===== Fetch conversations =====
  const fetchConversations = useCallback(async () => {
    setConversationsLoading(true);
    try {
      const data = await chatService.getConversations();
      setConversations(data || []);

      const totalUnread = (data || []).reduce(
        (sum, conv) => sum + (conv.unread_count || 0),
        0,
      );
      setUnreadCount(totalUnread);
    } catch (error) {
      console.error("Error fetching conversations:", error);
      setConversations([]);
    } finally {
      setConversationsLoading(false);
    }
  }, []);

  // ===== Initial fetch =====
  useEffect(() => {
    if (user) {
      fetchMyCars();
      fetchFavorites();
      fetchConversations();
    }
  }, [user, fetchMyCars, fetchFavorites, fetchConversations]);

  // ===== Handlers =====
  const handleLogout = useCallback(() => {
    removeStorage(STORAGE_KEYS.ACCESS_TOKEN);
    removeStorage(STORAGE_KEYS.REFRESH_TOKEN);
    removeStorage(STORAGE_KEYS.USER);
    toast.success("Logged out successfully");
    router.push("/auth/login");
  }, [router]);

  const handleUpdateUser = useCallback((updatedUser) => {
    setUser(updatedUser);
    toast.success("Profile updated!");
  }, []);

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

  // ===== Manual refresh =====
  const refreshData = useCallback(() => {
    fetchMyCars();
    fetchFavorites();
    fetchConversations();
    toast.success("Refreshed!");
  }, [fetchMyCars, fetchFavorites, fetchConversations]);

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
        href: "/dashboard/messages",
        icon: MessageCircle,
        iconColor: "text-green-500",
        bgColor: "bg-green-500/10",
        label: "Messages",
        value: stats.messages,
        borderColor: "hover:border-green-500",
        badge: unreadCount > 0 ? unreadCount : null,
      },
    ],
    [stats, unreadCount],
  );

  // ===== Memoized profile details =====
  const profileDetails = useMemo(() => {
    if (!user) return [];
    return [
      { icon: User, label: "Username", value: user.username },
      { icon: Mail, label: "Email", value: user.email },
      {
        icon: Calendar,
        label: "Joined",
        value: new Date(user.date_joined || Date.now()).toLocaleDateString(),
      },
    ];
  }, [user]);

  // ===== Recent conversations preview =====
  const recentConversations = useMemo(() => {
    return conversations.slice(0, 3);
  }, [conversations]);

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
        <div className="flex flex-wrap justify-between items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold font-heading">Dashboard</h1>
            <p className="text-[rgb(var(--muted-foreground))] mt-1">
              Welcome back, {user.username}! 👋
            </p>
          </div>
          <div className="flex items-center gap-2">
            {/* ===== Messages Bell ===== */}
            <Link href="/dashboard/messages" className="relative">
              <button
                className="btn-outline btn-sm flex items-center gap-1 relative"
                aria-label="Messages"
              >
                <Bell className="w-4 h-4" />
                <span className="hidden sm:inline">Messages</span>
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                    {unreadCount > 99 ? "99+" : unreadCount}
                  </span>
                )}
              </button>
            </Link>

            <button
              onClick={refreshData}
              className="btn-outline btn-sm flex items-center gap-1"
              aria-label="Refresh data"
            >
              <RefreshCw className="w-4 h-4" />
              <span className="hidden sm:inline">Refresh</span>
            </button>
            <button
              onClick={handleLogout}
              className="btn-danger btn-sm flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>

        {/* ===== Stats ===== */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
          {statsCards.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Link key={index} href={stat.href} className="block relative">
                <div
                  className={`card card-hover p-6 cursor-pointer transition-all ${stat.borderColor}`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`p-3 ${stat.bgColor} rounded-xl relative`}>
                      <Icon className={`w-6 h-6 ${stat.iconColor}`} />
                      {stat.badge && (
                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                          {stat.badge}
                        </span>
                      )}
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

        {/* ===== Recent Messages Preview ===== */}
        {recentConversations.length > 0 && (
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold font-heading flex items-center gap-2">
                <MessageCircle className="w-5 h-5 text-primary-500" />
                Recent Messages
                {unreadCount > 0 && (
                  <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                    {unreadCount} new
                  </span>
                )}
              </h2>
              <Link
                href="/dashboard/messages"
                className="text-sm text-primary-500 hover:underline"
              >
                View All →
              </Link>
            </div>

            <div className="grid grid-cols-1 gap-3">
              {recentConversations.map((conv) => (
                <Link
                  key={conv.id}
                  href={`/dashboard/messages/${conv.id}`}
                  className="block"
                >
                  <div className="card p-4 hover:shadow-md transition-shadow cursor-pointer">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-primary-500 to-accent-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                          {(conv.seller_username || conv.buyer_username || "U")
                            .charAt(0)
                            .toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold truncate">
                              {conv.seller_username ||
                                conv.buyer_username ||
                                "Unknown"}
                            </span>
                            {conv.unread_count > 0 && (
                              <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full flex-shrink-0">
                                {conv.unread_count}
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-[rgb(var(--muted-foreground))] truncate">
                            {conv.last_message || "No messages yet"}
                          </p>
                        </div>
                      </div>
                      <div className="text-xs text-[rgb(var(--muted-foreground))] flex-shrink-0 mr-2">
                        {conv.car_brand && conv.car_model && (
                          <span className="block text-right">
                            🚗 {conv.car_brand} {conv.car_model}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="card p-4 animate-pulse">
                  <div className="w-full h-48 bg-[rgb(var(--muted))] rounded-lg"></div>
                  <div className="h-4 bg-[rgb(var(--muted))] rounded mt-3 w-3/4"></div>
                  <div className="h-4 bg-[rgb(var(--muted))] rounded mt-2 w-1/2"></div>
                </div>
              ))}
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
                <VehicleCard
                  key={car.id}
                  car={car}
                  showActions={true}
                  onActionClick={openActions}
                />
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
              <button
                onClick={() => setIsEditProfileOpen(true)}
                className="btn-outline btn-sm mt-4 flex items-center gap-1 mx-auto"
              >
                <Edit className="w-4 h-4" />
                Edit Profile
              </button>
            </div>
          </div>

          <div className="card p-6 lg:col-span-2">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Profile Details</h3>
              <button
                onClick={() => setIsEditProfileOpen(true)}
                className="btn-outline btn-sm flex items-center gap-1"
              >
                <Edit className="w-4 h-4" />
                Edit
              </button>
            </div>
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
          <Link href="/dashboard/messages">
            <button className="btn-outline w-full relative">
              <MessageCircle className="w-4 h-4 mr-2" />
              Messages
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                  {unreadCount}
                </span>
              )}
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

        <EditProfileModal
          isOpen={isEditProfileOpen}
          onClose={() => setIsEditProfileOpen(false)}
          user={user}
          onUpdate={handleUpdateUser}
        />
      </div>
    </div>
  );
}

export default memo(DashboardPage);
