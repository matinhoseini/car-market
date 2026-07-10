"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { vehiclesService } from "../../services/vehicles.service";

export default function Vehicles() {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCars() {
      try {
        setLoading(true);
        const data = await vehiclesService.getAllCars();
        setCars(data.results || []); // ✅ اینجا اصلاح شد
        console.log("✅ Cars loaded:", data);
      } catch (err) {
        console.error("❌ Error fetching cars:", err);
        toast.error(err.message || "Failed to load cars");
      } finally {
        setLoading(false);
      }
    }
    fetchCars();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-80px)]">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-80px)] bg-[rgb(var(--background))] py-8">
      <div className="container-custom">
        <h1 className="text-2xl font-bold font-heading mb-6">
          🚗 All Vehicles
        </h1>

        {cars.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-[rgb(var(--muted-foreground))]">
              No vehicles found
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {cars.map((car) => (
              <div key={car.id} className="card card-hover p-4">
                <h3 className="font-semibold">{car.title}</h3>
                <p className="text-lg font-bold text-primary-500">
                  ${car.price?.toLocaleString()}
                </p>
                <p className="text-sm text-[rgb(var(--muted-foreground))]">
                  {car.fuel_type} • {car.year}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
