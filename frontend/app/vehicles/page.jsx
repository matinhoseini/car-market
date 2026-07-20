// app/vehicles/page.jsx
"use client";

import { useState, useMemo, useCallback, memo } from "react";
import { Search, Filter, X, ChevronDown } from "lucide-react";
import VehicleCard from "../../components/vehicles/VehicleCard";
import { useVehiclesQuery } from "../../hooks/useVehicles";
import { useDebounce } from "../../hooks/useDebounce";

// ===== Import helpers =====
import {
  FUEL_TYPES,
  GEARBOX_TYPES,
  YEARS,
  ORDER_OPTIONS,
} from "../../helpers/constants";

// ===== Loading component =====
const Loading = memo(() => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
    {[...Array(8)].map((_, i) => (
      <div key={i} className="card p-4 animate-pulse">
        <div className="w-full h-48 bg-gray-200 rounded-lg"></div>
        <div className="h-4 bg-gray-200 rounded mt-3 w-3/4"></div>
        <div className="h-4 bg-gray-200 rounded mt-2 w-1/2"></div>
      </div>
    ))}
  </div>
));

Loading.displayName = "Loading";

// ===== Initial filter state =====
const INITIAL_FILTERS = {
  brand: "",
  min_price: "",
  max_price: "",
  fuel_type: "",
  year: "",
  gearbox: "",
  city: "",
  ordering: "",
};

const VehiclesPage = memo(() => {
  const [search, setSearch] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState(INITIAL_FILTERS);

  // ===== Debounce search =====
  const debouncedSearch = useDebounce(search, 500);

  // ===== Combine filters with search =====
  const queryFilters = useMemo(() => {
    const clean = Object.fromEntries(
      Object.entries(filters).filter(([_, v]) => v !== ""),
    );
    if (debouncedSearch) {
      clean.search = debouncedSearch;
    }
    return clean;
  }, [filters, debouncedSearch]);

  // ===== React Query for fetching cars =====
  const { data, isLoading, error, refetch } = useVehiclesQuery(queryFilters);
  const cars = data?.results || data || [];

  // ===== Memoized computed values =====
  const hasFilters = useMemo(() => {
    return Object.values(filters).some((v) => v !== "");
  }, [filters]);

  const carsCount = useMemo(() => cars.length, [cars]);

  // ===== Memoized filter options from helpers =====
  const fuelTypes = useMemo(() => FUEL_TYPES, []);
  const gearboxTypes = useMemo(() => GEARBOX_TYPES, []);
  const years = useMemo(() => YEARS, []);
  const orderOptions = useMemo(() => ORDER_OPTIONS, []);

  // ===== Handlers =====
  const handleSearch = useCallback(
    (e) => {
      e.preventDefault();
      refetch();
    },
    [refetch],
  );

  const changeFilter = useCallback((key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }, []);

  const clearAll = useCallback(() => {
    setFilters(INITIAL_FILTERS);
    setSearch("");
    setShowFilters(false);
  }, []);

  const toggleFilters = useCallback(() => {
    setShowFilters((prev) => !prev);
  }, []);

  const closeFilters = useCallback(() => {
    setShowFilters(false);
  }, []);

  // ===== Memoized filter panel =====
  const filterPanel = useMemo(() => {
    if (!showFilters) return null;

    return (
      <div className="card p-4 md:p-6 mb-6 relative">
        <button
          onClick={closeFilters}
          className="absolute top-3 right-3 p-1.5 rounded-lg hover:bg-[rgb(var(--muted))] transition"
          aria-label="Close filters"
        >
          <X className="w-5 h-5 text-[rgb(var(--muted-foreground))]" />
        </button>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Brand */}
          <div>
            <label className="label text-xs">Brand</label>
            <input
              type="text"
              placeholder="e.g. Toyota"
              value={filters.brand}
              onChange={(e) => changeFilter("brand", e.target.value)}
              className="input py-1.5 text-sm"
            />
          </div>

          {/* Min Price */}
          <div>
            <label className="label text-xs">Min Price</label>
            <input
              type="number"
              placeholder="Min price"
              value={filters.min_price}
              onChange={(e) => changeFilter("min_price", e.target.value)}
              className="input py-1.5 text-sm"
            />
          </div>

          {/* Max Price */}
          <div>
            <label className="label text-xs">Max Price</label>
            <input
              type="number"
              placeholder="Max price"
              value={filters.max_price}
              onChange={(e) => changeFilter("max_price", e.target.value)}
              className="input py-1.5 text-sm"
            />
          </div>

          {/* Fuel Type */}
          <div>
            <label className="label text-xs">Fuel Type</label>
            <select
              value={filters.fuel_type}
              onChange={(e) => changeFilter("fuel_type", e.target.value)}
              className="input py-1.5 text-sm"
            >
              <option value="">All fuels</option>
              {fuelTypes.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
          </div>

          {/* Gearbox */}
          <div>
            <label className="label text-xs">Gearbox</label>
            <select
              value={filters.gearbox}
              onChange={(e) => changeFilter("gearbox", e.target.value)}
              className="input py-1.5 text-sm"
            >
              <option value="">All types</option>
              {gearboxTypes.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
          </div>

          {/* Year */}
          <div>
            <label className="label text-xs">Year</label>
            <select
              value={filters.year}
              onChange={(e) => changeFilter("year", e.target.value)}
              className="input py-1.5 text-sm"
            >
              <option value="">All years</option>
              {years.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </div>

          {/* City */}
          <div>
            <label className="label text-xs">City</label>
            <input
              type="text"
              placeholder="e.g. Tehran"
              value={filters.city}
              onChange={(e) => changeFilter("city", e.target.value)}
              className="input py-1.5 text-sm"
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-[rgb(var(--border))]">
          <button onClick={clearAll} className="btn-outline btn-sm">
            Clear All
          </button>
          <button onClick={closeFilters} className="btn-primary btn-sm">
            Apply Filters
          </button>
        </div>
      </div>
    );
  }, [
    showFilters,
    filters,
    changeFilter,
    clearAll,
    closeFilters,
    fuelTypes,
    gearboxTypes,
    years,
  ]);

  // ===== Error state =====
  if (error) {
    return (
      <div className="bg-[rgb(var(--background))] py-8">
        <div className="container-custom text-center py-20">
          <p className="text-red-500">❌ Failed to load vehicles</p>
          <button onClick={() => refetch()} className="btn-primary mt-4">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // ===== Render =====
  return (
    <div className="bg-[rgb(var(--background))] py-8">
      <div className="container-custom">
        {/* ===== Header & Search ===== */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold font-heading">🚗 All Vehicles</h1>
            <p className="text-sm text-[rgb(var(--muted-foreground))] mt-1">
              {carsCount} vehicles found
            </p>
          </div>

          <form onSubmit={handleSearch} className="flex w-full sm:w-auto gap-2">
            <div className="relative flex-1 sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[rgb(var(--muted-foreground))]" />
              <input
                type="text"
                placeholder="Search by brand or model..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="input pl-9 py-2 text-sm"
              />
            </div>
            <button type="submit" className="btn-primary btn-sm">
              Search
            </button>
          </form>
        </div>

        {/* ===== Filter Bar ===== */}
        <div className="flex flex-wrap items-center gap-2 mb-6">
          <button
            onClick={toggleFilters}
            className="btn-outline btn-sm flex items-center gap-1"
          >
            <Filter className="w-4 h-4" />
            Filters
            <ChevronDown
              className={`w-4 h-4 transition-transform ${
                showFilters ? "rotate-180" : ""
              }`}
            />
          </button>

          <select
            value={filters.ordering}
            onChange={(e) => changeFilter("ordering", e.target.value)}
            className="input py-1.5 text-sm w-auto min-w-[140px]"
          >
            {orderOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>

          {hasFilters && (
            <button
              onClick={clearAll}
              className="text-sm text-red-500 hover:text-red-600 flex items-center gap-1"
            >
              <X className="w-4 h-4" />
              Clear all
            </button>
          )}
        </div>

        {/* ===== Filter Panel ===== */}
        {filterPanel}

        {/* ===== Vehicles Grid ===== */}
        {isLoading ? (
          <Loading />
        ) : cars.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🚗</div>
            <h3 className="text-xl font-semibold mb-2">No vehicles found</h3>
            <p className="text-[rgb(var(--muted-foreground))]">
              Try adjusting your filters or search term
            </p>
            {hasFilters && (
              <button onClick={clearAll} className="btn-primary mt-4">
                Clear filters
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {cars.map((car) => (
              <VehicleCard key={car.id} car={car} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
});

VehiclesPage.displayName = "VehiclesPage";
export default VehiclesPage;
