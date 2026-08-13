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
    <div className="min-h-[calc(100vh-80px)] bg-[rgb(var(--background))] py-8">
      <div className="container-custom">
        {/* ===== Back Button ===== */}
        <button
          onClick={handleBack}
          className="flex items-center gap-2 text-[rgb(var(--muted-foreground))] hover:text-[rgb(var(--foreground))] transition-colors mb-4"
          aria-label="Go back"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>

        {/* ===== Form ===== */}
        <VehicleForm />
      </div>
    </div>
  );
}
