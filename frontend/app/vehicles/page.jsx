// app/vehicles/page.jsx
"use client";

import { useState, useEffect } from "react";
import { Search, Filter, X, ChevronDown } from "lucide-react";
import VehicleCard from "../../components/vehicles/VehicleCard";
import { vehiclesService } from "../../services/vehicles.service";

export default function VehiclesPage() {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  // ===== Filter states =====
  const [filters, setFilters] = useState({
    brand: "",
    min_price: "",
    max_price: "",
    fuel_type: "",
    year: "",
    gearbox: "",
    city: "",
    ordering: "",
  });

  // ===== Available filter options =====
  const fuelTypes = ["gasoline", "diesel", "electric", "hybrid"];
  const gearboxTypes = ["manual", "automatic", "cvt"];
  const years = [2025, 2024, 2023, 2022, 2021, 2020, 2019, 2018];
  const orderOptions = [
    { value: "", label: "Default" },
    { value: "-price", label: "Most Expensive" },
    { value: "price", label: "Cheapest" },
    { value: "-year", label: "Newest" },
    { value: "year", label: "Oldest" },
  ];

  // ===== Fetch cars with filters =====
  const fetchCars = async (filterParams = {}) => {
    setLoading(true);
    try {
      // Remove empty filters
      const cleanFilters = Object.fromEntries(
        Object.entries(filterParams).filter(
          ([_, value]) => value !== "" && value !== null && value !== undefined,
        ),
      );

      const data = await vehiclesService.getAllCars(cleanFilters);
      setCars(data.results || []);
    } catch (error) {
      console.error("Error fetching cars:", error);
    } finally {
      setLoading(false);
    }
  };

  // ===== Initial fetch =====
  useEffect(() => {
    fetchCars();
  }, []);

  // ===== Handle search =====
  const handleSearch = (e) => {
    e.preventDefault();
    fetchCars({ ...filters, search: searchTerm });
  };

  // ===== Handle filter change - instantly applies =====
  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    fetchCars(newFilters);
  };

  // ===== Clear all filters =====
  const clearFilters = () => {
    const emptyFilters = {
      brand: "",
      min_price: "",
      max_price: "",
      fuel_type: "",
      year: "",
      gearbox: "",
      city: "",
      ordering: "",
    };
    setFilters(emptyFilters);
    setSearchTerm("");
    setShowFilters(false);
    fetchCars(emptyFilters);
  };

  // ===== Check if any filter is active =====
  const hasActiveFilters = Object.values(filters).some((v) => v !== "");

  return (
    <div className="min-h-[calc(100vh-80px)] bg-[rgb(var(--background))] py-8">
      <div className="container-custom">
        {/* ===== Header ===== */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold font-heading">
              🚗 All Vehicles
            </h1>
            <p className="text-sm text-[rgb(var(--muted-foreground))] mt-1">
              {cars.length} vehicles found
            </p>
          </div>

          {/* ===== Search Bar ===== */}
          <form onSubmit={handleSearch} className="flex w-full sm:w-auto gap-2">
            <div className="relative flex-1 sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[rgb(var(--muted-foreground))]" />
              <input
                type="text"
                placeholder="Search by brand or model..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
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
          {/* Toggle filters button */}
          <button
            onClick={() => setShowFilters(!showFilters)}
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

          {/* Order by */}
          <select
            value={filters.ordering}
            onChange={(e) => handleFilterChange("ordering", e.target.value)}
            className="input py-1.5 text-sm w-auto min-w-[140px]"
          >
            {orderOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>

          {/* Active filters count */}
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="text-sm text-red-500 hover:text-red-600 flex items-center gap-1"
            >
              <X className="w-4 h-4" />
              Clear all
            </button>
          )}
        </div>

        {/* ===== Filter Panel ===== */}
        {showFilters && (
          <div className="card p-4 md:p-6 mb-6 relative">
            {/* Close button */}
            <button
              onClick={() => setShowFilters(false)}
              className="absolute top-3 right-3 p-1.5 rounded-lg hover:bg-[rgb(var(--muted))] transition"
            >
              <X className="w-5 h-5 text-[rgb(var(--muted-foreground))]" />
            </button>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-fade-in">
              {/* Brand */}
              <div>
                <label className="label text-xs">Brand</label>
                <input
                  type="text"
                  placeholder="e.g. Toyota"
                  value={filters.brand}
                  onChange={(e) => handleFilterChange("brand", e.target.value)}
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
                  onChange={(e) =>
                    handleFilterChange("min_price", e.target.value)
                  }
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
                  onChange={(e) =>
                    handleFilterChange("max_price", e.target.value)
                  }
                  className="input py-1.5 text-sm"
                />
              </div>

              {/* Fuel Type */}
              <div>
                <label className="label text-xs">Fuel Type</label>
                <select
                  value={filters.fuel_type}
                  onChange={(e) =>
                    handleFilterChange("fuel_type", e.target.value)
                  }
                  className="input py-1.5 text-sm"
                >
                  <option value="">All fuels</option>
                  {fuelTypes.map((type) => (
                    <option key={type} value={type}>
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              {/* Gearbox */}
              <div>
                <label className="label text-xs">Gearbox</label>
                <select
                  value={filters.gearbox}
                  onChange={(e) =>
                    handleFilterChange("gearbox", e.target.value)
                  }
                  className="input py-1.5 text-sm"
                >
                  <option value="">All types</option>
                  {gearboxTypes.map((type) => (
                    <option key={type} value={type}>
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              {/* Year */}
              <div>
                <label className="label text-xs">Year</label>
                <select
                  value={filters.year}
                  onChange={(e) => handleFilterChange("year", e.target.value)}
                  className="input py-1.5 text-sm"
                >
                  <option value="">All years</option>
                  {years.map((year) => (
                    <option key={year} value={year}>
                      {year}
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
                  onChange={(e) => handleFilterChange("city", e.target.value)}
                  className="input py-1.5 text-sm"
                />
              </div>
            </div>

            {/* Filter Actions */}
            <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-[rgb(var(--border))]">
              <button onClick={clearFilters} className="btn-outline btn-sm">
                Clear All
              </button>
              <button
                onClick={() => setShowFilters(false)}
                className="btn-primary btn-sm"
              >
                Apply Filters
              </button>
            </div>
          </div>
        )}

        {/* ===== Vehicles Grid ===== */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="spinner"></div>
          </div>
        ) : cars.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🚗</div>
            <h3 className="text-xl font-semibold mb-2">No vehicles found</h3>
            <p className="text-[rgb(var(--muted-foreground))]">
              Try adjusting your filters or search term
            </p>
            {hasActiveFilters && (
              <button onClick={clearFilters} className="btn-primary mt-4">
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
}
