"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  Heart,
  Share2,
  MapPin,
  Calendar,
  Fuel,
  Gauge,
  Settings,
  MessageCircle,
  Phone,
  ChevronLeft,
  ChevronRight,
  Check,
} from "lucide-react";
import { vehiclesService } from "../../../services/vehicles.service";
import { chatService } from "../../../services/chat.service";
import { useAuthStore } from "../../../store/authStore";
import toast from "react-hot-toast";

const VehicleDetailClient = ({ car: initialCar }) => {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();

  // ===== State =====
  const [vehicle, setVehicle] = useState(initialCar);
  const [isFavorite, setIsFavorite] = useState(
    initialCar?.is_favorite || false,
  );
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isStartingChat, setIsStartingChat] = useState(false);
  const [hasConversation, setHasConversation] = useState(false);
  const [conversationId, setConversationId] = useState(null);
  const [isCheckingChat, setIsCheckingChat] = useState(true);

  // ===== Check existing conversation =====
  useEffect(() => {
    const checkConversation = async () => {
      if (!isAuthenticated || !vehicle?.id) {
        setIsCheckingChat(false);
        return;
      }

      // اگر کاربر خود فروشنده است، نیازی به چک کردن چت نیست
      if (user?.id === vehicle?.seller?.id) {
        setIsCheckingChat(false);
        return;
      }

      try {
        const conversations = await chatService.getConversations();
        const existing = conversations.find(
          (conv) => conv.car_id === parseInt(vehicle.id),
        );
        if (existing) {
          setHasConversation(true);
          setConversationId(existing.id);
        }
      } catch (error) {
        console.error("Error checking conversations:", error);
      } finally {
        setIsCheckingChat(false);
      }
    };

    checkConversation();
  }, [vehicle?.id, isAuthenticated, user?.id, vehicle?.seller?.id]);

  // ===== Start new conversation =====
  const handleStartChat = useCallback(async () => {
    if (!isAuthenticated) {
      toast.error("Please login first");
      router.push("/auth/login");
      return;
    }

    if (user?.id === vehicle?.seller?.id) {
      toast.error("You cannot chat with yourself!");
      return;
    }

    setIsStartingChat(true);
    try {
      const result = await chatService.startConversation(vehicle.id);
      if (result?.id) {
        toast.success("Conversation started!");
        router.push(`/dashboard/messages/${result.id}`);
      }
    } catch (error) {
      console.error("Error starting chat:", error);
      toast.error(
        error?.response?.data?.message || "Failed to start conversation",
      );
    } finally {
      setIsStartingChat(false);
    }
  }, [vehicle?.id, isAuthenticated, user?.id, vehicle?.seller?.id, router]);

  // ===== Go to existing chat =====
  const handleGoToChat = useCallback(() => {
    if (conversationId) {
      router.push(`/dashboard/messages/${conversationId}`);
    }
  }, [conversationId, router]);

  // ===== Toggle favorite =====
  const handleToggleFavorite = useCallback(async () => {
    if (!isAuthenticated) {
      toast.error("Please login first");
      router.push("/auth/login");
      return;
    }

    try {
      if (isFavorite) {
        await vehiclesService.removeFromFavorites(vehicle.id);
        toast.success("Removed from favorites");
      } else {
        await vehiclesService.addToFavorites(vehicle.id);
        toast.success("Added to favorites");
      }
      setIsFavorite(!isFavorite);
    } catch (error) {
      console.error("Error toggling favorite:", error);
      toast.error("Failed to update favorites");
    }
  }, [isFavorite, vehicle?.id, isAuthenticated, router]);

  // ===== Share vehicle =====
  const handleShare = useCallback(() => {
    const url = window.location.href;
    if (navigator.share) {
      navigator
        .share({
          title: vehicle?.title,
          text: `Check out this ${vehicle?.title}`,
          url: url,
        })
        .catch(() => {});
    } else {
      navigator.clipboard.writeText(url);
      toast.success("Link copied to clipboard!");
    }
  }, [vehicle]);

  // ===== Image navigation =====
  const nextImage = useCallback(() => {
    if (vehicle?.images?.length > 0) {
      setCurrentImageIndex((prev) =>
        prev === vehicle.images.length - 1 ? 0 : prev + 1,
      );
    }
  }, [vehicle?.images?.length]);

  const prevImage = useCallback(() => {
    if (vehicle?.images?.length > 0) {
      setCurrentImageIndex((prev) =>
        prev === 0 ? vehicle.images.length - 1 : prev - 1,
      );
    }
  }, [vehicle?.images?.length]);

  // ===== Get images =====
  const images = vehicle?.images || [];
  const mainImage = images[currentImageIndex] || vehicle?.image;

  // ===== Render chat button =====
  const renderChatButton = () => {
    // اگر کاربر لاگین نکرده
    if (!isAuthenticated) {
      return (
        <Link
          href="/auth/login"
          className="btn-primary flex items-center gap-2"
        >
          <MessageCircle className="w-5 h-5" />
          Login to Chat
        </Link>
      );
    }

    // اگر کاربر خود فروشنده است
    if (user?.id === vehicle?.seller?.id) {
      return (
        <div className="text-sm text-[rgb(var(--muted-foreground))] bg-[rgb(var(--muted))] px-4 py-2 rounded-lg flex items-center gap-2">
          <Check className="w-4 h-4 text-green-500" />
          This is your vehicle
        </div>
      );
    }

    // در حال بررسی وجود چت
    if (isCheckingChat) {
      return (
        <button className="btn-primary flex items-center gap-2 opacity-70 cursor-wait">
          <div className="spinner w-4 h-4"></div>
          Checking...
        </button>
      );
    }

    // چت وجود دارد
    if (hasConversation && conversationId) {
      return (
        <button
          onClick={handleGoToChat}
          className="btn-primary flex items-center gap-2"
        >
          <MessageCircle className="w-5 h-5" />
          Continue Chat
        </button>
      );
    }

    // شروع چت جدید
    return (
      <button
        onClick={handleStartChat}
        disabled={isStartingChat}
        className="btn-primary flex items-center gap-2"
      >
        <MessageCircle className="w-5 h-5" />
        {isStartingChat ? "Starting..." : "Chat with Seller"}
      </button>
    );
  };

  // ===== If no vehicle =====
  if (!vehicle) {
    return (
      <div className="min-h-screen bg-[rgb(var(--background))] flex items-center justify-center">
        <div className="text-center">
          <p className="text-4xl mb-4">🚗</p>
          <h2 className="text-2xl font-bold mb-2">Vehicle Not Found</h2>
          <p className="text-[rgb(var(--muted-foreground))]">
            The vehicle you're looking for doesn't exist.
          </p>
          <Link href="/vehicles" className="btn-primary mt-4 inline-block">
            Browse Vehicles
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[rgb(var(--background))] py-8">
      <div className="container-custom">
        {/* ===== Back Button ===== */}
        <Link
          href="/vehicles"
          className="inline-flex items-center gap-2 text-[rgb(var(--muted-foreground))] hover:text-[rgb(var(--foreground))] mb-4 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to Vehicles
        </Link>

        {/* ===== Main Content ===== */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* ===== Image Gallery ===== */}
          <div className="space-y-4">
            <div className="relative aspect-[4/3] bg-[rgb(var(--muted))] rounded-xl overflow-hidden">
              {mainImage ? (
                <Image
                  src={mainImage}
                  alt={vehicle.title || vehicle.model}
                  fill
                  className="object-cover"
                  priority
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-6xl">
                  🚗
                </div>
              )}

              {/* Image navigation buttons */}
              {images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
                    aria-label="Previous image"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
                    aria-label="Next image"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>

                  {/* Image counter */}
                  <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-black/50 text-white text-xs px-3 py-1 rounded-full">
                    {currentImageIndex + 1} / {images.length}
                  </div>
                </>
              )}
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-2">
                {images.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-colors ${
                      index === currentImageIndex
                        ? "border-primary-500"
                        : "border-transparent"
                    }`}
                  >
                    <Image
                      src={img}
                      alt={`${vehicle.title || vehicle.model} - ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ===== Vehicle Info ===== */}
          <div className="space-y-6">
            {/* Title & Price */}
            <div>
              <h1 className="text-3xl font-bold font-heading">
                {vehicle.title || vehicle.model}
              </h1>
              <p className="text-3xl font-bold text-primary-500 mt-2">
                ${vehicle.price?.toLocaleString()}
              </p>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap gap-3">
              {renderChatButton()}

              <button
                onClick={handleToggleFavorite}
                className={`btn-outline flex items-center gap-2 ${
                  isFavorite ? "text-red-500 border-red-500" : ""
                }`}
              >
                <Heart
                  className={`w-5 h-5 ${isFavorite ? "fill-red-500" : ""}`}
                />
                {isFavorite ? "Favorited" : "Favorite"}
              </button>

              <button
                onClick={handleShare}
                className="btn-outline flex items-center gap-2"
              >
                <Share2 className="w-5 h-5" />
                Share
              </button>
            </div>

            {/* Seller Info */}
            {vehicle.seller && (
              <div className="card p-4">
                <h3 className="font-semibold mb-3">Seller Information</h3>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-primary-500 to-accent-500 flex items-center justify-center text-white font-bold text-lg">
                    {vehicle.seller.username?.charAt(0).toUpperCase() || "U"}
                  </div>
                  <div>
                    <p className="font-medium">{vehicle.seller.username}</p>
                    <p className="text-sm text-[rgb(var(--muted-foreground))]">
                      Member since{" "}
                      {vehicle.seller.date_joined
                        ? new Date(
                            vehicle.seller.date_joined,
                          ).toLocaleDateString()
                        : "N/A"}
                    </p>
                  </div>
                  {vehicle.seller.phone && (
                    <a
                      href={`tel:${vehicle.seller.phone}`}
                      className="ml-auto btn-outline btn-sm flex items-center gap-1"
                    >
                      <Phone className="w-4 h-4" />
                      Call
                    </a>
                  )}
                </div>
              </div>
            )}

            {/* Specifications */}
            <div className="card p-4">
              <h3 className="font-semibold mb-3">Specifications</h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="w-4 h-4 text-[rgb(var(--muted-foreground))]" />
                  <span>{vehicle.year || "N/A"}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Gauge className="w-4 h-4 text-[rgb(var(--muted-foreground))]" />
                  <span>{vehicle.mileage?.toLocaleString() || "N/A"} km</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Fuel className="w-4 h-4 text-[rgb(var(--muted-foreground))]" />
                  <span>{vehicle.fuel_type || "N/A"}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Settings className="w-4 h-4 text-[rgb(var(--muted-foreground))]" />
                  <span>{vehicle.transmission || "N/A"}</span>
                </div>
                <div className="flex items-center gap-2 text-sm col-span-2">
                  <MapPin className="w-4 h-4 text-[rgb(var(--muted-foreground))]" />
                  <span>{vehicle.city || "N/A"}</span>
                </div>
              </div>
            </div>

            {/* Description */}
            {vehicle.description && (
              <div className="card p-4">
                <h3 className="font-semibold mb-2">Description</h3>
                <p className="text-[rgb(var(--muted-foreground))] leading-relaxed">
                  {vehicle.description}
                </p>
              </div>
            )}

            {/* Status */}
            <div className="flex items-center gap-2">
              <div
                className={`w-2 h-2 rounded-full ${
                  vehicle.is_available !== false ? "bg-green-500" : "bg-red-500"
                }`}
              />
              <span className="text-sm font-medium">
                {vehicle.is_available !== false ? "Available" : "Sold"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VehicleDetailClient;
