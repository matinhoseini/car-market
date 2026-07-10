"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { vehiclesService } from "../../services/vehicles.service";
import { ImagePlus, X } from "lucide-react";

export default function AddVehicle() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  // ===== Handle image selection =====
  const handleImageChange = (e) => {
    console.log(e.target.files);
    const files = Array.from(e.target.files);
    console.log(files);
    setImages((prev) => [...prev, ...files]);

    // Create preview URLs
    const previews = files.map((file) => URL.createObjectURL(file));
    console.log(previews);
    setImagePreviews((prev) => [...prev, ...previews]);
  };

  // ===== Remove image =====
  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  // ===== Submit form =====
  const onSubmit = async (data) => {
    setLoading(true);

    try {
      // 1. Create car ad
      const car = await vehiclesService.createCar(data);
      toast.success("Vehicle created! Uploading images...");

      // 2. Upload images
      if (images.length > 0) {
        for (const image of images) {
          const formData = new FormData();
          formData.append("image", image);
          await vehiclesService.uploadImage(car.id, formData);
        }
        toast.success(`✅ ${images.length} image(s) uploaded!`);
      }

      toast.success("Vehicle added successfully! 🎉");
      router.push("/dashboard");
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to add vehicle");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] bg-[rgb(var(--background))] py-8 flex items-center justify-center">
      <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-3xl px-4">
        <div className="card p-6 md:p-8 space-y-5">
          <h1 className="text-2xl md:text-3xl font-bold font-heading text-center mb-6">
            🚗 Add Vehicle
          </h1>

          {/* ===== Image Upload ===== */}
          <div>
            <label className="label">Images</label>
            <div className="flex items-center gap-4 flex-wrap">
              <label className="cursor-pointer">
                <div className="w-32 h-32 border-2 border-dashed border-[rgb(var(--border))] rounded-xl flex flex-col items-center justify-center hover:border-primary-500 transition-colors">
                  <ImagePlus className="w-8 h-8 text-[rgb(var(--muted-foreground))]" />
                  <span className="text-xs text-[rgb(var(--muted-foreground))] mt-1">
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

              {/* Image previews */}
              {imagePreviews.map((preview, index) => (
                <div
                  key={index}
                  className="relative w-32 h-32 rounded-xl overflow-hidden border border-[rgb(var(--border))]"
                >
                  <img
                    src={preview}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
            <p className="text-sm text-[rgb(var(--muted-foreground))] mt-2">
              You can add multiple images
            </p>
          </div>

          {/* Brand */}
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

          {/* Model */}
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

          {/* Year */}
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
              <p className="text-sm text-red-500 mt-1">{errors.year.message}</p>
            )}
          </div>

          {/* Price */}
          <div>
            <label className="label">Price ($)</label>
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

          {/* Mileage */}
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

          {/* City */}
          <div>
            <label className="label">City</label>
            <input
              className="input"
              placeholder="e.g. Tehran"
              {...register("city", { required: "City is required" })}
            />
            {errors.city && (
              <p className="text-sm text-red-500 mt-1">{errors.city.message}</p>
            )}
          </div>

          {/* Fuel Type */}
          <div>
            <label className="label">Fuel Type</label>
            <select
              className="input"
              {...register("fuel_type", { required: "Fuel type is required" })}
            >
              <option value="gasoline">Gasoline</option>
              <option value="diesel">Diesel</option>
              <option value="electric">Electric</option>
              <option value="hybrid">Hybrid</option>
            </select>
            {errors.fuel_type && (
              <p className="text-sm text-red-500 mt-1">
                {errors.fuel_type.message}
              </p>
            )}
          </div>

          {/* Gearbox */}
          <div>
            <label className="label">Gearbox</label>
            <select
              className="input"
              {...register("gearbox", { required: "Gearbox is required" })}
            >
              <option value="manual">Manual</option>
              <option value="automatic">Automatic</option>
              <option value="cvt">CVT</option>
            </select>
            {errors.gearbox && (
              <p className="text-sm text-red-500 mt-1">
                {errors.gearbox.message}
              </p>
            )}
          </div>

          {/* Description */}
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

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full py-3 text-base"
          >
            {loading ? "Adding..." : "Add Vehicle"}
          </button>
        </div>
      </form>
    </div>
  );
}
