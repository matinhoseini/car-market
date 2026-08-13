// app/dashboard/profile/page.jsx
"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  User,
  Mail,
  Calendar,
  ArrowLeft,
  Edit,
  Save,
  X,
  Loader2,
  CheckCircle,
} from "lucide-react";
import { authService } from "../../../services/auth.service";
import toast from "react-hot-toast";
import { getStorage } from "../../../helpers/storage";
import { STORAGE_KEYS } from "../../../helpers/constants";

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
  });
  const [errors, setErrors] = useState({});

  const goBack = () => {
    router.back();
  };

  // ============================================
  // 🔄 Fetch user profile
  // ============================================
  useEffect(() => {
    const token = getStorage(STORAGE_KEYS.ACCESS_TOKEN);
    if (!token) {
      router.push("/auth/login");
      return;
    }

    const fetchProfile = async () => {
      try {
        const data = await authService.getProfile();
        console.log("📥 Profile data:", data);
        setUser(data);
        setFormData({
          username: data.username || "",
          email: data.email || "",
        });
      } catch (error) {
        console.error("❌ Error fetching profile:", error);
        toast.error("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [router]);

  // ============================================
  // ✏️ Handle form input change
  // ============================================
  const handleChange = useCallback(
    (e) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
      if (errors[name]) {
        setErrors((prev) => ({ ...prev, [name]: "" }));
      }
    },
    [errors],
  );

  // ============================================
  // ✅ Validate form
  // ============================================
  const validateForm = useCallback(() => {
    const newErrors = {};
    if (formData.username.length < 3) {
      newErrors.username = "Username must be at least 3 characters";
    }
    if (formData.username.length > 50) {
      newErrors.username = "Username too long (max 50 characters)";
    }
    if (!formData.email.includes("@")) {
      newErrors.email = "Please enter a valid email address";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  // ============================================
  // 📅 Format date safely
  // ============================================
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "N/A";
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return "N/A";
    }
  };

  // ============================================
  // 💾 Save profile
  // ============================================
  const handleSave = useCallback(async () => {
    if (!validateForm()) return;

    setIsSaving(true);
    try {
      const changedData = {};
      if (formData.username !== user.username) {
        changedData.username = formData.username;
      }
      if (formData.email !== user.email) {
        changedData.email = formData.email;
      }

      if (Object.keys(changedData).length === 0) {
        toast.error("No changes to update");
        setIsSaving(false);
        return;
      }

      console.log("📤 Updating profile with:", changedData);
      const updatedUser = await authService.updateProfile(changedData);
      console.log("✅ Profile updated:", updatedUser);

      setUser(updatedUser);

      // ===== Update localStorage safely =====
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);
          localStorage.setItem(
            "user",
            JSON.stringify({ ...parsedUser, ...updatedUser }),
          );
        } catch {
          localStorage.setItem("user", JSON.stringify(updatedUser));
        }
      } else {
        localStorage.setItem("user", JSON.stringify(updatedUser));
      }

      // ===== Notify header to update =====
      window.dispatchEvent(new Event("storage"));

      toast.success("Profile updated successfully!");
      setIsEditing(false);
    } catch (error) {
      console.error("❌ Error updating profile:", error);
      toast.error(error.response?.data?.error || "Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  }, [formData, user, validateForm]);

  // ============================================
  // ❌ Cancel editing
  // ============================================
  const handleCancel = useCallback(() => {
    setFormData({
      username: user?.username || "",
      email: user?.email || "",
    });
    setErrors({});
    setIsEditing(false);
  }, [user]);

  // ============================================
  // ⏳ Loading state
  // ============================================
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-80px)]">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-primary-500 mx-auto" />
          <p className="mt-4 text-[rgb(var(--muted-foreground))]">
            Loading profile...
          </p>
        </div>
      </div>
    );
  }

  // ============================================
  // 🚫 No user
  // ============================================
  if (!user) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-80px)]">
        <div className="text-center">
          <div className="text-6xl mb-4">👤</div>
          <h2 className="text-2xl font-bold">User not found</h2>
          <Link href="/dashboard" className="btn-primary mt-4 inline-block">
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  // ============================================
  // 🎨 Render
  // ============================================
  return (
    <div className="min-h-[calc(100vh-80px)] bg-[rgb(var(--background))] py-8">
      <div className="container-custom max-w-3xl">
        {/* ===== Header ===== */}
        <div className="flex items-center gap-4 mb-8" onClick={() => goBack()}>
          <p className="p-2 rounded-lg hover:bg-[rgb(var(--muted))] transition">
            <ArrowLeft className="w-5 h-5" />
          </p>
          <div>
            <h1 className="text-3xl font-bold font-heading">Profile</h1>
            <p className="text-[rgb(var(--muted-foreground))] mt-1">
              Manage your account information
            </p>
          </div>
        </div>

        {/* ===== Profile Card ===== */}
        <div className="card p-6 md:p-8">
          {/* ===== Avatar ===== */}
          <div className="flex items-center gap-6 mb-8">
            <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-gradient-to-r from-primary-500 to-accent-500 flex items-center justify-center text-white text-3xl md:text-4xl font-bold flex-shrink-0">
              {user.username?.charAt(0).toUpperCase() || "U"}
            </div>
            <div>
              <h2 className="text-xl font-bold">{user.username || "User"}</h2>
              <p className="text-[rgb(var(--muted-foreground))]">
                {user.email || "No email"}
              </p>
              <div className="flex items-center gap-2 mt-2">
                <span className="badge badge-primary">Member</span>
                <span className="badge badge-success flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" />
                  Verified
                </span>
              </div>
            </div>
          </div>

          {/* ===== Edit/View Mode ===== */}
          {isEditing ? (
            // ===== Edit Mode =====
            <div className="space-y-4">
              {/* Username */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  <User className="w-4 h-4 inline mr-1" />
                  Username
                </label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className={`input w-full ${
                    errors.username ? "border-red-500 focus:ring-red-500" : ""
                  }`}
                  placeholder="Enter username"
                />
                {errors.username && (
                  <p className="text-red-500 text-xs mt-1">{errors.username}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  <Mail className="w-4 h-4 inline mr-1" />
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`input w-full ${
                    errors.email ? "border-red-500 focus:ring-red-500" : ""
                  }`}
                  placeholder="Enter email"
                />
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                )}
              </div>

              {/* Joined Date (Read-only) */}
              <div className="opacity-60">
                <label className="block text-sm font-medium mb-1">
                  <Calendar className="w-4 h-4 inline mr-1" />
                  Joined
                </label>
                <p className="input w-full bg-[rgb(var(--muted))] cursor-not-allowed">
                  {formatDate(user.date_joined)}
                </p>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4 border-t border-[rgb(var(--border))]">
                <button
                  onClick={handleCancel}
                  className="btn-outline flex-1"
                  disabled={isSaving}
                >
                  <X className="w-4 h-4 mr-1" />
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="btn-primary flex-1 flex items-center justify-center gap-2"
                  disabled={isSaving}
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </div>
          ) : (
            // ===== View Mode =====
            <div className="space-y-4">
              {/* Username */}
              <div className="flex items-center justify-between p-3 rounded-lg bg-[rgb(var(--muted))]">
                <div className="flex items-center gap-3">
                  <User className="w-5 h-5 text-primary-500" />
                  <div>
                    <p className="text-sm text-[rgb(var(--muted-foreground))]">
                      Username
                    </p>
                    <p className="font-medium">{user.username || "N/A"}</p>
                  </div>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-center justify-between p-3 rounded-lg bg-[rgb(var(--muted))]">
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-primary-500" />
                  <div>
                    <p className="text-sm text-[rgb(var(--muted-foreground))]">
                      Email
                    </p>
                    <p className="font-medium">{user.email || "N/A"}</p>
                  </div>
                </div>
              </div>

              {/* Joined Date */}
              <div className="flex items-center justify-between p-3 rounded-lg bg-[rgb(var(--muted))]">
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-primary-500" />
                  <div>
                    <p className="text-sm text-[rgb(var(--muted-foreground))]">
                      Joined
                    </p>
                    <p className="font-medium">
                      {formatDate(user.date_joined)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Edit Button */}
              <button
                onClick={() => setIsEditing(true)}
                className="btn-primary w-full mt-4 flex items-center justify-center gap-2"
              >
                <Edit className="w-4 h-4" />
                Edit Profile
              </button>
            </div>
          )}
        </div>

        {/* ===== Back to Dashboard ===== */}
        <div className="mt-6 text-center" onClick={() => goBack()}>
          <p className="text-[rgb(var(--muted-foreground))] hover:text-[rgb(var(--foreground))] transition text-sm">
            ← Back to Dashboard
          </p>
        </div>
      </div>
    </div>
  );
}
