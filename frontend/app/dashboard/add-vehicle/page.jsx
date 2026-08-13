"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import VehicleForm from "../../../components/forms/VehicleForm";

export default function AddVehicle() {
  const router = useRouter();

  const handleBack = () => {
    router.back();
  };

  return (
    <div className="relative">
      {/* ===== Back Button ===== */}
      <button
        onClick={handleBack}
        className="absolute top-4 left-4 p-2 rounded-lg hover:bg-[rgb(var(--muted))] transition-all duration-200 hover:scale-95 z-10"
        aria-label="Go back"
      >
        <ArrowLeft className="w-5 h-5 text-[rgb(var(--foreground))]" />
      </button>

      <VehicleForm />
    </div>
  );
}
