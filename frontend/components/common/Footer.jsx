"use client";
import Link from "next/link";
import { Car } from "lucide-react";
import { memo } from "react";

const Footer = memo(() => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[rgb(var(--card))] border-t border-[rgb(var(--border))] mt-auto">
      <div className="container-custom py-8">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          {/* ===== Logo ===== */}
          <Link href="/" className="flex items-center gap-2 group">
            <Car className="text-primary-500 w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
            <span className="text-lg font-bold text-gradient">
              Car<span className="text-[rgb(var(--foreground))]">Market</span>
            </span>
          </Link>

          {/* ===== Navigation Links ===== */}
          <nav className="flex flex-wrap justify-center gap-4 text-sm text-[rgb(var(--muted-foreground))]">
            <Link
              href="/vehicles"
              className="hover:text-primary-500 transition-colors duration-200 hover:scale-105"
            >
              Vehicles
            </Link>
            <Link
              href="/about"
              className="hover:text-primary-500 transition-colors duration-200 hover:scale-105"
            >
              About
            </Link>
            <Link
              href="/contact"
              className="hover:text-primary-500 transition-colors duration-200 hover:scale-105"
            >
              Contact
            </Link>
            <Link
              href="/terms"
              className="hover:text-primary-500 transition-colors duration-200 hover:scale-105"
            >
              Terms
            </Link>
          </nav>

          {/* ===== Copyright ===== */}
          <p className="text-sm text-[rgb(var(--muted-foreground))]">
            © {currentYear} CarMarket
          </p>
        </div>
      </div>
    </footer>
  );
});

Footer.displayName = "Footer";
export default Footer;
