"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Search,
  Filter,
  X,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import VehicleCard from "../../components/vehicles/VehicleCard";
import { vehiclesService } from "../../services/vehicles.service";
import { useDebounce } from "../../hooks/useDebounce";

// ===== Import helpers =====
import {
  FUEL_TYPES,
  GEARBOX_TYPES,
  YEARS,
  ORDER_OPTIONS,
  CITIES,
} from "../../helpers/constants";

// ============================================
// Loading component
// ============================================
const Loading = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
    {[...Array(8)].map((_, i) => (
      <div key={i} className="card p-4 animate-pulse">
        <div className="w-full h-48 bg-gray-200 rounded-lg"></div>
        <div className="h-4 bg-gray-200 rounded mt-3 w-3/4"></div>
        <div className="h-4 bg-gray-200 rounded mt-2 w-1/2"></div>
      </div>
    ))}
  </div>
);

// ============================================
// Initial filter state (Backend supported)
// ============================================
const INITIAL_FILTERS = {
  brand: "",
  price_min: "",
  price_max: "",
  fuel_type: "",
  year_min: "",
  year_max: "",
  gearbox: "",
  city: "",
  ordering: "-created_at",
};

// ============================================
// Main Vehicles Page
// ============================================
export default function VehiclesPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // ===== State =====
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState(INITIAL_FILTERS);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  // ============================================
  // Sync filters with URL params - FIXED
  // ============================================
  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    const urlFilters = { ...INITIAL_FILTERS };

    // Read filters from URL
    Object.keys(urlFilters).forEach((key) => {
      const value = params.get(key);
      if (value) {
        urlFilters[key] = value;
      }
    });

    // Read search from URL
    const searchValue = params.get("search");
    if (searchValue) {
      setSearch(searchValue);
    }

    // Read page from URL
    const page = params.get("page");
    if (page) {
      setCurrentPage(parseInt(page));
    }

    console.log("📥 URL Filters loaded:", JSON.stringify(urlFilters));
    setFilters(urlFilters);

    // ✅ بعد از لود فیلترها از URL، fetch رو اجرا کن
    setIsInitialLoad(true);
  }, [searchParams]);

  // ============================================
  // Update URL when filters change - FIXED
  // ============================================
  const updateURL = useCallback(() => {
    const params = new URLSearchParams();

    // Add search
    if (search) params.set("search", search);

    // Add filters
    Object.keys(filters).forEach((key) => {
      const value = filters[key];
      if (value && value !== "" && value !== "-created_at") {
        params.set(key, value);
      }
    });

    // Add page
    if (currentPage > 1) {
      params.set("page", currentPage.toString());
    }

    const url = `/vehicles?${params.toString()}`;
    console.log("🔄 Updating URL:", url);
    router.replace(url, { scroll: false });
  }, [router, filters, search, currentPage]);

  // ============================================
  // Update URL when filters/search/page change
  // ============================================
  useEffect(() => {
    if (!isInitialLoad) {
      updateURL();
    }
  }, [updateURL, isInitialLoad]);

  // ============================================
  // Debounce search
  // ============================================
  const debouncedSearch = useDebounce(search, 500);

  // ============================================
  // Memoized computed values
  // ============================================
  const hasFilters = useMemo(() => {
    return Object.values(filters).some((v) => v !== "" && v !== "-created_at");
  }, [filters]);

  // ============================================
  // Memoized filter options
  // ============================================
  const fuelTypes = useMemo(() => FUEL_TYPES, []);
  const gearboxTypes = useMemo(() => GEARBOX_TYPES, []);
  const years = useMemo(() => YEARS, []);
  const orderOptions = useMemo(() => ORDER_OPTIONS, []);
  const cities = useMemo(() => CITIES, []);

  // ============================================
  // Build query filters (Backend compatible) - FIXED
  // ============================================
  const buildFilters = useCallback(() => {
    const allFilters = { ...filters };

    // Add search if exists
    if (debouncedSearch) {
      allFilters.search = debouncedSearch;
    }

    console.log("🔍 allFilters BEFORE cleanup:", JSON.stringify(allFilters));

    // Remove empty values (but keep 0)
    const cleanFilters = {};
    Object.keys(allFilters).forEach((key) => {
      const value = allFilters[key];
      if (value !== "" && value !== null && value !== undefined) {
        cleanFilters[key] = value;
      }
    });

    console.log("🔍 cleanFilters AFTER cleanup:", JSON.stringify(cleanFilters));

    // Add pagination
    cleanFilters.limit = 40;
    cleanFilters.offset = (currentPage - 1) * 40;

    return cleanFilters;
  }, [filters, debouncedSearch, currentPage]);

  // ============================================
  // Fetch cars - FIXED
  // ============================================
  const fetchCars = useCallback(async () => {
    setLoading(true);
    try {
      const cleanFilters = buildFilters();
      console.log("🚗 Sending to service:", JSON.stringify(cleanFilters));

      const data = await vehiclesService.getAllCars(cleanFilters);

      console.log("✅ API Response count:", data.count);

      setCars(data.results || []);
      setTotalCount(data.count || 0);
      setTotalPages(Math.ceil((data.count || 0) / 40));
    } catch (err) {
      console.error("❌ Error fetching cars:", err);
      setCars([]);
      setTotalCount(0);
      setTotalPages(1);
    } finally {
      setLoading(false);
      setIsInitialLoad(false);
    }
  }, [buildFilters]);

  // ============================================
  // Fetch on initial load and filter changes
  // ============================================
  useEffect(() => {
    console.log("🔄 Fetching cars... (initialLoad:", isInitialLoad, ")");
    fetchCars();
  }, [fetchCars, isInitialLoad]);

  // ============================================
  // Handlers
  // ============================================
  const changeFilter = useCallback((key, value) => {
    console.log("🔄 Changing filter:", key, "=", value);
    setFilters((prev) => {
      const newFilters = { ...prev, [key]: value };
      console.log("🔄 New filters state:", JSON.stringify(newFilters));
      return newFilters;
    });
    setCurrentPage(1);
  }, []);

  const clearAll = useCallback(() => {
    setFilters(INITIAL_FILTERS);
    setSearch("");
    setShowFilters(false);
    setCurrentPage(1);
  }, []);

  const toggleFilters = useCallback(() => {
    setShowFilters((prev) => !prev);
  }, []);

  const closeFilters = useCallback(() => {
    setShowFilters(false);
  }, []);

  const handlePageChange = useCallback(
    (page) => {
      if (page >= 1 && page <= totalPages) {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    },
    [totalPages],
  );

  // ============================================
  // Memoized filter panel
  // ============================================
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
            <label className="label text-xs">Min Price ($)</label>
            <input
              type="number"
              placeholder="Min price"
              value={filters.price_min}
              onChange={(e) => changeFilter("price_min", e.target.value)}
              className="input py-1.5 text-sm"
            />
          </div>

          {/* Max Price */}
          <div>
            <label className="label text-xs">Max Price ($)</label>
            <input
              type="number"
              placeholder="Max price"
              value={filters.price_max}
              onChange={(e) => changeFilter("price_max", e.target.value)}
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
            <label className="label text-xs">Transmission</label>
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

          {/* Year Min */}
          <div>
            <label className="label text-xs">Year From</label>
            <select
              value={filters.year_min}
              onChange={(e) => changeFilter("year_min", e.target.value)}
              className="input py-1.5 text-sm"
            >
              <option value="">Any</option>
              {years.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </div>

          {/* Year Max */}
          <div>
            <label className="label text-xs">Year To</label>
            <select
              value={filters.year_max}
              onChange={(e) => changeFilter("year_max", e.target.value)}
              className="input py-1.5 text-sm"
            >
              <option value="">Any</option>
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
            <select
              value={filters.city}
              onChange={(e) => changeFilter("city", e.target.value)}
              className="input py-1.5 text-sm"
            >
              <option value="">All Cities</option>
              {cities.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
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
    cities,
  ]);

  // ============================================
  // Pagination component
  // ============================================
  const Pagination = useMemo(() => {
    if (totalPages <= 1) return null;

    const pages = [];
    const maxVisible = 5;
    let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let end = Math.min(totalPages, start + maxVisible - 1);

    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    return (
      <div className="flex justify-center items-center gap-2 mt-8">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`p-2 rounded-lg border transition ${
            currentPage === 1
              ? "opacity-50 cursor-not-allowed"
              : "hover:bg-[rgb(var(--muted))]"
          }`}
          aria-label="Previous page"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {start > 1 && (
          <>
            <button
              onClick={() => handlePageChange(1)}
              className="px-3 py-1 rounded-lg hover:bg-[rgb(var(--muted))] transition"
            >
              1
            </button>
            {start > 2 && <span className="px-2">...</span>}
          </>
        )}

        {pages.map((page) => (
          <button
            key={page}
            onClick={() => handlePageChange(page)}
            className={`px-3 py-1 rounded-lg transition ${
              page === currentPage
                ? "bg-primary-500 text-white"
                : "hover:bg-[rgb(var(--muted))]"
            }`}
          >
            {page}
          </button>
        ))}

        {end < totalPages && (
          <>
            {end < totalPages - 1 && <span className="px-2">...</span>}
            <button
              onClick={() => handlePageChange(totalPages)}
              className="px-3 py-1 rounded-lg hover:bg-[rgb(var(--muted))] transition"
            >
              {totalPages}
            </button>
          </>
        )}

        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`p-2 rounded-lg border transition ${
            currentPage === totalPages
              ? "opacity-50 cursor-not-allowed"
              : "hover:bg-[rgb(var(--muted))]"
          }`}
          aria-label="Next page"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    );
  }, [currentPage, totalPages, handlePageChange]);

  // ============================================
  // Render
  // ============================================
  return (
    <div className="bg-[rgb(var(--background))] py-8">
      <div className="container-custom">
        {/* ===== Header ===== */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold font-heading">🚗 All Vehicles</h1>
            <p className="text-sm text-[rgb(var(--muted-foreground))] mt-1">
              {totalCount} vehicles found
            </p>
          </div>

          {/* ===== Search Bar ===== */}
          <div className="flex w-full sm:w-auto gap-2">
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
          </div>
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
        {loading ? (
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
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {cars.map((car) => (
                <VehicleCard key={car.id} car={car} />
              ))}
            </div>

            {/* ===== Pagination ===== */}
            {Pagination}
          </>
        )}
      </div>
    </div>
  );
}
