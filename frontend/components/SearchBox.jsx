"use client";

// ============================================
// 📦 Imports
// ============================================
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, ChevronDown, X } from "lucide-react";

// ============================================
// 🔍 SearchBox Component
// ============================================
const SearchBox = ({ countries, priceRanges }) => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [priceRange, setPriceRange] = useState("");
  const [priceMin, setPriceMin] = useState("");
  const [priceMax, setPriceMax] = useState("");

  // ============================================
  // Get cities based on selected country
  // ============================================
  const getCities = () => {
    const country = countries.find((c) => c.value === selectedCountry);
    return country ? country.cities : [];
  };

  // ============================================
  // Clear all filters
  // ============================================
  const clearFilters = () => {
    setSelectedCountry("");
    setSelectedCity("");
    setPriceRange("");
    setPriceMin("");
    setPriceMax("");
    setSearchQuery("");
  };

  // ============================================
  // Handle search form submission
  // ============================================
  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();

    // ✅ فیلترهای پشتیبانی شده توسط بک‌اند
    if (searchQuery) params.append("search", searchQuery);
    if (selectedCity) params.append("city", selectedCity);

    // ✅ رنج قیمتی
    if (priceMin) params.append("price_min", priceMin);
    if (priceMax) params.append("price_max", priceMax);

    // ✅ اگر از dropdown انتخاب شده بود
    if (priceRange) params.append("price_max", priceRange);

    router.push(`/vehicles?${params.toString()}`);
  };

  // ============================================
  // 🎨 Render
  // ============================================
  return (
    <div className="card p-6 md:p-8 shadow-xl">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold">🔍 Search Cars</h3>
        {(selectedCountry ||
          selectedCity ||
          priceRange ||
          priceMin ||
          priceMax ||
          searchQuery) && (
          <button
            onClick={clearFilters}
            className="text-sm text-red-500 hover:text-red-600 flex items-center gap-1"
          >
            <X className="w-4 h-4" />
            Clear All
          </button>
        )}
      </div>

      <form onSubmit={handleSearch} className="space-y-3">
        {/* Search Input */}
        <input
          type="text"
          placeholder="Search by brand, model, or keyword..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full p-3 border border-[rgb(var(--border))] rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-[rgb(var(--background))] text-sm"
        />

        {/* Country & City - 2 columns */}
        <div className="grid grid-cols-2 gap-3">
          <div className="relative">
            <select
              value={selectedCountry}
              onChange={(e) => {
                setSelectedCountry(e.target.value);
                setSelectedCity("");
              }}
              className="w-full p-3 pr-8 border border-[rgb(var(--border))] rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-[rgb(var(--background))] text-sm appearance-none"
            >
              <option value="">Select Country</option>
              {countries.map((country) => (
                <option key={country.value} value={country.value}>
                  {country.label}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[rgb(var(--muted-foreground))] pointer-events-none" />
          </div>

          <div className="relative">
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="w-full p-3 pr-8 border border-[rgb(var(--border))] rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-[rgb(var(--background))] text-sm appearance-none disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={!selectedCountry}
            >
              <option value="">Select City</option>
              {getCities().map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[rgb(var(--muted-foreground))] pointer-events-none" />
          </div>
        </div>

        {/* Price Range - Dropdown */}
        <div className="relative">
          <select
            value={priceRange}
            onChange={(e) => {
              setPriceRange(e.target.value);
              if (e.target.value) {
                setPriceMax(e.target.value);
                setPriceMin("");
              } else {
                setPriceMax("");
              }
            }}
            className="w-full p-3 pr-8 border border-[rgb(var(--border))] rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-[rgb(var(--background))] text-sm appearance-none"
          >
            <option value="">Select Price Range</option>
            {priceRanges.map((range) => (
              <option key={range.value} value={range.value}>
                {range.label}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[rgb(var(--muted-foreground))] pointer-events-none" />
        </div>

        {/* Custom Price Range - Min & Max */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-[rgb(var(--muted-foreground))] mb-1">
              Min Price ($)
            </label>
            <input
              type="number"
              placeholder="e.g. 10000"
              value={priceMin}
              onChange={(e) => {
                setPriceMin(e.target.value);
                if (e.target.value) setPriceRange("");
              }}
              className="w-full p-3 border border-[rgb(var(--border))] rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-[rgb(var(--background))] text-sm"
              min="0"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-[rgb(var(--muted-foreground))] mb-1">
              Max Price ($)
            </label>
            <input
              type="number"
              placeholder="e.g. 50000"
              value={priceMax}
              onChange={(e) => {
                setPriceMax(e.target.value);
                if (e.target.value) setPriceRange("");
              }}
              className="w-full p-3 border border-[rgb(var(--border))] rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-[rgb(var(--background))] text-sm"
              min="0"
            />
          </div>
        </div>

        {/* Selected filters tags */}
        {(selectedCountry ||
          selectedCity ||
          priceRange ||
          priceMin ||
          priceMax) && (
          <div className="flex flex-wrap gap-2 pt-1">
            {selectedCountry && (
              <span className="inline-flex items-center gap-1 bg-primary-500/10 text-primary-500 text-xs px-2 py-1 rounded-full">
                {countries.find((c) => c.value === selectedCountry)?.label}
                <button
                  type="button"
                  onClick={() => setSelectedCountry("")}
                  className="hover:text-red-500"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {selectedCity && (
              <span className="inline-flex items-center gap-1 bg-primary-500/10 text-primary-500 text-xs px-2 py-1 rounded-full">
                {selectedCity}
                <button
                  type="button"
                  onClick={() => setSelectedCity("")}
                  className="hover:text-red-500"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {priceRange && (
              <span className="inline-flex items-center gap-1 bg-primary-500/10 text-primary-500 text-xs px-2 py-1 rounded-full">
                {priceRanges.find((p) => p.value === priceRange)?.label}
                <button
                  type="button"
                  onClick={() => setPriceRange("")}
                  className="hover:text-red-500"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {priceMin && (
              <span className="inline-flex items-center gap-1 bg-primary-500/10 text-primary-500 text-xs px-2 py-1 rounded-full">
                Min: ${parseInt(priceMin).toLocaleString()}
                <button
                  type="button"
                  onClick={() => setPriceMin("")}
                  className="hover:text-red-500"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {priceMax && (
              <span className="inline-flex items-center gap-1 bg-primary-500/10 text-primary-500 text-xs px-2 py-1 rounded-full">
                Max: ${parseInt(priceMax).toLocaleString()}
                <button
                  type="button"
                  onClick={() => setPriceMax("")}
                  className="hover:text-red-500"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
          </div>
        )}

        <button type="submit" className="btn-primary w-full">
          <Search className="w-4 h-4 mr-2" />
          Search Cars
        </button>
      </form>
    </div>
  );
};

export default SearchBox;
