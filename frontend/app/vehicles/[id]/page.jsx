// app/vehicles/[id]/page.jsx
import { notFound } from "next/navigation";
import { vehiclesService } from "../../../services/vehicles.service";
import VehicleDetailClient from "./VehicleDetailClient";

// ============================================
// 📦 GENERATE STATIC PATHS
// ============================================
export async function generateStaticParams() {
  try {
    // ✅ از vehiclesService.getAllCars استفاده کن
    const data = await vehiclesService.getAllCars();
    const cars = data.results || [];

    return cars.map((car) => ({
      id: String(car.id),
    }));
  } catch (error) {
    console.error("Error generating static params:", error);
    return [];
  }
}

// ============================================
// 🟢 DYNAMIC METADATA
// ============================================
export async function generateMetadata({ params }) {
  const { id } = params;

  try {
    const car = await vehiclesService.getCarById(id);
    return {
      title: `${car.model} | Car Marketplace`,
      description: car.description || `View details of ${car.model}`,
    };
  } catch {
    return {
      title: "Vehicle | Car Marketplace",
      description: "View vehicle details",
    };
  }
}

// ============================================
// 🔵 MAIN PAGE (SSG with ISR)
// ============================================
export default async function VehicleDetailPage({ params }) {
  const { id } = params;

  try {
    const car = await vehiclesService.getCarById(id);

    if (!car) {
      notFound();
    }

    return <VehicleDetailClient car={car} />;
  } catch (error) {
    notFound();
  }
}

// ===== ISR: Revalidate every 60 seconds =====
export const revalidate = 60;
