"use client";
import Link from "next/link";
import { Car } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[rgb(var(--card))] border-t border-[rgb(var(--border))] mt-auto">
      <div className="container-custom py-8">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <Link href="/" className="flex items-center gap-2">
            <Car className="text-primary-500 w-5 h-5" />
            <span className="text-lg font-bold text-gradient">
              Car<span className="text-[rgb(var(--foreground))]">Market</span>
            </span>
          </Link>

          <nav className="flex flex-wrap justify-center gap-4 text-sm text-[rgb(var(--muted-foreground))]">
            <Link
              href="/vehicles"
              className="hover:text-primary-500 transition-colors"
            >
              Vehicles
            </Link>
            <Link
              href="/about"
              className="hover:text-primary-500 transition-colors"
            >
              About
            </Link>
            <Link
              href="/contact"
              className="hover:text-primary-500 transition-colors"
            >
              Contact
            </Link>
            <Link
              href="/terms"
              className="hover:text-primary-500 transition-colors"
            >
              Terms
            </Link>
          </nav>

          <p className="text-sm text-[rgb(var(--muted-foreground))]">
            © {new Date().getFullYear()} CarMarket
          </p>
        </div>
      </div>
    </footer>
  );
}
