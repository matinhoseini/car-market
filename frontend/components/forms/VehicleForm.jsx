// components/forms/VehicleForm.jsx
"use client";

import { useState, useCallback, useMemo } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { ImagePlus, X, Loader2 } from "lucide-react";
import { vehiclesService } from "../../services/vehicles.service";

// ===== Import helpers =====
import { FUEL_TYPES, GEARBOX_TYPES } from "../../helpers/constants";

export default function VehicleForm({ initialData = null, isEditing = false }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: initialData || {},
  });

  // ===== Memoized options =====
  const fuelTypes = useMemo(() => FUEL_TYPES, []);
  const gearboxTypes = useMemo(() => GEARBOX_TYPES, []);

  // ===== Handlers (memoized) =====
  const handleImageChange = useCallback((e) => {
    const files = Array.from(e.target.files);
    setImages((prev) => [...prev, ...files]);
    const previews = files.map((file) => URL.createObjectURL(file));
    setImagePreviews((prev) => [...prev, ...previews]);
  }, []);

  const removeImage = useCallback((index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const onSubmit = useCallback(
    async (data) => {
      setLoading(true);

      try {
        let car;

        if (isEditing && initialData?.id) {
          car = await vehiclesService.updateCar(initialData.id, data);
          toast.success("Vehicle updated successfully! 🎉");
        } else {
          car = await vehiclesService.createCar(data);
          toast.success("Vehicle created! Uploading images...");
        }

        if (!isEditing && images.length > 0) {
          for (const image of images) {
            const formData = new FormData();
            formData.append("image", image);
            await vehiclesService.uploadImage(car.id, formData);
          }
          toast.success(`✅ ${images.length} image(s) uploaded!`);
        }

        toast.success(
          isEditing ? "Vehicle updated!" : "Vehicle added successfully! 🎉",
        );
        reset();
        setImages([]);
        setImagePreviews([]);
        router.push("/dashboard");
      } catch (err) {
        console.error(err);
        toast.error(err.response?.data?.message || "Failed to save vehicle");
      } finally {
        setLoading(false);
      }
    },
    [isEditing, initialData, images, reset, router],
  );

  // ===== Memoized image preview section (flex row) =====
  const imagePreviewsSection = useMemo(() => {
    if (imagePreviews.length === 0) return null;

    return (
      <div className="flex flex-wrap gap-2 mt-2">
        {imagePreviews.map((preview, index) => (
          <div
            key={index}
            className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-lg overflow-hidden border border-[rgb(var(--border))] flex-shrink-0"
          >
            <img
              src={preview}
              alt={`Preview ${index + 1}`}
              className="w-full h-full object-cover"
            />
            <button
              type="button"
              onClick={() => removeImage(index)}
              className="absolute top-1 right-1 p-0.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition shadow-md"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    );
  }, [imagePreviews, removeImage]);

  return (
    <div className="min-h-[calc(100vh-80px)] bg-[rgb(var(--background))] py-8 flex items-center justify-center">
      <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-3xl px-4">
        <div className="card p-6 md:p-8 space-y-5">
          <h1 className="text-2xl md:text-3xl font-bold font-heading text-center mb-6">
            {isEditing ? "✏️ Edit Vehicle" : "🚗 Add Vehicle"}
          </h1>

          {/* ===== Image Upload (only for new) ===== */}
          {!isEditing && (
            <div>
              <label className="label">Images</label>
              <div className="flex items-start gap-4 flex-wrap">
                {/* Add Image Button - Left */}
                <label className="cursor-pointer flex-shrink-0">
                  <div className="w-24 h-24 sm:w-28 sm:h-28 border-2 border-dashed border-[rgb(var(--border))] rounded-xl flex flex-col items-center justify-center hover:border-primary-500 transition-colors">
                    <ImagePlus className="w-8 h-8 text-[rgb(var(--muted-foreground))]" />
                    <span className="text-xs text-[rgb(var(--muted-foreground))] mt-1 text-center px-1">
                      Add Image
                    </span>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={handleImageChange}
                  />
                </label>

                {/* Image Previews - Right */}
                {imagePreviewsSection}
              </div>
              <p className="text-sm text-[rgb(var(--muted-foreground))] mt-2">
                You can add multiple images
              </p>
            </div>
          )}

          {/* ===== Title ===== */}
          <div>
            <label className="label">Title</label>
            <input
              className="input"
              placeholder="e.g. Toyota Camry 2023"
              {...register("title", { required: "Title is required" })}
            />
            {errors.title && (
              <p className="text-sm text-red-500 mt-1">
                {errors.title.message}
              </p>
            )}
          </div>

          {/* ===== Brand & Model ===== */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="label">Brand</label>
              <input
                className="input"
                placeholder="e.g. Toyota"
                {...register("brand", { required: "Brand is required" })}
              />
              {errors.brand && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.brand.message}
                </p>
              )}
            </div>
            <div>
              <label className="label">Model</label>
              <input
                className="input"
                placeholder="e.g. Camry"
                {...register("model", { required: "Model is required" })}
              />
              {errors.model && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.model.message}
                </p>
              )}
            </div>
          </div>

          {/* ===== Year & Price ===== */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="label">Year</label>
              <input
                type="number"
                className="input"
                placeholder="e.g. 2023"
                {...register("year", {
                  required: "Year is required",
                  min: { value: 1900, message: "Invalid year" },
                  max: {
                    value: new Date().getFullYear() + 1,
                    message: "Invalid year",
                  },
                })}
              />
              {errors.year && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.year.message}
                </p>
              )}
            </div>
            <div>
              <label className="label">Price</label>
              <input
                type="number"
                className="input"
                placeholder="e.g. 350000000"
                {...register("price", {
                  required: "Price is required",
                  min: { value: 0, message: "Price must be positive" },
                })}
              />
              {errors.price && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.price.message}
                </p>
              )}
            </div>
          </div>

          {/* ===== Mileage & City ===== */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="label">Mileage (km)</label>
              <input
                type="number"
                className="input"
                placeholder="e.g. 15000"
                {...register("mileage", {
                  required: "Mileage is required",
                  min: { value: 0, message: "Mileage must be positive" },
                })}
              />
              {errors.mileage && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.mileage.message}
                </p>
              )}
            </div>
            <div>
              <label className="label">City</label>
              <input
                className="input"
                placeholder="e.g. Tehran"
                {...register("city", { required: "City is required" })}
              />
              {errors.city && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.city.message}
                </p>
              )}
            </div>
          </div>

          {/* ===== Fuel Type & Gearbox ===== */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="label">Fuel Type</label>
              <select
                className="input"
                {...register("fuel_type", {
                  required: "Fuel type is required",
                })}
              >
                <option value="">Select fuel type</option>
                {fuelTypes.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </select>
              {errors.fuel_type && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.fuel_type.message}
                </p>
              )}
            </div>
            <div>
              <label className="label">Gearbox</label>
              <select
                className="input"
                {...register("gearbox", { required: "Gearbox is required" })}
              >
                <option value="">Select gearbox</option>
                {gearboxTypes.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </select>
              {errors.gearbox && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.gearbox.message}
                </p>
              )}
            </div>
          </div>

          {/* ===== Description ===== */}
          <div>
            <label className="label">Description</label>
            <textarea
              className="input min-h-[120px] md:min-h-[150px]"
              rows="4"
              placeholder="Describe your vehicle in detail..."
              {...register("description", {
                required: "Description is required",
              })}
            />
            {errors.description && (
              <p className="text-sm text-red-500 mt-1">
                {errors.description.message}
              </p>
            )}
          </div>

          {/* ===== Submit ===== */}
          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full py-3 text-base"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                {isEditing ? "Updating..." : "Adding..."}
              </span>
            ) : isEditing ? (
              "Update Vehicle"
            ) : (
              "Add Vehicle"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
