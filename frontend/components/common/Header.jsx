// components/common/Header.jsx
"use client";

import Link from "next/link";
import { useState, useRef, useEffect, useCallback, useMemo, memo } from "react";
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
import { useRouter } from "next/navigation";
import { useAuth } from "../../hooks/useAuth";

// ============================================
// 📦 Header Component with useAuth
// ============================================
const Header = memo(() => {
  const router = useRouter();
  const { user, loading, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const userMenuRef = useRef(null);

  // ============================================
  // 📋 Memoized navigation items
  // ============================================
  const navItems = useMemo(
    () => [
      { href: "/vehicles", label: "Vehicles", icon: CarFront },
      { href: "/about", label: "About", icon: Info },
    ],
    [],
  );

  const protectedNavItems = useMemo(
    () => [
      { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
      {
        href: "/dashboard/add-vehicle",
        label: "Add Vehicle",
        icon: PlusCircle,
      },
      { href: "/dashboard/favorites", label: "Favorites", icon: Heart },
      { href: "/dashboard/profile", label: "Profile", icon: Settings },
    ],
    [],
  );

  // ============================================
  // 📍 Check if link is active
  // ============================================
  const isActive = useCallback((href) => {
    if (href === "/") {
      return window.location.pathname === href;
    }
    return window.location.pathname.startsWith(href);
  }, []);

  // ============================================
  // 🖱️ Control header visibility on scroll
  // ============================================
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

  // ============================================
  // 🔒 Close user menu when clicking outside
  // ============================================
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ============================================
  // 🔒 Lock body scroll when mobile menu is open
  // ============================================
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

  // ============================================
  // 🎯 Toggle menu handlers
  // ============================================
  const toggleMenu = useCallback(() => {
    setIsMenuOpen((prev) => !prev);
  }, []);

  const toggleUserMenu = useCallback(() => {
    setIsUserMenuOpen((prev) => !prev);
  }, []);

  // ============================================
  // 🚪 Handle dashboard click with token validation
  // ============================================
  const handleDashboardClick = useCallback(
    (e) => {
      const token = localStorage.getItem("access_token");
      if (!token) {
        e.preventDefault();
        router.push("/auth/register");
      }
      setIsMenuOpen(false);
    },
    [router],
  );

  // ============================================
  // 🚪 Handle logout click
  // ============================================
  const handleLogoutClick = useCallback(() => {
    logout();
    setIsUserMenuOpen(false);
    setIsMenuOpen(false);
  }, [logout]);

  // ============================================
  // ⏳ Loading state
  // ============================================
  if (loading) {
    return (
      <header className="header py-0 h-14 md:h-16 lg:h-16 fixed top-0 left-0 right-0 z-[9999] bg-[rgb(var(--card))] border-b border-[rgb(var(--border))]">
        <div className="container-custom h-full flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Car className="text-primary-500 w-5 h-5 animate-pulse" />
            <span className="text-lg font-bold text-gradient">CarMarket</span>
          </div>
          <div className="w-8 h-8 rounded-full bg-[rgb(var(--muted))] animate-pulse"></div>
        </div>
      </header>
    );
  }

  // ============================================
  // 🎨 Render
  // ============================================
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
              {navItems.map((item) => {
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`
                      px-3 py-1.5 rounded-lg text-sm font-medium
                      transition-all duration-200 hover:scale-95
                      ${
                        active
                          ? "bg-primary-500/10 text-primary-500 shadow-sm ring-1 ring-primary-500/20"
                          : "text-[rgb(var(--foreground))] hover:text-primary-500 hover:bg-[rgb(var(--muted))]"
                      }
                    `}
                  >
                    {item.label}
                  </Link>
                );
              })}

              <Link
                href="/dashboard"
                onClick={handleDashboardClick}
                className={`
                  px-3 py-1.5 rounded-lg text-sm font-medium
                  transition-all duration-200 hover:scale-95
                  ${
                    isActive("/dashboard")
                      ? "bg-primary-500/10 text-primary-500 shadow-sm ring-1 ring-primary-500/20"
                      : "text-[rgb(var(--foreground))] hover:text-primary-500 hover:bg-[rgb(var(--muted))]"
                  }
                `}
              >
                Dashboard
              </Link>

              {user &&
                protectedNavItems.slice(1).map((item) => {
                  const active = isActive(item.href);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`
                        px-3 py-1.5 rounded-lg text-sm font-medium
                        transition-all duration-200 hover:scale-95
                        ${
                          active
                            ? "bg-primary-500/10 text-primary-500 shadow-sm ring-1 ring-primary-500/20"
                            : "text-[rgb(var(--foreground))] hover:text-primary-500 hover:bg-[rgb(var(--muted))]"
                        }
                      `}
                    >
                      {item.label}
                    </Link>
                  );
                })}
            </nav>

            {/* ===== Right side actions ===== */}
            <div className="flex items-center gap-1.5 md:gap-2 lg:gap-2">
              <DarkToggle />

              {user ? (
                <div className="relative" ref={userMenuRef}>
                  <button
                    onClick={toggleUserMenu}
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

                      {protectedNavItems.map((item) => {
                        const Icon = item.icon;
                        const active = isActive(item.href);
                        return (
                          <Link
                            key={item.href}
                            href={item.href}
                            className={`
                              flex items-center gap-3 px-4 py-2 transition-all duration-200 hover:scale-95 text-sm
                              ${
                                active
                                  ? "bg-primary-500/10 text-primary-500"
                                  : "hover:bg-[rgb(var(--muted))]"
                              }
                            `}
                            onClick={() => setIsUserMenuOpen(false)}
                          >
                            <Icon className="w-4 h-4" /> {item.label}
                          </Link>
                        );
                      })}

                      <button
                        onClick={handleLogoutClick}
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

              <button
                onClick={toggleMenu}
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
            onClick={toggleMenu}
          />

          <div className="fixed top-0 right-0 h-full w-64 sm:w-72 bg-[rgb(var(--card))] shadow-2xl z-[9999] lg:hidden animate-slide-in-right">
            <div className="flex justify-between items-center p-4 border-b border-[rgb(var(--border))] h-14 md:h-16">
              <span className="text-base sm:text-lg font-bold text-gradient">
                Menu
              </span>
              <button
                onClick={toggleMenu}
                className="p-2 rounded-lg hover:bg-[rgb(var(--muted))] transition-all duration-200 hover:scale-95"
              >
                <X className="w-5 h-5 sm:w-6 sm:h-6 text-[rgb(var(--foreground))]" />
              </button>
            </div>

            <nav className="p-4 space-y-1 text-[rgb(var(--foreground))]">
              {navItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`
                      flex items-center gap-4 px-4 py-3 rounded-lg transition-all duration-200 hover:scale-95 font-medium
                      ${
                        active
                          ? "bg-primary-500/10 text-primary-500 shadow-sm ring-1 ring-primary-500/20"
                          : "hover:bg-[rgb(var(--muted))]"
                      }
                    `}
                    onClick={toggleMenu}
                  >
                    <Icon className="w-5 h-5 flex-shrink-0 text-primary-500" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}

              <Link
                href="/dashboard"
                onClick={handleDashboardClick}
                className={`
                  flex items-center gap-4 px-4 py-3 rounded-lg transition-all duration-200 hover:scale-95 font-medium
                  ${
                    isActive("/dashboard")
                      ? "bg-primary-500/10 text-primary-500 shadow-sm ring-1 ring-primary-500/20"
                      : "hover:bg-[rgb(var(--muted))]"
                  }
                `}
              >
                <LayoutDashboard className="w-5 h-5 text-primary-500 flex-shrink-0" />
                <span>Dashboard</span>
              </Link>

              {user &&
                protectedNavItems.slice(1).map((item) => {
                  const Icon = item.icon;
                  const active = isActive(item.href);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`
                        flex items-center gap-4 px-4 py-3 rounded-lg transition-all duration-200 hover:scale-95 font-medium
                        ${
                          active
                            ? "bg-primary-500/10 text-primary-500 shadow-sm ring-1 ring-primary-500/20"
                            : "hover:bg-[rgb(var(--muted))]"
                        }
                      `}
                      onClick={toggleMenu}
                    >
                      <Icon className="w-5 h-5 text-primary-500 flex-shrink-0" />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}

              <div className="border-t border-[rgb(var(--border))] my-4 pt-4">
                {user ? (
                  <button
                    onClick={() => {
                      handleLogoutClick();
                      toggleMenu();
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
                      onClick={toggleMenu}
                      className="block"
                    >
                      <button className="btn-primary w-full text-sm py-2.5">
                        Sign In
                      </button>
                    </Link>
                    <Link
                      href="/auth/register"
                      onClick={toggleMenu}
                      className="block"
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
});

Header.displayName = "Header";
export default Header;
