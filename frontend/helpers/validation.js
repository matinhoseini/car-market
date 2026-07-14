// helpers/validation.js

// ===== Email validation =====
export const isValidEmail = (email) => {
  if (!email) return false;
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

// ===== Phone validation =====
export const isValidPhone = (phone) => {
  if (!phone) return false;
  const regex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
  return regex.test(phone);
};

// ===== Price validation =====
export const isValidPrice = (price) => {
  return price > 0 && typeof price === "number";
};

// ===== Year validation =====
export const isValidYear = (year) => {
  const currentYear = new Date().getFullYear();
  return year >= 1900 && year <= currentYear + 1;
};

// ===== Mileage validation =====
export const isValidMileage = (mileage) => {
  return mileage >= 0 && typeof mileage === "number";
};
