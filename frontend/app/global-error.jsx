"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Car, Home, RefreshCw, AlertTriangle } from "lucide-react";

// ============================================
// 🌐 Global Error Component
// ============================================
export default function GlobalError({ error, reset }) {
  useEffect(() => {
    // Log error to console or error tracking service
    console.error("❌ Global Error:", error);
  }, [error]);

  return (
    <html>
      <body>
        <div className="min-h-screen bg-[rgb(var(--background))] flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-[rgb(var(--card))] rounded-2xl border border-[rgb(var(--border))] shadow-xl p-8 text-center">
            {/* Icon */}
            <div className="w-20 h-20 mx-auto rounded-full bg-red-500/10 flex items-center justify-center mb-6">
              <AlertTriangle className="w-10 h-10 text-red-500" />
            </div>

            {/* Title */}
            <h1 className="text-2xl font-bold font-heading text-[rgb(var(--foreground))] mb-2">
              Something went wrong!
            </h1>

            {/* Description */}
            <p className="text-[rgb(var(--muted-foreground))] text-sm mb-6">
              We're sorry, but an unexpected error has occurred. Our team has
              been notified.
            </p>

            {/* Error Details (in development) */}
            {process.env.NODE_ENV === "development" && (
              <div className="mb-6 p-4 bg-red-500/5 border border-red-500/20 rounded-lg text-left">
                <p className="text-xs font-mono text-red-500 break-all">
                  {error?.message || "Unknown error"}
                </p>
                {error?.stack && (
                  <details className="mt-2">
                    <summary className="text-xs text-[rgb(var(--muted-foreground))] cursor-pointer">
                      Stack trace
                    </summary>
                    <pre className="mt-2 text-[10px] font-mono text-[rgb(var(--muted-foreground))] whitespace-pre-wrap break-all">
                      {error.stack}
                    </pre>
                  </details>
                )}
              </div>
            )}

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={reset}
                className="btn-primary flex-1 flex items-center justify-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Try Again
              </button>

              <Link
                href="/"
                className="btn-outline flex-1 flex items-center justify-center gap-2"
              >
                <Home className="w-4 h-4" />
                Go Home
              </Link>
            </div>

            {/* Footer */}
            <div className="mt-6 pt-6 border-t border-[rgb(var(--border))]">
              <Link
                href="/"
                className="flex items-center justify-center gap-2 text-sm text-[rgb(var(--muted-foreground))] hover:text-primary-500 transition-colors"
              >
                <Car className="w-4 h-4" />
                CarMarket
              </Link>
              <p className="text-xs text-[rgb(var(--muted-foreground))] mt-2">
                Error Reference: {Date.now().toString(36).toUpperCase()}
              </p>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
