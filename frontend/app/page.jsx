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
  Heart,
  ChevronDown,
  X,
} from "lucide-react";
import { vehiclesService } from "../services/vehicles.service";
import { formatPrice, formatMileage } from "../helpers/format";

// ============================================
// 🏠 Home Page
// ============================================
export default function HomePage() {
  const router = useRouter();
  const [featuredVehicles, setFeaturedVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [priceRange, setPriceRange] = useState("");
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  // ============================================
  // Countries and Cities data (Europe + USA)
  // ============================================
  const countries = [
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
  // Price ranges (with higher values)
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
    { value: "300000", label: "Under $300,000" },
    { value: "500000", label: "Under $500,000" },
    { value: "1000000", label: "Under $1,000,000" },
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
  // Clear filters
  // ============================================
  const clearFilters = () => {
    setSelectedCountry("");
    setSelectedCity("");
    setPriceRange("");
    setSearchQuery("");
  };

  // ============================================
  // Stats
  // ============================================
  const stats = [
    { label: "Total Vehicles", value: "12,847+", icon: Car },
    { label: "Happy Buyers", value: "8,523+", icon: ThumbsUp },
    { label: "Trusted Sellers", value: "3,214+", icon: Shield },
  ];

  // ============================================
  // Features data
  // ============================================
  const features = [
    {
      icon: Shield,
      title: "Secure Transactions",
      description:
        "All transactions are protected and verified across Europe and USA.",
      country: "EU & USA",
    },
    {
      icon: Headphones,
      title: "24/7 Support",
      description:
        "Our multilingual team is always here to help you in any timezone.",
      country: "Global",
    },
    {
      icon: Car,
      title: "Wide Selection",
      description:
        "Thousands of vehicles from trusted sellers across 12+ countries.",
      country: "12+ Countries",
    },
  ];

  // ============================================
  // Testimonials data
  // ============================================
  const testimonials = [
    {
      name: "Ali Rezaei",
      role: "Car Buyer",
      text: "Found my dream car in just 3 days! Amazing platform with great selection.",
      rating: 5,
      country: "Germany",
    },
    {
      name: "Sara Mohammadi",
      role: "Car Seller",
      text: "Sold my car within a week. The European market is huge here!",
      rating: 5,
      country: "USA",
    },
    {
      name: "Mehdi Karimi",
      role: "Car Buyer",
      text: "Best car marketplace in Europe. Great experience with international sellers.",
      rating: 5,
      country: "UK",
    },
  ];

  return (
    <div className="min-h-screen bg-[rgb(var(--background))]">
      {/* ===== Hero Section ===== */}
      <section className="relative bg-gradient-to-r from-primary-500/20 to-accent-500/20 py-16 md:py-24">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
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
              <div className="flex flex-wrap gap-8 mt-8">
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
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">🔍 Search Cars</h3>
                {(selectedCountry ||
                  selectedCity ||
                  priceRange ||
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

                {/* Country & City - 2 columns with fixed height */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="relative">
                    <select
                      value={selectedCountry}
                      onChange={(e) => {
                        setSelectedCountry(e.target.value);
                        setSelectedCity("");
                      }}
                      className="w-full p-3 pr-8 border border-[rgb(var(--border))] rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-[rgb(var(--background))] text-sm appearance-none"
                      style={{ maxHeight: "48px" }}
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
                      style={{ maxHeight: "48px" }}
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

                {/* Price Range - fixed height */}
                <div className="relative">
                  <select
                    value={priceRange}
                    onChange={(e) => setPriceRange(e.target.value)}
                    className="w-full p-3 pr-8 border border-[rgb(var(--border))] rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-[rgb(var(--background))] text-sm appearance-none"
                    style={{ maxHeight: "48px" }}
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

                {/* Selected filters tags */}
                {(selectedCountry || selectedCity || priceRange) && (
                  <div className="flex flex-wrap gap-2 pt-1">
                    {selectedCountry && (
                      <span className="inline-flex items-center gap-1 bg-primary-500/10 text-primary-500 text-xs px-2 py-1 rounded-full">
                        {
                          countries.find((c) => c.value === selectedCountry)
                            ?.label
                        }
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
                  </div>
                )}

                <button type="submit" className="btn-primary w-full">
                  <Search className="w-4 h-4 mr-2" />
                  Search Cars
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* ===== Featured Vehicles ===== */}
      <section className="py-16">
        <div className="container-custom">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-3xl font-bold font-heading">
                🚗 Featured Vehicles
              </h2>
              <p className="text-[rgb(var(--muted-foreground))] mt-1">
                The latest and most popular cars from Europe and USA
              </p>
            </div>
            <Link href="/vehicles">
              <button className="text-primary-500 hover:underline flex items-center gap-1">
                View All
                <ArrowRight className="w-4 h-4" />
              </button>
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="card p-4 animate-pulse">
                  <div className="h-48 bg-[rgb(var(--muted))] rounded-lg"></div>
                  <div className="h-4 bg-[rgb(var(--muted))] rounded mt-3 w-3/4"></div>
                  <div className="h-4 bg-[rgb(var(--muted))] rounded mt-2 w-1/2"></div>
                </div>
              ))}
            </div>
          ) : featuredVehicles.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-[rgb(var(--muted-foreground))]">
                No vehicles available at the moment.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredVehicles.map((vehicle) => (
                <VehicleCard key={vehicle.id} vehicle={vehicle} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ===== Features Section ===== */}
      <section className="py-16 bg-[rgb(var(--muted))]">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold font-heading">
              Why Choose CarMarket?
            </h2>
            <p className="text-[rgb(var(--muted-foreground))] mt-2">
              We make buying and selling cars easy and secure across Europe and
              USA
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="card p-6 text-center hover:shadow-lg transition-shadow"
                >
                  <div className="w-16 h-16 mx-auto rounded-full bg-primary-500/10 flex items-center justify-center">
                    <Icon className="w-8 h-8 text-primary-500" />
                  </div>
                  <h3 className="text-xl font-semibold mt-4">
                    {feature.title}
                  </h3>
                  <p className="text-[rgb(var(--muted-foreground))] mt-2">
                    {feature.description}
                  </p>
                  <span className="inline-block mt-3 text-xs bg-primary-500/10 text-primary-500 px-3 py-1 rounded-full">
                    {feature.country}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===== Testimonials ===== */}
      <section className="py-16">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold font-heading">
              ⭐ What Our Users Say
            </h2>
            <p className="text-[rgb(var(--muted-foreground))] mt-2">
              Real experiences from real people across Europe and USA
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => {
              const StarIcon = Star;
              return (
                <div key={index} className="card p-6">
                  <div className="flex gap-1 text-yellow-500 mb-3">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <StarIcon key={i} className="w-4 h-4 fill-yellow-500" />
                    ))}
                  </div>
                  <p className="text-[rgb(var(--foreground))]">
                    "{testimonial.text}"
                  </p>
                  <div className="mt-4">
                    <p className="font-semibold">{testimonial.name}</p>
                    <p className="text-sm text-[rgb(var(--muted-foreground))]">
                      {testimonial.role} • {testimonial.country}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===== CTA Section ===== */}
      <section className="py-16 bg-gradient-to-r from-primary-500 to-accent-500 text-white">
        <div className="container-custom text-center">
          <h2 className="text-3xl md:text-4xl font-bold font-heading">
            Ready to Buy or Sell Your Car?
          </h2>
          <p className="text-white/80 text-lg mt-4 max-w-2xl mx-auto">
            Join thousands of happy users across Europe and USA and start your
            car journey today.
          </p>
          <div className="flex flex-wrap justify-center gap-4 mt-8">
            <Link href="/vehicles">
              <button className="bg-white text-primary-500 px-8 py-3 rounded-lg font-semibold hover:bg-white/90 transition-all hover:scale-105">
                Browse Cars
              </button>
            </Link>
            <Link href="/dashboard/add-vehicle">
              <button className="border-2 border-white px-8 py-3 rounded-lg font-semibold hover:bg-white/10 transition-all hover:scale-105">
                Sell Your Car
              </button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

// ============================================
// 🚗 VehicleCard Component
// ============================================
const VehicleCard = ({ vehicle }) => {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/vehicles/${vehicle.id}`);
  };

  return (
    <div
      onClick={handleClick}
      className="card overflow-hidden cursor-pointer hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
    >
      <div className="relative h-48 bg-[rgb(var(--muted))]">
        {vehicle.image ? (
          <Image
            src={vehicle.image}
            alt={vehicle.title || vehicle.model}
            fill
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-4xl text-[rgb(var(--muted-foreground))]">
            🚗
          </div>
        )}
        <div className="absolute top-2 right-2">
          <Heart className="w-5 h-5 text-white/70 hover:text-red-500 transition-colors cursor-pointer" />
        </div>
        {vehicle.country && (
          <div className="absolute top-2 left-2 bg-black/60 text-white text-xs px-2 py-1 rounded">
            {vehicle.country}
          </div>
        )}
      </div>

      <div className="p-4">
        <h3 className="font-semibold text-lg truncate">
          {vehicle.title || `${vehicle.brand} ${vehicle.model}`}
        </h3>
        <p className="text-xl font-bold text-primary-500 mt-1">
          {formatPrice(vehicle.price)}
        </p>

        <div className="grid grid-cols-2 gap-2 mt-3 text-sm text-[rgb(var(--muted-foreground))]">
          <div className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" />
            <span>{vehicle.year || "N/A"}</span>
          </div>
          <div className="flex items-center gap-1">
            <Gauge className="w-3.5 h-3.5" />
            <span>{formatMileage(vehicle.mileage)} km</span>
          </div>
          <div className="flex items-center gap-1">
            <Fuel className="w-3.5 h-3.5" />
            <span>{vehicle.fuel_type || "N/A"}</span>
          </div>
          <div className="flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5" />
            <span>{vehicle.city || vehicle.country || "N/A"}</span>
          </div>
        </div>

        <div className="flex items-center justify-between mt-4 pt-3 border-t border-[rgb(var(--border))]">
          <span className="text-xs text-[rgb(var(--muted-foreground))]">
            {vehicle.status === "active" ? (
              <span className="text-green-500">✅ Available</span>
            ) : (
              <span className="text-red-500">❌ Sold</span>
            )}
          </span>
          <button className="text-primary-500 hover:text-primary-600 transition-colors">
            View Details →
          </button>
        </div>
      </div>
    </div>
  );
};

// ============================================
// ⭐ Star Component for Testimonials
// ============================================
const Star = ({ className }) => {
  return <span className={className}>★</span>;
};
