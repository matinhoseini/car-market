// components/common/Header.jsx
"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import {
  Car,
  User,
  Menu,
  X,
  LogOut,
  LayoutDashboard,
  CarFront,
  Info,
  Settings,
  Heart,
  PlusCircle,
} from "lucide-react";
import DarkToggle from "./DarkToggle";
import { useRouter, usePathname } from "next/navigation";

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [user, setUser] = useState(null);
  const userMenuRef = useRef(null);

  // ===== Check login status =====
  const checkAuth = () => {
    const token = localStorage.getItem("access_token");
    const userData = localStorage.getItem("user");
    if (token && userData) {
      try {
        setUser(JSON.parse(userData));
        setIsLoggedIn(true);
      } catch {
        setIsLoggedIn(false);
        setUser(null);
      }
    } else {
      setIsLoggedIn(false);
      setUser(null);
    }
  };

  // ===== Check on mount AND every time pathname changes =====
  useEffect(() => {
    checkAuth();
  }, [pathname]);

  // ===== Also listen for storage changes =====
  useEffect(() => {
    const handleStorageChange = () => {
      checkAuth();
    };
    window.addEventListener("storage", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  // ===== Control scroll =====
  useEffect(() => {
    const controlHeader = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY && currentScrollY > 80) {
        setIsVisible(false);
      } else if (currentScrollY < lastScrollY) {
        setIsVisible(true);
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", controlHeader, { passive: true });
    return () => window.removeEventListener("scroll", controlHeader);
  }, [lastScrollY]);

  // ===== Click outside user menu =====
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ===== Lock scroll when menu is open =====
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMenuOpen]);

  // ===== Logout handler =====
  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    setUser(null);
    setIsUserMenuOpen(false);
    router.push("/");
  };

  // ===== Handle dashboard click with token check =====
  const handleDashboardClick = (e) => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      e.preventDefault();
      router.push("/auth/register");
    }
    setIsMenuOpen(false);
  };

  // ===== Nav items =====
  const navItems = [
    { href: "/vehicles", label: "Vehicles", icon: CarFront },
    { href: "/about", label: "About", icon: Info },
  ];

  const protectedNavItems = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/dashboard/add-vehicle", label: "Add Vehicle", icon: PlusCircle },
    { href: "/dashboard/favorites", label: "Favorites", icon: Heart },
  ];

  return (
    <>
      <header
        className={`
          header py-0 h-14 md:h-16 lg:h-16
          transition-all duration-500 ease-in-out
          ${isVisible ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"}
          fixed top-0 left-0 right-0
          z-[9999]
        `}
      >
        <div className="container-custom h-full">
          <div className="flex justify-between items-center h-full">
            {/* ===== Logo ===== */}
            <Link
              href="/"
              className="flex items-center gap-1.5 md:gap-2 group flex-shrink-0"
            >
              <Car className="text-primary-500 w-4 h-4 md:w-5 md:h-5 lg:w-5 lg:h-5 group-hover:scale-110 transition-transform duration-300" />
              <span className="text-sm md:text-base lg:text-base font-bold text-gradient">
                Car<span className="text-[rgb(var(--foreground))]">Market</span>
              </span>
            </Link>

            {/* ===== Desktop Navigation ===== */}
            <nav className="hidden lg:flex items-center gap-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="px-3 py-1.5 rounded-lg text-sm text-[rgb(var(--foreground))] hover:text-primary-500 hover:bg-[rgb(var(--muted))] transition-all duration-200 font-medium hover:scale-95"
                >
                  {item.label}
                </Link>
              ))}

              {/* ===== Dashboard - with token check ===== */}
              <Link
                href="/dashboard"
                onClick={handleDashboardClick}
                className="px-3 py-1.5 rounded-lg text-sm text-[rgb(var(--foreground))] hover:text-primary-500 hover:bg-[rgb(var(--muted))] transition-all duration-200 font-medium hover:scale-95"
              >
                Dashboard
              </Link>

              {/* ===== Protected nav items (only for logged in users) ===== */}
              {isLoggedIn &&
                protectedNavItems.slice(1).map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="px-3 py-1.5 rounded-lg text-sm text-[rgb(var(--foreground))] hover:text-primary-500 hover:bg-[rgb(var(--muted))] transition-all duration-200 font-medium hover:scale-95"
                  >
                    {item.label}
                  </Link>
                ))}
            </nav>

            {/* ===== Right Side ===== */}
            <div className="flex items-center gap-1.5 md:gap-2 lg:gap-2">
              <DarkToggle />

              {isLoggedIn && user ? (
                <div className="relative" ref={userMenuRef}>
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center gap-1.5 md:gap-2 px-1.5 md:px-2 py-1 rounded-full hover:bg-[rgb(var(--muted))] transition-all duration-200 hover:scale-95"
                  >
                    <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-gradient-to-r from-primary-500 to-accent-500 flex items-center justify-center text-white font-semibold text-xs md:text-sm">
                      {user.username?.charAt(0).toUpperCase() || "U"}
                    </div>
                    <span className="hidden sm:inline text-xs md:text-sm font-medium text-[rgb(var(--foreground))]">
                      {user.username?.split(" ")[0] || "User"}
                    </span>
                  </button>

                  {isUserMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-[rgb(var(--card))] rounded-xl shadow-xl border border-[rgb(var(--border))] py-2 z-[9999] animate-fade-in">
                      <div className="px-4 py-2 border-b border-[rgb(var(--border))]">
                        <p className="font-semibold text-sm">
                          {user.username || "User"}
                        </p>
                        <p className="text-xs text-[rgb(var(--muted-foreground))]">
                          {user.email || ""}
                        </p>
                      </div>

                      <Link
                        href="/dashboard"
                        className="flex items-center gap-3 px-4 py-2 hover:bg-[rgb(var(--muted))] transition-all duration-200 hover:scale-95 text-sm"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <LayoutDashboard className="w-4 h-4" /> Dashboard
                      </Link>
                      <Link
                        href="/dashboard/add-vehicle"
                        className="flex items-center gap-3 px-4 py-2 hover:bg-[rgb(var(--muted))] transition-all duration-200 hover:scale-95 text-sm"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <PlusCircle className="w-4 h-4" /> Add Vehicle
                      </Link>
                      <Link
                        href="/dashboard/favorites"
                        className="flex items-center gap-3 px-4 py-2 hover:bg-[rgb(var(--muted))] transition-all duration-200 hover:scale-95 text-sm"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <Heart className="w-4 h-4" /> Favorites
                      </Link>
                      <Link
                        href="/dashboard/profile"
                        className="flex items-center gap-3 px-4 py-2 hover:bg-[rgb(var(--muted))] transition-all duration-200 hover:scale-95 text-sm"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <Settings className="w-4 h-4" /> Settings
                      </Link>

                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-4 py-2 hover:bg-red-50 dark:hover:bg-red-950/50 transition-all duration-200 hover:scale-95 text-sm text-red-500 w-full"
                      >
                        <LogOut className="w-4 h-4" /> Sign Out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-1 md:gap-1.5">
                  <Link href="/auth/login">
                    <button className="btn-primary btn-sm text-[10px] md:text-xs px-2 md:px-3 py-1 md:py-1.5 hidden sm:inline-flex transition-all duration-200 hover:scale-95 hover:bg-primary-600">
                      <User className="w-3 h-3 md:w-3.5 md:h-3.5 mr-1" />
                      Sign In
                    </button>
                  </Link>
                  <Link
                    href="/auth/register"
                    className="hidden sm:inline-block"
                  >
                    <button className="btn-outline btn-sm text-[10px] md:text-xs px-2 md:px-3 py-1 md:py-1.5 transition-all duration-200 hover:scale-95">
                      Sign Up
                    </button>
                  </Link>
                </div>
              )}

              {/* ===== Hamburger Menu ===== */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="lg:hidden p-1.5 md:p-2 rounded-lg hover:bg-[rgb(var(--muted))] transition-all duration-200 hover:scale-95 relative z-[9999]"
                aria-label="Toggle menu"
              >
                {isMenuOpen ? (
                  <X className="w-5 h-5 md:w-6 md:h-6 text-[rgb(var(--foreground))]" />
                ) : (
                  <Menu className="w-5 h-5 md:w-6 md:h-6 text-[rgb(var(--foreground))]" />
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* ===== Mobile Menu ===== */}
      {isMenuOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9998] lg:hidden animate-fade-in"
            onClick={() => setIsMenuOpen(false)}
          />
          <div className="fixed top-0 right-0 h-full w-64 sm:w-72 bg-[rgb(var(--card))] shadow-2xl z-[9999] lg:hidden animate-slide-in-right">
            <div className="flex justify-between items-center p-4 border-b border-[rgb(var(--border))] h-14 md:h-16">
              <span className="text-base sm:text-lg font-bold text-gradient">
                Menu
              </span>
              <button
                onClick={() => setIsMenuOpen(false)}
                className="p-2 rounded-lg hover:bg-[rgb(var(--muted))] transition-all duration-200 hover:scale-95"
              >
                <X className="w-5 h-5 sm:w-6 sm:h-6 text-[rgb(var(--foreground))]" />
              </button>
            </div>

            <nav className="p-4 space-y-1 text-[rgb(var(--foreground))]">
              {/* Vehicles */}
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex items-center gap-4 px-4 py-3 rounded-lg hover:bg-[rgb(var(--muted))] transition-all duration-200 hover:scale-95 font-medium"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Icon className="w-5 h-5 text-primary-500 flex-shrink-0" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}

              {/* ===== Dashboard - with token check ===== */}
              <Link
                href="/dashboard"
                onClick={handleDashboardClick}
                className="flex items-center gap-4 px-4 py-3 rounded-lg hover:bg-[rgb(var(--muted))] transition-all duration-200 hover:scale-95 font-medium"
              >
                <LayoutDashboard className="w-5 h-5 text-primary-500 flex-shrink-0" />
                <span>Dashboard</span>
              </Link>

              {/* ===== Protected nav items (only for logged in users) ===== */}
              {isLoggedIn &&
                protectedNavItems.slice(1).map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="flex items-center gap-4 px-4 py-3 rounded-lg hover:bg-[rgb(var(--muted))] transition-all duration-200 hover:scale-95 font-medium"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <Icon className="w-5 h-5 text-primary-500 flex-shrink-0" />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}

              <div className="border-t border-[rgb(var(--border))] my-4 pt-4">
                {isLoggedIn ? (
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                    className="flex items-center gap-4 px-4 py-3 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/50 transition-all duration-200 hover:scale-95 text-red-500 w-full"
                  >
                    <LogOut className="w-5 h-5 flex-shrink-0" />
                    <span>Sign Out</span>
                  </button>
                ) : (
                  <div className="space-y-2">
                    <Link
                      href="/auth/login"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <button className="btn-primary w-full text-sm py-2.5">
                        Sign In
                      </button>
                    </Link>
                    <Link
                      href="/auth/register"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <button className="btn-outline w-full text-sm py-2.5">
                        Sign Up
                      </button>
                    </Link>
                  </div>
                )}
              </div>
            </nav>
          </div>
        </>
      )}
    </>
  );
}
