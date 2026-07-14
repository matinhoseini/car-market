// helpers/storage.js

// ===== Set item =====
export const setStorage = (key, value) => {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error("Error saving to storage:", error);
  }
};

// ===== Get item =====
export const getStorage = (key) => {
  if (typeof window === "undefined") return null;
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  } catch (error) {
    console.error("Error reading from storage:", error);
    return null;
  }
};

// ===== Remove item =====
export const removeStorage = (key) => {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error("Error removing from storage:", error);
  }
};

// ===== Clear all =====
export const clearStorage = () => {
  if (typeof window === "undefined") return;
  try {
    localStorage.clear();
  } catch (error) {
    console.error("Error clearing storage:", error);
  }
};

// ===== Check if exists =====
export const hasStorage = (key) => {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(key) !== null;
};
