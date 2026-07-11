"use client";

import { useState, useEffect, Suspense } from "react";
import { Search, Filter, X, ChevronDown } from "lucide-react";
import VehicleCard from "../../components/vehicles/VehicleCard";
import { vehiclesService } from "../../services/vehicles.service";

// ===== Loading =====
function Loading() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {[...Array(8)].map((_, i) => (
        <div key={i} className="card p-4 animate-pulse">
          <div className="w-full h-48 bg-gray-200 rounded-lg"></div>
          <div className="h-4 bg-gray-200 rounded mt-3 w-3/4"></div>
        </div>
      ))}
    </div>
  );
}

// ===== محتوای اصلی =====
function VehiclesContent() {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  // ===== فیلترها =====
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

  // ===== گرفتن ماشین‌ها =====
  const fetchCars = async (extra = {}) => {
    setLoading(true);
    try {
      const allFilters = { ...filters, ...extra };
      const clean = Object.fromEntries(
        Object.entries(allFilters).filter(([_, v]) => v !== ""),
      );
      const data = await vehiclesService.getAllCars(clean);
      setCars(data.results || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // ===== بار اول =====
  useEffect(() => {
    fetchCars();
  }, []);

  // ===== تغییر فیلتر =====
  const changeFilter = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    fetchCars(newFilters);
  };

  // ===== پاک کردن همه =====
  const clearAll = () => {
    const empty = {
      brand: "",
      min_price: "",
      max_price: "",
      fuel_type: "",
      year: "",
      gearbox: "",
      city: "",
      ordering: "",
    };
    setFilters(empty);
    setSearch("");
    setShowFilters(false);
    fetchCars(empty);
  };

  // ===== جستجو =====
  const handleSearch = (e) => {
    e.preventDefault();
    fetchCars({ ...filters, search });
  };

  const hasFilters = Object.values(filters).some((v) => v !== "");

  // ===== گزینه‌ها =====
  const fuelTypes = ["gasoline", "diesel", "electric", "hybrid"];
  const gearboxTypes = ["manual", "automatic", "cvt"];
  const years = [2025, 2024, 2023, 2022, 2021, 2020];
  const orderOptions = [
    { value: "", label: "Default" },
    { value: "-price", label: "Most Expensive" },
    { value: "price", label: "Cheapest" },
    { value: "-year", label: "Newest" },
  ];

  return (
    <div className="bg-[rgb(var(--background))] py-8">
      <div className="container-custom">
        {/* ===== هدر و جستجو ===== */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold">🚗 All Vehicles</h1>
            <p className="text-sm text-gray-500">{cars.length} found</p>
          </div>

          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="input pl-9 py-2 text-sm w-48"
              />
            </div>
            <button type="submit" className="btn-primary btn-sm">
              Search
            </button>
          </form>
        </div>

        {/* ===== نوار فیلتر ===== */}
        <div className="flex flex-wrap items-center gap-2 mb-6">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="btn-outline btn-sm flex items-center gap-1"
          >
            <Filter className="w-4 h-4" /> Filters
            <ChevronDown
              className={`w-4 h-4 transition ${showFilters ? "rotate-180" : ""}`}
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
              className="text-sm text-red-500 flex items-center gap-1"
            >
              <X className="w-4 h-4" /> Clear all
            </button>
          )}
        </div>

        {/* ===== پنل فیلتر ===== */}
        {showFilters && (
          <div className="card p-4 md:p-6 mb-6 relative">
            <button
              onClick={() => setShowFilters(false)}
              className="absolute top-3 right-3 p-1.5 rounded-lg hover:bg-gray-100"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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

              <div>
                <label className="label text-xs">Fuel Type</label>
                <select
                  value={filters.fuel_type}
                  onChange={(e) => changeFilter("fuel_type", e.target.value)}
                  className="input py-1.5 text-sm"
                >
                  <option value="">All fuels</option>
                  {fuelTypes.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="label text-xs">Gearbox</label>
                <select
                  value={filters.gearbox}
                  onChange={(e) => changeFilter("gearbox", e.target.value)}
                  className="input py-1.5 text-sm"
                >
                  <option value="">All types</option>
                  {gearboxTypes.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>

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

            <div className="flex justify-end gap-3 mt-4 pt-4 border-t">
              <button onClick={clearAll} className="btn-outline btn-sm">
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

        {/* ===== لیست ماشین‌ها با Suspense ===== */}
        <Suspense fallback={<Loading />}>
          {loading ? (
            <Loading />
          ) : cars.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">🚗</div>
              <h3 className="text-xl font-semibold mb-2">No vehicles found</h3>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {cars.map((car) => (
                <VehicleCard key={car.id} car={car} />
              ))}
            </div>
          )}
        </Suspense>
      </div>
    </div>
  );
}

// ===== خروجی اصلی با Suspense =====
export default function VehiclesPage() {
  return (
    <Suspense fallback={<Loading />}>
      <VehiclesContent />
    </Suspense>
  );
}
