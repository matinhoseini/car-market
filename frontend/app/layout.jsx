// app/layout.jsx
"use client";

import "./globals.css";
import { Toaster } from "react-hot-toast";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useState } from "react";
import Header from "../components/common/Header";
import Footer from "../components/common/Footer";
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

// ===== Metadata (Only works in Server Components) =====
// Since we're using "use client", metadata is not supported
// Move this to a separate server component or use next/head

export default function RootLayout({ children }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 5 * 60 * 1000, // 5 minutes
            refetchOnWindowFocus: false,
          },
        },
      }),
  );

  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${poppins.variable}`}
    >
      <body>
        <QueryClientProvider client={queryClient}>
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

          <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
      </body>
    </html>
  );
}
