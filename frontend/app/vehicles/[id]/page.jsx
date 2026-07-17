// app/vehicles/[id]/page.jsx
import { notFound } from "next/navigation";
import { vehiclesService } from "../../../services/vehicles.service";
import VehicleDetailClient from "./VehicleDetailClient";

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
