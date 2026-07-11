// app/layout.jsx
import "./globals.css";
import { Toaster } from "react-hot-toast";
import Header from "../components/common/Header";
import Footer from "../components/common/Footer";
import { title } from "process";
import path from "path";
import localFont from "next/font/local";

const inter = localFont({
  src: [
    {
      path: "../public/fonts/Inter_18pt-Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/fonts/Inter_18pt-Bold.ttf",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-inter",
});

const poppins = localFont({
  src: [
    {
      path: "../public/fonts/Poppins-Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/fonts/Poppins-Bold.ttf",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-poppins",
});

export const metadata = {
  title: {
    default: "Car Marketplace",
    template: "%s | Car Marketplace",
  },
  description: "Buy and sell cars online",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${poppins.variable}`}
    >
      <body>
        <div className="min-h-screen flex flex-col">
          <Header />
          <div className="pt-14 md:pt-16 lg:pt-16 flex-1">
            <main className="min-h-screen">{children}</main>
          </div>
          <Footer />
        </div>

        {/* ===== Toaster ===== */}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: "rgb(var(--card))",
              color: "rgb(var(--foreground))",
              border: "1px solid rgb(var(--border))",
              borderRadius: "12px",
              padding: "12px 20px",
            },
            success: {
              iconTheme: {
                primary: "#22c55e",
                secondary: "white",
              },
            },
            error: {
              iconTheme: {
                primary: "#ef4444",
                secondary: "white",
              },
            },
          }}
        />
      </body>
    </html>
  );
}
