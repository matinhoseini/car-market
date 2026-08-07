// ============================================
// 📦 Constants
// ============================================

// ===== Fuel types (Backend supported) =====
export const FUEL_TYPES = [
  { value: "gasoline", label: "Gasoline" },
  { value: "diesel", label: "Diesel" },
  { value: "electric", label: "Electric" },
  { value: "hybrid", label: "Hybrid" },
  { value: "cng", label: "CNG" },
  { value: "lpg", label: "LPG" },
];

// ===== Gearbox types (Backend supported) =====
export const GEARBOX_TYPES = [
  { value: "manual", label: "Manual" },
  { value: "automatic", label: "Automatic" },
  { value: "semi_automatic", label: "Semi-Automatic" },
  { value: "cvt", label: "CVT" },
];

// ===== Years (last 35 years) =====
export const YEARS = (() => {
  const currentYear = new Date().getFullYear();
  const years = [];
  for (let i = 0; i < 35; i++) {
    years.push(currentYear - i);
  }
  return years;
})();

// ===== Order options (Backend supported) =====
export const ORDER_OPTIONS = [
  { value: "-created_at", label: "Newest First" },
  { value: "created_at", label: "Oldest First" },
  { value: "-price", label: "Most Expensive" },
  { value: "price", label: "Cheapest First" },
  { value: "-year", label: "Newest Year" },
  { value: "year", label: "Oldest Year" },
];

// ===== Price ranges (in USD) =====
export const PRICE_RANGES = [
  { value: "", label: "All Prices" },
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

// ===== Cities (Europe + USA) =====
export const CITIES = [
  // Europe
  "Berlin",
  "Munich",
  "Hamburg",
  "Frankfurt",
  "Cologne",
  "London",
  "Manchester",
  "Birmingham",
  "Liverpool",
  "Edinburgh",
  "Paris",
  "Marseille",
  "Lyon",
  "Toulouse",
  "Nice",
  "Rome",
  "Milan",
  "Naples",
  "Turin",
  "Florence",
  "Madrid",
  "Barcelona",
  "Valencia",
  "Seville",
  "Zaragoza",
  "Amsterdam",
  "Rotterdam",
  "Utrecht",
  "The Hague",
  "Eindhoven",
  "Zurich",
  "Geneva",
  "Basel",
  "Bern",
  "Lausanne",
  "Stockholm",
  "Gothenburg",
  "Malmo",
  "Uppsala",
  "Vasteras",
  "Oslo",
  "Bergen",
  "Trondheim",
  "Stavanger",
  "Drammen",
  "Copenhagen",
  "Aarhus",
  "Odense",
  "Aalborg",
  "Esbjerg",
  "Brussels",
  "Antwerp",
  "Ghent",
  "Charleroi",
  "Liege",
  "Vienna",
  "Graz",
  "Linz",
  "Salzburg",
  "Innsbruck",
  // USA
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
  "San Francisco",
  "Boston",
  "Seattle",
  "Denver",
  "Washington DC",
  "Miami",
  "Atlanta",
  "Portland",
  "Detroit",
  "Nashville",
];

// ===== API endpoints =====
export const API_ENDPOINTS = {
  CARS: "/cars/",
  CARS_LIST: "/cars/list/",
  CARS_MANAGE: "/cars/manage/",
  FAVORITES: "/cars/favorites/",
  TOKEN: "/token/",
  TOKEN_REFRESH: "/token/refresh/",
  REGISTER: "/users/register/",
  PROFILE: "/auth/profile/",
};

// ===== Storage keys =====
export const STORAGE_KEYS = {
  ACCESS_TOKEN: "access_token",
  REFRESH_TOKEN: "refresh_token",
  USER: "user",
  USER_ID: "user_id",
  THEME: "theme",
};
