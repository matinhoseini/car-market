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

    if (!car) {
      return {
        title: "Vehicle Not Found | Car Marketplace",
        description: "The vehicle you're looking for does not exist.",
      };
    }

    return {
      title: `${car.title || `${car.brand} ${car.model}`} | Car Marketplace`,
      description:
        car.description ||
        `Check out this ${car.brand} ${car.model} for sale. Year: ${car.year}, Price: $${car.price}`,
      keywords: [
        car.brand,
        car.model,
        car.fuel_type,
        "car",
        "vehicle",
        "for sale",
      ],
      openGraph: {
        title: `${car.title || `${car.brand} ${car.model}`} | Car Marketplace`,
        description:
          car.description ||
          `Check out this ${car.brand} ${car.model} for sale. Year: ${car.year}, Price: $${car.price}`,
        images: car.images?.[0]?.image
          ? [`http://localhost:8000${car.images[0].image}`]
          : [],
        type: "website",
        url: `https://carmarketplace.com/vehicles/${id}`,
        siteName: "Car Marketplace",
      },
      twitter: {
        card: "summary_large_image",
        title: `${car.title || `${car.brand} ${car.model}`} | Car Marketplace`,
        description:
          car.description ||
          `Check out this ${car.brand} ${car.model} for sale. Year: ${car.year}, Price: $${car.price}`,
        images: car.images?.[0]?.image
          ? [`http://localhost:8000${car.images[0].image}`]
          : [],
      },
    };
  } catch (error) {
    return {
      title: "Vehicle | Car Marketplace",
      description: "View vehicle details",
    };
  }
}

// ============================================
// 🔵 MAIN PAGE
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
