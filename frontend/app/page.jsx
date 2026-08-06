// app/page.jsx
// ============================================
// 📦 Imports
// ============================================
import Link from "next/link";
import {
  Car,
  Shield,
  Headphones,
  ThumbsUp,
  ArrowRight,
  Star,
} from "lucide-react";
import { vehiclesService } from "../services/vehicles.service";
import SearchBox from "../components/SearchBox";
import VehicleCard from "../components/vehicles/VehicleCard";

// ============================================
// 📦 Metadata for SEO
// ============================================
export const metadata = {
  title: "CarMarket - Find Your Dream Car in Europe & USA",
  description:
    "Browse thousands of new and used cars from trusted sellers across Europe and USA. Buy or sell your car easily.",
  keywords: "car market, buy car, sell car, europe cars, usa cars,二手车",
  openGraph: {
    title: "CarMarket - Find Your Dream Car",
    description:
      "Browse thousands of new and used cars from trusted sellers across Europe and USA.",
    images: ["/og-image.jpg"],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "CarMarket - Find Your Dream Car",
    description:
      "Browse thousands of new and used cars from trusted sellers across Europe and USA.",
    images: ["/og-image.jpg"],
  },
};

// ============================================
// 📦 Data fetching in Server Component
// ============================================
async function getFeaturedVehicles() {
  try {
    const data = await vehiclesService.getAllCars({
      limit: 3,
      ordering: "-created_at",
    });
    return data.results || data || [];
  } catch (error) {
    console.error("Error fetching vehicles:", error);
    return [];
  }
}

// ============================================
// 🏠 Home Page (Server Component)
// ============================================
export default async function HomePage() {
  // Fetch data on the server side
  const featuredVehicles = await getFeaturedVehicles();

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
  // Price ranges
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
  // Stats data
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

            {/* Right Side - Search Box (Client Component) */}
            <SearchBox countries={countries} priceRanges={priceRanges} />
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

          {featuredVehicles.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-4xl mb-4">🚗</div>
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
            {testimonials.map((testimonial, index) => (
              <div key={index} className="card p-6">
                <div className="flex gap-1 text-yellow-500 mb-3">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-500" />
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
            ))}
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
