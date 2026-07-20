// components/vehicles/VehicleFilter.jsx
"use client";

import React, { useState, useMemo, useCallback, useEffect, memo } from "react";
import { debounce } from "../../helpers/debounce";

const VehicleFilter = memo(({ onFilterChange, initialFilters = {} }) => {
  const [filters, setFilters] = useState({
    brand: initialFilters.brand || "",
    model: initialFilters.model || "",
    minPrice: initialFilters.minPrice || "",
    maxPrice: initialFilters.maxPrice || "",
    minYear: initialFilters.minYear || "",
    maxYear: initialFilters.maxYear || "",
    city: initialFilters.city || "",
    fuelType: initialFilters.fuelType || "",
    transmission: initialFilters.transmission || "",
  });

  const handleFilterChange = useCallback((key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }, []);

  const debouncedApplyFilters = useMemo(
    () =>
      debounce(() => {
        onFilterChange(filters);
      }, 300),
    [filters, onFilterChange],
  );

  useEffect(() => {
    debouncedApplyFilters();
  }, [filters, debouncedApplyFilters]);

  const clearFilters = useCallback(() => {
    setFilters({
      brand: "",
      model: "",
      minPrice: "",
      maxPrice: "",
      minYear: "",
      maxYear: "",
      city: "",
      fuelType: "",
      transmission: "",
    });
  }, []);

  const activeFiltersCount = useMemo(() => {
    return Object.values(filters).filter((value) => value !== "").length;
  }, [filters]);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold text-gray-800">🔍 Filters</h3>
        {activeFiltersCount > 0 && (
          <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full">
            {activeFiltersCount} active
          </span>
        )}
      </div>

      <div className="space-y-4">
        {/* Brand */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Brand
          </label>
          <input
            type="text"
            value={filters.brand}
            onChange={(e) => handleFilterChange("brand", e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            placeholder="e.g. BMW"
          />
        </div>

        {/* Model */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Model
          </label>
          <input
            type="text"
            value={filters.model}
            onChange={(e) => handleFilterChange("model", e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            placeholder="e.g. X6"
          />
        </div>

        {/* Price Range */}
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Min Price
            </label>
            <input
              type="number"
              value={filters.minPrice}
              onChange={(e) => handleFilterChange("minPrice", e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="0"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Max Price
            </label>
            <input
              type="number"
              value={filters.maxPrice}
              onChange={(e) => handleFilterChange("maxPrice", e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="100,000,000"
            />
          </div>
        </div>

        {/* Year Range */}
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Min Year
            </label>
            <input
              type="number"
              value={filters.minYear}
              onChange={(e) => handleFilterChange("minYear", e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="1390"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Max Year
            </label>
            <input
              type="number"
              value={filters.maxYear}
              onChange={(e) => handleFilterChange("maxYear", e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="1403"
            />
          </div>
        </div>

        {/* City */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            City
          </label>
          <input
            type="text"
            value={filters.city}
            onChange={(e) => handleFilterChange("city", e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            placeholder="Tehran, Shiraz..."
          />
        </div>

        {/* Fuel Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Fuel Type
          </label>
          <select
            value={filters.fuelType}
            onChange={(e) => handleFilterChange("fuelType", e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          >
            <option value="">All</option>
            <option value="Petrol">Petrol</option>
            <option value="Diesel">Diesel</option>
            <option value="Electric">Electric</option>
            <option value="Hybrid">Hybrid</option>
          </select>
        </div>

        {/* Transmission */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Transmission
          </label>
          <select
            value={filters.transmission}
            onChange={(e) => handleFilterChange("transmission", e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          >
            <option value="">All</option>
            <option value="Manual">Manual</option>
            <option value="Automatic">Automatic</option>
            <option value="CVT">CVT</option>
          </select>
        </div>

        {/* Buttons */}
        <div className="flex gap-2 pt-2">
          <button
            onClick={clearFilters}
            className="flex-1 bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition-colors"
          >
            🗑️ Clear
          </button>
          <button
            onClick={() => onFilterChange(filters)}
            className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            🔍 Apply
          </button>
        </div>
      </div>
    </div>
  );
});

VehicleFilter.displayName = "VehicleFilter";
export default VehicleFilter;
