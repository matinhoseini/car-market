// helpers/constants.js

// ===== Fuel types =====
export const FUEL_TYPES = [
  { value: "gasoline", label: "Gasoline" },
  { value: "diesel", label: "Diesel" },
  { value: "electric", label: "Electric" },
  { value: "hybrid", label: "Hybrid" },
];

// ===== Gearbox types =====
export const GEARBOX_TYPES = [
  { value: "manual", label: "Manual" },
  { value: "automatic", label: "Automatic" },
  { value: "cvt", label: "CVT" },
];

// ===== Years =====
export const YEARS = (() => {
  const currentYear = new Date().getFullYear();
  const years = [];
  for (let i = 0; i <= 10; i++) {
    years.push(currentYear - i);
  }
  return years;
})();

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

// ===== Order options =====
export const ORDER_OPTIONS = [
  { value: "", label: "Default" },
  { value: "-price", label: "Most Expensive" },
  { value: "price", label: "Cheapest" },
  { value: "-year", label: "Newest" },
  { value: "year", label: "Oldest" },
];
