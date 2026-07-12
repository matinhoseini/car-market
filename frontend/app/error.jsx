// app/error.jsx
"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertCircle, RefreshCw, Home } from "lucide-react";

export default function GlobalError({ error, reset }) {
  useEffect(() => {
    // Log the error to console
    console.error("Application error:", error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[rgb(var(--background))] px-4">
      <div className="card max-w-lg w-full p-8 text-center">
        {/* Icon */}
        <div className="flex justify-center mb-4">
          <div className="p-4 bg-red-500/10 rounded-full">
            <AlertCircle className="w-12 h-12 text-red-500" />
          </div>
        </div>

        {/* Title */}
        <h1 className="text-2xl font-bold font-heading mb-2">
          Oops! Something went wrong
        </h1>

        {/* Description */}
        <p className="text-[rgb(var(--muted-foreground))] mb-6">
          We encountered an unexpected error. Please try again or go back home.
        </p>

        {/* Error Details (only in development) */}
        {process.env.NODE_ENV === "development" && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-950/20 rounded-lg text-left">
            <p className="text-sm font-mono text-red-600 dark:text-red-400 break-all">
              {error.message || "Unknown error"}
            </p>
            {error.digest && (
              <p className="text-xs text-gray-500 mt-1">
                Error ID: {error.digest}
              </p>
            )}
          </div>
        )}

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={reset}
            className="btn-primary flex items-center gap-2 justify-center"
          >
            <RefreshCw className="w-4 h-4" />
            Try Again
          </button>

          <Link href="/">
            <button className="btn-outline flex items-center gap-2 justify-center w-full sm:w-auto">
              <Home className="w-4 h-4" />
              Go Home
            </button>
          </Link>
        </div>

        {/* Help text */}
        <p className="text-xs text-[rgb(var(--muted-foreground))] mt-6">
          If this problem persists, please contact support.
        </p>
      </div>
    </div>
  );
}
