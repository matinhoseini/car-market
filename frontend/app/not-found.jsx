// app/not-found.jsx
"use client";

import Link from "next/link";
import { Home, ArrowLeft, Search } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[rgb(var(--background))] px-4">
      <div className="card max-w-lg w-full p-8 text-center">
        {/* Icon */}
        <div className="flex justify-center mb-4">
          <div className="p-4 bg-blue-500/10 rounded-full">
            <Search className="w-12 h-12 text-blue-500" />
          </div>
        </div>

        {/* 404 Number */}
        <h1 className="text-7xl font-bold font-heading text-primary-500 mb-2">
          404
        </h1>

        {/* Title */}
        <h2 className="text-2xl font-bold font-heading mb-2">Page Not Found</h2>

        {/* Description */}
        <p className="text-[rgb(var(--muted-foreground))] mb-6">
          Oops! The page you're looking for doesn't exist or has been moved.
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/">
            <button className="btn-primary flex items-center gap-2 justify-center w-full sm:w-auto">
              <Home className="w-4 h-4" />
              Go Home
            </button>
          </Link>

          <button
            onClick={() => window.history.back()}
            className="btn-outline flex items-center gap-2 justify-center w-full sm:w-auto"
          >
            <ArrowLeft className="w-4 h-4" />
            Go Back
          </button>
        </div>

        {/* Help text */}
        <p className="text-xs text-[rgb(var(--muted-foreground))] mt-6">
          If you think this is a mistake, please contact support.
        </p>
      </div>
    </div>
  );
}
