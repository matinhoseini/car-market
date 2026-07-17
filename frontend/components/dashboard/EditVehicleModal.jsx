// components/dashboard/EditVehicleModal.jsx
"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import Image from "next/image";
import { Loader2, ImagePlus, X } from "lucide-react";
import Modal from "../common/Modal";
import { vehiclesService } from "../../services/vehicles.service";
import toast from "react-hot-toast";

// ===== Import helpers =====
import { getImageUrl } from "../../helpers/image";
import { FUEL_TYPES, GEARBOX_TYPES } from "../../helpers/constants";

export default function EditVehicleModal({
  isOpen,
  onClose,
  vehicle,
  onUpdated,
}) {
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [imagesToDelete, setImagesToDelete] = useState([]);

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

  // ===== Load vehicle data =====
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

      setExistingImages(vehicle.images || []);
      setImages([]);
      setImagePreviews([]);
      setImagesToDelete([]);
    }
  }, [vehicle]);

  // ===== Memoized values =====
  const fuelTypes = useMemo(() => FUEL_TYPES, []);
  const gearboxTypes = useMemo(() => GEARBOX_TYPES, []);

  const existingImageUrls = useMemo(() => {
    return existingImages.map((img) => ({
      ...img,
      url: getImageUrl(img.image),
    }));
  }, [existingImages]);

  // ===== Handlers =====
  const handleImageChange = useCallback((e) => {
    const files = Array.from(e.target.files);
    setImages((prev) => [...prev, ...files]);
    const previews = files.map((file) => URL.createObjectURL(file));
    setImagePreviews((prev) => [...prev, ...previews]);
  }, []);

  const removeNewImage = useCallback((index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const removeExistingImage = useCallback((imageId) => {
    setImagesToDelete((prev) => [...prev, imageId]);
    setExistingImages((prev) => prev.filter((img) => img.id !== imageId));
  }, []);

  const handleChange = useCallback((e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }, []);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      setLoading(true);

      try {
        await vehiclesService.updateCar(vehicle.id, formData);

        for (const imageId of imagesToDelete) {
          await vehiclesService.deleteImage(imageId);
        }

        for (const image of images) {
          const formDataImage = new FormData();
          formDataImage.append("image", image);
          await vehiclesService.uploadImage(vehicle.id, formDataImage);
        }

        toast.success("Vehicle updated successfully!");
        onUpdated?.();
        onClose();
      } catch (error) {
        console.error(error);
        toast.error(
          error.response?.data?.message || "Failed to update vehicle",
        );
      } finally {
        setLoading(false);
      }
    },
    [vehicle, formData, imagesToDelete, images, onUpdated, onClose],
  );

  // ===== Memoized image sections =====
  const existingImagesSection = useMemo(() => {
    if (existingImageUrls.length === 0) return null;

    return (
      <div className="grid grid-cols-2 gap-2 mb-3">
        {existingImageUrls.map((img) => (
          <div
            key={img.id}
            className="relative aspect-square rounded-lg overflow-hidden border border-[rgb(var(--border))] bg-gray-100"
          >
            <Image
              src={img.url}
              alt="Car"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 50vw, 25vw"
            />
            <button
              type="button"
              onClick={() => removeExistingImage(img.id)}
              className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition shadow-md z-10"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    );
  }, [existingImageUrls, removeExistingImage]);

  const newImagesSection = useMemo(() => {
    if (imagePreviews.length === 0) return null;

    return (
      <div className="grid grid-cols-2 gap-2 mb-3">
        {imagePreviews.map((preview, index) => (
          <div
            key={index}
            className="relative aspect-square rounded-lg overflow-hidden border border-[rgb(var(--border))] bg-gray-100"
          >
            <img
              src={preview}
              alt={`Preview ${index + 1}`}
              className="w-full h-full object-cover"
            />
            <button
              type="button"
              onClick={() => removeNewImage(index)}
              className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition shadow-md"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    );
  }, [imagePreviews, removeNewImage]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Vehicle" size="xl">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* ===== LEFT: Images ===== */}
        <div>
          <label className="label">Images</label>

          {existingImagesSection}
          {newImagesSection}

          <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 border-2 border-dashed border-[rgb(var(--border))] rounded-lg hover:border-primary-500 transition-colors w-full justify-center">
            <ImagePlus className="w-5 h-5 text-[rgb(var(--muted-foreground))]" />
            <span className="text-sm text-[rgb(var(--muted-foreground))]">
              Add Image
            </span>
            <input
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={handleImageChange}
            />
          </label>
          <p className="text-xs text-[rgb(var(--muted-foreground))] mt-2">
            You can add multiple images
          </p>
        </div>

        {/* ===== RIGHT: Form ===== */}
        <div>
          <form onSubmit={handleSubmit} className="space-y-3">
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

            <div className="grid grid-cols-2 gap-3">
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
            </div>

            <div className="grid grid-cols-2 gap-3">
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
            </div>

            <div className="grid grid-cols-2 gap-3">
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
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="label">Fuel Type</label>
                <select
                  name="fuel_type"
                  value={formData.fuel_type}
                  onChange={handleChange}
                  className="input"
                >
                  {fuelTypes.map((t) => (
                    <option key={t.value} value={t.value}>
                      {t.label}
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
                    <option key={t.value} value={t.value}>
                      {t.label}
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

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full"
            >
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
        </div>
      </div>
    </Modal>
  );
}
