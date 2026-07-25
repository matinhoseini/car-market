// app/vehicles/[id]/page.jsx
import { notFound } from "next/navigation";
import { vehiclesService } from "../../../services/vehicles.service";
import VehicleDetailClient from "./VehicleDetailClient";

// ============================================
// 🟢 DYNAMIC METADATA
// ============================================
export async function generateMetadata({ params }) {
  const { id } = params;

  try {
    const car = await vehiclesService.getCarById(id);
    return {
      title: `${car.title || car.model} | CarMarket`,
      description:
        car.description || `View details of ${car.title || car.model}`,
    };
  } catch {
    return {
      title: "Vehicle | CarMarket",
      description: "View vehicle details",
    };
  }
}

// ============================================
// 🔵 MAIN PAGE (Dynamic)
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
    console.error(`Error fetching car ${id}:`, error);
    notFound();
  }
}

// ===== Dynamic settings =====
export const dynamic = "force-dynamic";
export const dynamicParams = true;
