"use client";

import React, { useState, useMemo, useCallback, useEffect, memo } from "react";
import { debounce } from "../../helpers/debounce";
import {
  FUEL_TYPES,
  GEARBOX_TYPES,
  YEARS,
  ORDER_OPTIONS,
  CITIES,
} from "../../helpers/constants";

const VehicleFilter = memo(({ onFilterChange, initialFilters = {} }) => {
  // ============================================
  // 📋 Filter states (Backend supported)
  // ============================================
  const [filters, setFilters] = useState({
    search: initialFilters.search || "",
    brand: initialFilters.brand || "",
    city: initialFilters.city || "",
    fuel_type: initialFilters.fuel_type || "",
    gearbox: initialFilters.gearbox || "",
    price_min: initialFilters.price_min || "",
    price_max: initialFilters.price_max || "",
    year_min: initialFilters.year_min || "",
    year_max: initialFilters.year_max || "",
    ordering: initialFilters.ordering || "-created_at",
  });

  // ============================================
  // 📊 Active filters count
  // ============================================
  const activeFiltersCount = useMemo(() => {
    return Object.values(filters).filter(
      (value) => value !== "" && value !== "-created_at",
    ).length;
  }, [filters]);

  // ============================================
  // 🔄 Handle filter change
  // ============================================
  const handleFilterChange = useCallback((key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }, []);

  // ============================================
  // 🔍 Debounced apply filters
  // ============================================
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

  // ============================================
  // 🗑️ Clear all filters
  // ============================================
  const clearFilters = useCallback(() => {
    setFilters({
      search: "",
      brand: "",
      city: "",
      fuel_type: "",
      gearbox: "",
      price_min: "",
      price_max: "",
      year_min: "",
      year_max: "",
      ordering: "-created_at",
    });
  }, []);

  // ============================================
  // 🎨 Render
  // ============================================
  return (
    <div className="bg-[rgb(var(--card))] p-6 rounded-xl border border-[rgb(var(--border))] shadow-sm">
      {/* ===== Header ===== */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold text-[rgb(var(--foreground))]">
          🔍 Filters
        </h3>
        {activeFiltersCount > 0 && (
          <span className="text-xs bg-primary-500/10 text-primary-500 px-2 py-1 rounded-full">
            {activeFiltersCount} active
          </span>
        )}
      </div>

      <div className="space-y-4">
        {/* ===== Search ===== */}
        <div>
          <label className="block text-sm font-medium text-[rgb(var(--muted-foreground))] mb-1">
            Search
          </label>
          <input
            type="text"
            value={filters.search}
            onChange={(e) => handleFilterChange("search", e.target.value)}
            className="w-full p-2 border border-[rgb(var(--border))] rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all bg-[rgb(var(--background))] text-[rgb(var(--foreground))]"
            placeholder="Search by brand, model, or keyword..."
          />
        </div>

        {/* ===== Brand ===== */}
        <div>
          <label className="block text-sm font-medium text-[rgb(var(--muted-foreground))] mb-1">
            Brand
          </label>
          <input
            type="text"
            value={filters.brand}
            onChange={(e) => handleFilterChange("brand", e.target.value)}
            className="w-full p-2 border border-[rgb(var(--border))] rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all bg-[rgb(var(--background))] text-[rgb(var(--foreground))]"
            placeholder="e.g. BMW, Toyota, Mercedes..."
          />
        </div>

        {/* ===== City ===== */}
        <div>
          <label className="block text-sm font-medium text-[rgb(var(--muted-foreground))] mb-1">
            City
          </label>
          <select
            value={filters.city}
            onChange={(e) => handleFilterChange("city", e.target.value)}
            className="w-full p-2 border border-[rgb(var(--border))] rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all bg-[rgb(var(--background))] text-[rgb(var(--foreground))]"
          >
            <option value="">All Cities</option>
            {CITIES.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>
        </div>

        {/* ===== Price Range ===== */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-[rgb(var(--muted-foreground))] mb-1">
              Min Price ($)
            </label>
            <input
              type="number"
              value={filters.price_min}
              onChange={(e) => handleFilterChange("price_min", e.target.value)}
              className="w-full p-2 border border-[rgb(var(--border))] rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all bg-[rgb(var(--background))] text-[rgb(var(--foreground))]"
              placeholder="0"
              min="0"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[rgb(var(--muted-foreground))] mb-1">
              Max Price ($)
            </label>
            <input
              type="number"
              value={filters.price_max}
              onChange={(e) => handleFilterChange("price_max", e.target.value)}
              className="w-full p-2 border border-[rgb(var(--border))] rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all bg-[rgb(var(--background))] text-[rgb(var(--foreground))]"
              placeholder="200,000"
              min="0"
            />
          </div>
        </div>

        {/* ===== Year Range ===== */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-[rgb(var(--muted-foreground))] mb-1">
              Min Year
            </label>
            <select
              value={filters.year_min}
              onChange={(e) => handleFilterChange("year_min", e.target.value)}
              className="w-full p-2 border border-[rgb(var(--border))] rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all bg-[rgb(var(--background))] text-[rgb(var(--foreground))]"
            >
              <option value="">Any</option>
              {YEARS.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-[rgb(var(--muted-foreground))] mb-1">
              Max Year
            </label>
            <select
              value={filters.year_max}
              onChange={(e) => handleFilterChange("year_max", e.target.value)}
              className="w-full p-2 border border-[rgb(var(--border))] rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all bg-[rgb(var(--background))] text-[rgb(var(--foreground))]"
            >
              <option value="">Any</option>
              {YEARS.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* ===== Fuel Type ===== */}
        <div>
          <label className="block text-sm font-medium text-[rgb(var(--muted-foreground))] mb-1">
            Fuel Type
          </label>
          <select
            value={filters.fuel_type}
            onChange={(e) => handleFilterChange("fuel_type", e.target.value)}
            className="w-full p-2 border border-[rgb(var(--border))] rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all bg-[rgb(var(--background))] text-[rgb(var(--foreground))]"
          >
            <option value="">All Fuel Types</option>
            {FUEL_TYPES.map((fuel) => (
              <option key={fuel.value} value={fuel.value}>
                {fuel.label}
              </option>
            ))}
          </select>
        </div>

        {/* ===== Gearbox ===== */}
        <div>
          <label className="block text-sm font-medium text-[rgb(var(--muted-foreground))] mb-1">
            Transmission
          </label>
          <select
            value={filters.gearbox}
            onChange={(e) => handleFilterChange("gearbox", e.target.value)}
            className="w-full p-2 border border-[rgb(var(--border))] rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all bg-[rgb(var(--background))] text-[rgb(var(--foreground))]"
          >
            <option value="">All Transmissions</option>
            {GEARBOX_TYPES.map((gearbox) => (
              <option key={gearbox.value} value={gearbox.value}>
                {gearbox.label}
              </option>
            ))}
          </select>
        </div>

        {/* ===== Ordering ===== */}
        <div>
          <label className="block text-sm font-medium text-[rgb(var(--muted-foreground))] mb-1">
            Sort By
          </label>
          <select
            value={filters.ordering}
            onChange={(e) => handleFilterChange("ordering", e.target.value)}
            className="w-full p-2 border border-[rgb(var(--border))] rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all bg-[rgb(var(--background))] text-[rgb(var(--foreground))]"
          >
            {ORDER_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* ===== Buttons ===== */}
        <div className="flex gap-2 pt-2">
          <button
            onClick={clearFilters}
            className="flex-1 bg-red-500/10 text-red-500 border border-red-500/30 py-2 rounded-lg hover:bg-red-500/20 transition-colors text-sm font-medium"
          >
            🗑️ Clear
          </button>
          <button
            onClick={() => onFilterChange(filters)}
            className="flex-1 bg-primary-500 text-white py-2 rounded-lg hover:bg-primary-600 transition-colors text-sm font-medium"
          >
            🔍 Apply
          </button>
        </div>

        {/* ===== Filter Count ===== */}
        {activeFiltersCount > 0 && (
          <div className="text-xs text-[rgb(var(--muted-foreground))] text-center pt-1">
            {activeFiltersCount} filter{activeFiltersCount > 1 ? "s" : ""}{" "}
            active
          </div>
        )}
      </div>
    </div>
  );
});

VehicleFilter.displayName = "VehicleFilter";
export default VehicleFilter;
