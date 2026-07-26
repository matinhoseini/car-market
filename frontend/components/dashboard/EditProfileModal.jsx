// components/dashboard/EditProfileModal.jsx
"use client";

import { useEffect } from "react";
import { createPortal } from "react-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { X, User, Mail, Save, Loader2 } from "lucide-react";
import { authService } from "../../services/auth.service";
import toast from "react-hot-toast";

// ============================================
// 📋 Zod Validation Schema
// ============================================
const profileSchema = z.object({
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(50, "Username too long"),
  email: z.string().email("Invalid email address"),
});

export default function EditProfileModal({ isOpen, onClose, user, onUpdate }) {
  // ============================================
  // 📦 React Hook Form
  // ============================================
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch,
  } = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      username: "",
      email: "",
    },
  });

  // ============================================
  // 🔄 Populate form when user changes
  // ============================================
  useEffect(() => {
    if (user) {
      reset({
        username: user.username || "",
        email: user.email || "",
      });
    }
  }, [user, reset]);

  // ============================================
  // 🚀 Submit Handler
  // ============================================
  const onSubmit = async (data) => {
    try {
      // ===== Only send fields that have changed =====
      const changedData = {};
      if (data.username !== user.username) changedData.username = data.username;
      if (data.email !== user.email) changedData.email = data.email;

      if (Object.keys(changedData).length === 0) {
        toast.error("No changes to update");
        return;
      }

      const updatedUser = await authService.updateProfile(changedData);
      toast.success("Profile updated successfully!");

      // ===== ✅ Fix: Safe localStorage update =====
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

      onUpdate(updatedUser);
      onClose();
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error(error.response?.data?.error || "Failed to update profile");
    }
  };

  // ============================================
  // ⌨️ Close modal with Escape key
  // ============================================
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  // ============================================
  // 👀 Watch form values
  // ============================================
  const watchUsername = watch("username");
  const watchEmail = watch("email");

  if (!isOpen) return null;

  // ============================================
  // 🎯 Render with createPortal
  // ============================================
  return createPortal(
    <>
      {/* ===== Backdrop ===== */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999] animate-fade-in"
        onClick={onClose}
      />

      {/* ===== Modal ===== */}
      <div className="fixed inset-0 flex items-center justify-center z-[10000] p-4">
        <div
          className="bg-[rgb(var(--card))] rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto animate-scale-in"
          onClick={(e) => e.stopPropagation()}
        >
          {/* ===== Header ===== */}
          <div className="flex justify-between items-center p-6 border-b border-[rgb(var(--border))]">
            <h2 className="text-xl font-bold font-heading">✏️ Edit Profile</h2>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-[rgb(var(--muted))] transition"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* ===== Form ===== */}
          <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
            {/* Username */}
            <div>
              <label className="block text-sm font-medium mb-1">
                <User className="w-4 h-4 inline mr-1" />
                Username
              </label>
              <input
                type="text"
                {...register("username")}
                className={`input w-full ${errors.username ? "border-red-500 focus:ring-red-500" : ""}`}
                placeholder="Enter username"
              />
              {errors.username && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.username.message}
                </p>
              )}
              {watchUsername &&
                watchUsername.length > 0 &&
                !errors.username && (
                  <p className="text-green-500 text-xs mt-1">
                    ✓ Username is valid
                  </p>
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
                {...register("email")}
                className={`input w-full ${errors.email ? "border-red-500 focus:ring-red-500" : ""}`}
                placeholder="Enter email"
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.email.message}
                </p>
              )}
              {watchEmail && watchEmail.length > 0 && !errors.email && (
                <p className="text-green-500 text-xs mt-1">✓ Email is valid</p>
              )}
            </div>

            {/* ===== Actions ===== */}
            <div className="flex gap-3 pt-4 border-t border-[rgb(var(--border))]">
              <button
                type="button"
                onClick={onClose}
                className="btn-outline flex-1"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn-primary flex-1 flex items-center justify-center gap-2"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
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
          </form>
        </div>
      </div>
    </>,
    document.body,
  );
}
