"use client";

import { useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import {
  GraduationCap,
  Menu,
  X,
  LogIn,
  UserPlus,
  LogOut,
  User,
  Sun,
  Moon,
} from "lucide-react";

const NAV_LINKS = [
  { href: "/", label: "হোম" },
  { href: "/courses", label: "কোর্স সমূহ" },
  { href: "/about", label: "আমাদের সম্পর্কে" },
  { href: "/contact", label: "যোগাযোগ" },
];

function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(";").shift() || null;
  return null;
}

function deleteCookie(name: string) {
  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
}

function useIsMounted() {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
}

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [, forceUpdate] = useState(0);
  const { theme, setTheme } = useTheme();
  const mounted = useIsMounted();
  const pathname = usePathname();

  const isLoggedIn = mounted && !!getCookie("accessToken");
  const userType = mounted ? getCookie("userType") : null;

  const handleLogout = () => {
    ["accessToken", "refreshToken", "userType"].forEach(deleteCookie);
    forceUpdate((n) => n + 1);
    window.location.href = "/";
  };

  const closeMenu = () => setIsMenuOpen(false);
  const toggleTheme = () => setTheme(theme === "dark" ? "light" : "dark");
  const dashboardPath = userType === "admin" ? "/dashboard" : "/my-courses";
  const dashboardLabel = userType === "admin" ? "ড্যাশবোর্ড" : "আমার কোর্স";

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  const themeIcon = mounted && (theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />);

  return (
    <nav className="fixed inset-x-0 top-0 z-50 bg-white/80 dark:bg-gray-950/80 backdrop-blur-md border-b border-gray-200/50 dark:border-gray-800/50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 bg-linear-to-br from-purple-600 to-cyan-500 rounded-lg flex items-center justify-center shadow-md group-hover:shadow-lg group-hover:shadow-purple-500/25 transition-shadow">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold bg-linear-to-r from-purple-600 to-cyan-500 dark:from-purple-400 dark:to-cyan-400 bg-clip-text text-transparent">
              Tarif Academy
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((link) => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  className={`px-4 py-2 text-base font-medium rounded-lg transition-all ${
                    active
                      ? "text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-500/20"
                      : "text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-800 transition-colors"
              aria-label="Toggle theme"
            >
              {themeIcon}
            </button>

            {!mounted ? (
              <div className="flex gap-2">
                <div className="h-9 w-20 bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse" />
                <div className="h-9 w-24 bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse" />
              </div>
            ) : isLoggedIn ? (
              <>
                <Link href={dashboardPath}>
                  <Button variant="ghost" size="sm" className="text-gray-600 dark:text-gray-300">
                    <User className="w-4 h-4 mr-1" />
                    {dashboardLabel}
                  </Button>
                </Link>
                <Button onClick={handleLogout} size="sm" variant="destructive">
                  <LogOut className="w-4 h-4 mr-1" />
                  লগআউট
                </Button>
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost" size="sm" className="text-gray-600 dark:text-gray-300">
                    <LogIn className="w-4 h-4 mr-1" />
                    লগইন
                  </Button>
                </Link>
                <Link href="/sign-up">
                  <Button size="sm" className="bg-linear-to-r from-purple-600 to-cyan-500 hover:from-purple-700 hover:to-cyan-600 shadow-md shadow-purple-500/25">
                    <UserPlus className="w-4 h-4 mr-1" />
                    সাইন আপ
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Actions */}
          <div className="flex md:hidden items-center gap-1">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 transition-colors"
              aria-label="Toggle theme"
            >
              {themeIcon}
            </button>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 transition-colors"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200/50 dark:border-gray-800/50">
            <div className="flex flex-col gap-1">
              {NAV_LINKS.map((link) => {
                const active = isActive(link.href);
                return (
                  <Link
                    key={link.label}
                    href={link.href}
                    className={`px-4 py-3 text-base font-medium rounded-lg transition-all ${
                      active
                        ? "text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-500/20"
                        : "text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                    }`}
                    onClick={closeMenu}
                  >
                    {link.label}
                  </Link>
                );
              })}
              <div className="border-t border-gray-200/50 dark:border-gray-800/50 mt-2 pt-3 px-4 flex flex-col gap-2">
                {!mounted ? (
                  <>
                    <div className="h-10 w-full bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse" />
                    <div className="h-10 w-full bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse" />
                  </>
                ) : isLoggedIn ? (
                  <>
                    <Link href={dashboardPath} onClick={closeMenu}>
                      <Button variant="outline" size="sm" className="w-full dark:border-gray-700 dark:text-gray-300">
                        <User className="w-4 h-4 mr-1" />
                        {dashboardLabel}
                      </Button>
                    </Link>
                    <Button onClick={() => { handleLogout(); closeMenu(); }} size="sm" variant="destructive" className="w-full">
                      <LogOut className="w-4 h-4 mr-1" />
                      লগআউট
                    </Button>
                  </>
                ) : (
                  <>
                    <Link href="/login" onClick={closeMenu}>
                      <Button variant="outline" size="sm" className="w-full dark:border-gray-700 dark:text-gray-300">
                        <LogIn className="w-4 h-4 mr-1" />
                        লগইন
                      </Button>
                    </Link>
                    <Link href="/sign-up" onClick={closeMenu}>
                      <Button size="sm" className="w-full bg-linear-to-r from-purple-600 to-cyan-500">
                        <UserPlus className="w-4 h-4 mr-1" />
                        সাইন আপ
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
