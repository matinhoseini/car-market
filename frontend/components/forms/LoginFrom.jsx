// components/forms/LoginForm.jsx
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Eye, EyeOff, User, Lock } from "lucide-react";
import { authService } from "../../services/auth.service";

export default function LoginForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  // ===== Form Submission Handler =====
  const onSubmit = async (data) => {
    setIsLoading(true);

    try {
      const response = await authService.login(data);

      // Store tokens in localStorage
      localStorage.setItem("access_token", response.access);
      localStorage.setItem("refresh_token", response.refresh);
      localStorage.setItem("user", JSON.stringify(response.user));

      // Dispatch storage event for header update
      window.dispatchEvent(new Event("storage"));

      toast.success("Welcome back! 🎉", {
        icon: "👋",
        duration: 3000,
      });

      router.push("/dashboard");
    } catch (error) {
      console.error("❌ Login error:", error);

      let errorMessage = "Invalid username or password";

      if (error.response?.data) {
        const detail = error.response.data.detail;
        if (detail) {
          errorMessage = detail;
        }
      }

      toast.error(errorMessage, {
        duration: 4000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {/* ===== Username Field ===== */}
      <div>
        <label className="label">Username</label>
        <div className="relative">
          <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            className="input pl-10"
            placeholder="johndoe"
            {...register("username", {
              required: "Username is required",
              minLength: {
                value: 3,
                message: "Username must be at least 3 characters",
              },
            })}
          />
        </div>
        {errors.username && (
          <p className="text-sm text-red-500 mt-1">{errors.username.message}</p>
        )}
      </div>

      {/* ===== Password Field ===== */}
      <div>
        <label className="label">Password</label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type={showPassword ? "text" : "password"}
            className="input pl-10 pr-10"
            placeholder="Enter your password"
            {...register("password", {
              required: "Password is required",
              minLength: {
                value: 6,
                message: "Password must be at least 6 characters",
              },
            })}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
          >
            {showPassword ? (
              <EyeOff className="w-5 h-5" />
            ) : (
              <Eye className="w-5 h-5" />
            )}
          </button>
        </div>
        {errors.password && (
          <p className="text-sm text-red-500 mt-1">{errors.password.message}</p>
        )}
      </div>

      {/* ===== Submit Button ===== */}
      <button
        type="submit"
        disabled={isLoading}
        className="btn-primary w-full py-3 text-base"
      >
        {isLoading ? (
          <span className="flex items-center gap-2">
            <span className="spinner w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            Signing in...
          </span>
        ) : (
          "Sign In"
        )}
      </button>
    </form>
  );
}
