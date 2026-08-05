"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Search,
  Car,
  Shield,
  Headphones,
  ThumbsUp,
  ArrowRight,
  MapPin,
  Calendar,
  Gauge,
  Fuel,
  Settings as SettingsIcon,
  Heart,
} from "lucide-react";
import { vehiclesService } from "../services/vehicles.service";
import { formatPrice, formatMileage } from "../helpers/format";
import toast from "react-hot-toast";

// ============================================
// 🏠 Home Page - Part 1: Hero Section
// ============================================
export default function HomePage() {
  const router = useRouter();
  const [featuredVehicles, setFeaturedVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [priceRange, setPriceRange] = useState("");

  // ============================================
  // Countries and Cities data (Europe + USA)
  // ============================================
  const countries = [
    // Europe
    {
      value: "germany",
      label: "Germany",
      cities: ["Berlin", "Munich", "Hamburg", "Frankfurt", "Cologne"],
    },
    {
      value: "uk",
      label: "United Kingdom",
      cities: ["London", "Manchester", "Birmingham", "Liverpool", "Edinburgh"],
    },
    {
      value: "france",
      label: "France",
      cities: ["Paris", "Marseille", "Lyon", "Toulouse", "Nice"],
    },
    {
      value: "italy",
      label: "Italy",
      cities: ["Rome", "Milan", "Naples", "Turin", "Florence"],
    },
    {
      value: "spain",
      label: "Spain",
      cities: ["Madrid", "Barcelona", "Valencia", "Seville", "Zaragoza"],
    },
    {
      value: "netherlands",
      label: "Netherlands",
      cities: ["Amsterdam", "Rotterdam", "Utrecht", "The Hague", "Eindhoven"],
    },
    {
      value: "switzerland",
      label: "Switzerland",
      cities: ["Zurich", "Geneva", "Basel", "Bern", "Lausanne"],
    },
    {
      value: "sweden",
      label: "Sweden",
      cities: ["Stockholm", "Gothenburg", "Malmo", "Uppsala", "Vasteras"],
    },
    {
      value: "norway",
      label: "Norway",
      cities: ["Oslo", "Bergen", "Trondheim", "Stavanger", "Drammen"],
    },
    {
      value: "denmark",
      label: "Denmark",
      cities: ["Copenhagen", "Aarhus", "Odense", "Aalborg", "Esbjerg"],
    },
    {
      value: "belgium",
      label: "Belgium",
      cities: ["Brussels", "Antwerp", "Ghent", "Charleroi", "Liege"],
    },
    {
      value: "austria",
      label: "Austria",
      cities: ["Vienna", "Graz", "Linz", "Salzburg", "Innsbruck"],
    },
    // USA
    {
      value: "usa",
      label: "USA",
      cities: [
        "New York",
        "Los Angeles",
        "Chicago",
        "Houston",
        "Phoenix",
        "Philadelphia",
        "San Antonio",
        "San Diego",
        "Dallas",
        "Austin",
      ],
    },
  ];

  // ============================================
  // Price ranges (in USD/EUR)
  // ============================================
  const priceRanges = [
    { value: "5000", label: "Under $5,000" },
    { value: "10000", label: "Under $10,000" },
    { value: "20000", label: "Under $20,000" },
    { value: "30000", label: "Under $30,000" },
    { value: "50000", label: "Under $50,000" },
    { value: "75000", label: "Under $75,000" },
    { value: "100000", label: "Under $100,000" },
    { value: "150000", label: "Under $150,000" },
    { value: "200000", label: "Under $200,000" },
  ];

  // ============================================
  // Get cities based on selected country
  // ============================================
  const getCities = () => {
    const country = countries.find((c) => c.value === selectedCountry);
    return country ? country.cities : [];
  };

  // ============================================
  // Fetch featured vehicles
  // ============================================
  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const data = await vehiclesService.getVehicles({
          limit: 6,
          ordering: "-created_at",
        });
        setFeaturedVehicles(data.results || data || []);
      } catch (error) {
        console.error("Error fetching vehicles:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchVehicles();
  }, []);

  // ============================================
  // Handle search
  // ============================================
  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery) params.append("search", searchQuery);
    if (selectedCountry) params.append("country", selectedCountry);
    if (selectedCity) params.append("city", selectedCity);
    if (priceRange) params.append("price_max", priceRange);

    router.push(`/vehicles?${params.toString()}`);
  };

  // ============================================
  // Stats
  // ============================================
  const stats = [
    { label: "Total Vehicles", value: "12,847+", icon: Car },
    { label: "Happy Buyers", value: "8,523+", icon: ThumbsUp },
    { label: "Trusted Sellers", value: "3,214+", icon: Shield },
  ];

  return (
    <div className="min-h-screen bg-[rgb(var(--background))]">
      {/* ===== Hero Section ===== */}
      <section className="relative bg-gradient-to-r from-primary-500/20 to-accent-500/20 py-16 md:py-24">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Side */}
            <div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-heading leading-tight">
                Find Your Dream
                <span className="text-primary-500"> Car</span> Today
              </h1>
              <p className="text-[rgb(var(--muted-foreground))] text-lg mt-4 max-w-lg">
                Browse thousands of new and used cars from trusted sellers
                across Europe and USA. The easiest way to buy or sell your car.
              </p>

              {/* Stats */}
              <div className="flex gap-8 mt-8">
                {stats.map((stat, index) => {
                  const Icon = stat.icon;
                  return (
                    <div key={index}>
                      <div className="flex items-center gap-2">
                        <Icon className="w-5 h-5 text-primary-500" />
                        <span className="text-2xl font-bold">{stat.value}</span>
                      </div>
                      <p className="text-sm text-[rgb(var(--muted-foreground))]">
                        {stat.label}
                      </p>
                    </div>
                  );
                })}
              </div>

              {/* Quick Actions */}
              <div className="flex flex-wrap gap-4 mt-8">
                <Link href="/vehicles">
                  <button className="btn-primary">
                    Browse Cars
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </button>
                </Link>
                <Link href="/dashboard/add-vehicle">
                  <button className="btn-outline">
                    <Car className="w-4 h-4 mr-2" />
                    Sell Your Car
                  </button>
                </Link>
              </div>
            </div>

            {/* Right Side - Search Box */}
            <div className="card p-6 md:p-8 shadow-xl">
              <h3 className="text-xl font-bold mb-4">🔍 Search Cars</h3>
              <form onSubmit={handleSearch} className="space-y-4">
                <input
                  type="text"
                  placeholder="Search by brand, model, or keyword..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full p-3 border border-[rgb(var(--border))] rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-[rgb(var(--background))]"
                />

                <div className="grid grid-cols-2 gap-3">
                  {/* Country Select */}
                  <select
                    value={selectedCountry}
                    onChange={(e) => {
                      setSelectedCountry(e.target.value);
                      setSelectedCity(""); // Reset city when country changes
                    }}
                    className="p-3 border border-[rgb(var(--border))] rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-[rgb(var(--background))]"
                  >
                    <option value="">Select Country</option>
                    {countries.map((country) => (
                      <option key={country.value} value={country.value}>
                        {country.label}
                      </option>
                    ))}
                  </select>

                  {/* City Select */}
                  <select
                    value={selectedCity}
                    onChange={(e) => setSelectedCity(e.target.value)}
                    className="p-3 border border-[rgb(var(--border))] rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-[rgb(var(--background))]"
                    disabled={!selectedCountry}
                  >
                    <option value="">Select City</option>
                    {getCities().map((city) => (
                      <option key={city} value={city}>
                        {city}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Price Range */}
                <select
                  value={priceRange}
                  onChange={(e) => setPriceRange(e.target.value)}
                  className="w-full p-3 border border-[rgb(var(--border))] rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-[rgb(var(--background))]"
                >
                  <option value="">Select Price Range</option>
                  {priceRanges.map((range) => (
                    <option key={range.value} value={range.value}>
                      {range.label}
                    </option>
                  ))}
                </select>

                <button type="submit" className="btn-primary w-full">
                  <Search className="w-4 h-4 mr-2" />
                  Search Cars
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
