// app/dashboard/page.jsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
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
} from "lucide-react";
import { authService } from "../../services/auth.service";
import toast from "react-hot-toast";

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    vehicles: 12,
    favorites: 5,
    orders: 3,
  });

  useEffect(() => {
    // چک کن توکن هست؟
    const token = localStorage.getItem("access_token");
    if (!token) {
      router.push("/auth/login");
      return;
    }

    // دریافت اطلاعات کاربر
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

  const handleLogout = () => {
    authService.logout();
    toast.success("Logged out successfully");
    router.push("/auth/login");
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

        {/* ===== Stats Cards ===== */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
          <div className="card card-hover p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-500/10 rounded-xl">
                <Car className="w-6 h-6 text-blue-500" />
              </div>
              <div>
                <p className="text-sm text-[rgb(var(--muted-foreground))]">
                  My Vehicles
                </p>
                <p className="text-2xl font-bold">{stats.vehicles}</p>
              </div>
            </div>
          </div>

          <div className="card card-hover p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-red-500/10 rounded-xl">
                <Heart className="w-6 h-6 text-red-500" />
              </div>
              <div>
                <p className="text-sm text-[rgb(var(--muted-foreground))]">
                  Favorites
                </p>
                <p className="text-2xl font-bold">{stats.favorites}</p>
              </div>
            </div>
          </div>

          <div className="card card-hover p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-500/10 rounded-xl">
                <ShoppingBag className="w-6 h-6 text-green-500" />
              </div>
              <div>
                <p className="text-sm text-[rgb(var(--muted-foreground))]">
                  Orders
                </p>
                <p className="text-2xl font-bold">{stats.orders}</p>
              </div>
            </div>
          </div>
        </div>

        {/* ===== Profile Card ===== */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Info */}
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

          {/* User Details */}
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
              <div className="flex items-center gap-3 p-3 rounded-lg bg-[rgb(var(--muted))]">
                <Shield className="w-5 h-5 text-primary-500" />
                <div>
                  <p className="text-sm text-[rgb(var(--muted-foreground))]">
                    Role
                  </p>
                  <p className="font-medium capitalize">User</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ===== Quick Actions ===== */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <button className="btn-primary w-full">
            <Car className="w-4 h-4 mr-2" />
            Add Vehicle
          </button>
          <button className="btn-outline w-full">
            <Settings className="w-4 h-4 mr-2" />
            Edit Profile
          </button>
          <button className="btn-outline w-full">
            <Heart className="w-4 h-4 mr-2" />
            View Favorites
          </button>
        </div>
      </div>
    </div>
  );
}
