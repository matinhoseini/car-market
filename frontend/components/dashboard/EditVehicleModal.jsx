// components/dashboard/EditVehicleModal.jsx
"use client";

import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import Modal from "../common/Modal";
import { vehiclesService } from "../../services/vehicles.service";
import toast from "react-hot-toast";

export default function EditVehicleModal({
  isOpen,
  onClose,
  vehicle,
  onUpdated,
}) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    brand: "",
    model: "",
    year: "",
    price: "",
    mileage: "",
    city: "",
    fuel_type: "gasoline",
    gearbox: "manual",
    description: "",
  });

  useEffect(() => {
    if (vehicle) {
      setFormData({
        title: vehicle.title || "",
        brand: vehicle.brand || "",
        model: vehicle.model || "",
        year: vehicle.year || "",
        price: vehicle.price || "",
        mileage: vehicle.mileage || "",
        city: vehicle.city || "",
        fuel_type: vehicle.fuel_type || "gasoline",
        gearbox: vehicle.gearbox || "manual",
        description: vehicle.description || "",
      });
    }
  }, [vehicle]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await vehiclesService.updateCar(vehicle.id, formData);
      toast.success("Vehicle updated successfully!");
      onUpdated?.();
      onClose();
    } catch (error) {
      console.error(error);
      toast.error("Failed to update vehicle");
    } finally {
      setLoading(false);
    }
  };

  const fuelTypes = ["gasoline", "diesel", "electric", "hybrid"];
  const gearboxTypes = ["manual", "automatic", "cvt"];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Vehicle" size="lg">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="label">Title</label>
            <input
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="input"
              required
            />
          </div>
          <div>
            <label className="label">Price</label>
            <input
              name="price"
              type="number"
              value={formData.price}
              onChange={handleChange}
              className="input"
              required
            />
          </div>
          <div>
            <label className="label">Brand</label>
            <input
              name="brand"
              value={formData.brand}
              onChange={handleChange}
              className="input"
              required
            />
          </div>
          <div>
            <label className="label">Model</label>
            <input
              name="model"
              value={formData.model}
              onChange={handleChange}
              className="input"
              required
            />
          </div>
          <div>
            <label className="label">Year</label>
            <input
              name="year"
              type="number"
              value={formData.year}
              onChange={handleChange}
              className="input"
              required
            />
          </div>
          <div>
            <label className="label">Mileage</label>
            <input
              name="mileage"
              type="number"
              value={formData.mileage}
              onChange={handleChange}
              className="input"
              required
            />
          </div>
          <div>
            <label className="label">City</label>
            <input
              name="city"
              value={formData.city}
              onChange={handleChange}
              className="input"
            />
          </div>
          <div>
            <label className="label">Fuel Type</label>
            <select
              name="fuel_type"
              value={formData.fuel_type}
              onChange={handleChange}
              className="input"
            >
              {fuelTypes.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="label">Gearbox</label>
            <select
              name="gearbox"
              value={formData.gearbox}
              onChange={handleChange}
              className="input"
            >
              {gearboxTypes.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="label">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="input"
            rows="3"
          />
        </div>

        <button type="submit" disabled={loading} className="btn-primary w-full">
          {loading ? (
            <span className="flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              Saving...
            </span>
          ) : (
            "Save Changes"
          )}
        </button>
      </form>
    </Modal>
  );
}
