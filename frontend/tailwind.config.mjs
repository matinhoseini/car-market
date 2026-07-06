// tailwind.config.mjs
import { fontFamily } from "tailwindcss/defaultTheme";

/** @type {import('tailwindcss').Config} */
const config = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
    "./pages/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", ...fontFamily.sans],
        heading: ["Poppins", ...fontFamily.sans],
      },
      colors: {
        primary: {
          50: "#eff6ff",
          100: "#dbeafe",
          200: "#bfdbfe",
          300: "#93c5fd",
          400: "#60a5fa",
          500: "#3b82f6",
          600: "#2563eb",
          700: "#1d4ed8",
          800: "#1e40af",
          900: "#1e3a8a",
        },
      },
      keyframes: {
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(-10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.3s ease-out",
      },
    },
  },
  // ===== اینو اضافه کن! =====
  safelist: [
    // کلاس‌های سفارشی که توی globals.css داری
    "header",
    "card",
    "card-hover",
    "btn",
    "btn-primary",
    "btn-secondary",
    "btn-outline",
    "btn-ghost",
    "btn-danger",
    "btn-success",
    "btn-sm",
    "btn-lg",
    "btn-icon",
    "input",
    "label",
    "badge",
    "badge-primary",
    "badge-success",
    "badge-danger",
    "text-gradient",
    "container-custom",
    "section",
    "glass",
  ],
  plugins: [],
};

export default config;
