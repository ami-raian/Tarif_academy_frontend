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

  const themeIcon =
    mounted &&
    (theme === "dark" ? (
      <Sun className="w-5 h-5" />
    ) : (
      <Moon className="w-5 h-5" />
    ));

  return (
    <nav className="fixed inset-x-0 top-0 z-50 bg-white/85 dark:bg-slate-900/90 backdrop-blur-xl border-b border-slate-200/40 dark:border-slate-700/50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 bg-gradient-to-br from-indigo-600 to-purple-600 dark:from-indigo-500 dark:to-purple-500 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-500/30 group-hover:shadow-indigo-500/50 transition-all duration-300">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold text-slate-900 dark:text-white">
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
                      ? "text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/15"
                      : "text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800"
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
              className="p-2 rounded-lg text-slate-500 hover:text-slate-700 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-slate-200 dark:hover:bg-slate-800 transition-colors duration-200"
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
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-slate-800"
                  >
                    <User className="w-4 h-4 mr-1" />
                    {dashboardLabel}
                  </Button>
                </Link>
                <Button
                  onClick={handleLogout}
                  size="sm"
                  variant="destructive"
                  className="bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800 text-white"
                >
                  <LogOut className="w-4 h-4 mr-1" />
                  লগআউট
                </Button>
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-slate-800"
                  >
                    <LogIn className="w-4 h-4 mr-1" />
                    লগইন
                  </Button>
                </Link>
                <Link href="/sign-up">
                  <Button
                    size="sm"
                    className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 dark:from-indigo-500 dark:to-purple-500 dark:hover:from-indigo-600 dark:hover:to-purple-600 text-white shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 transition-all duration-300"
                  >
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
              className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 transition-colors duration-200"
              aria-label="Toggle theme"
            >
              {themeIcon}
            </button>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 transition-colors duration-200"
            >
              {isMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-slate-200/50 dark:border-slate-700/50 bg-slate-50/50 dark:bg-slate-800/30">
            <div className="flex flex-col gap-1">
              {NAV_LINKS.map((link) => {
                const active = isActive(link.href);
                return (
                  <Link
                    key={link.label}
                    href={link.href}
                    className={`px-4 py-3 text-base font-medium rounded-lg transition-all ${
                      active
                        ? "text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/15"
                        : "text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                    }`}
                    onClick={closeMenu}
                  >
                    {link.label}
                  </Link>
                );
              })}
              <div className="border-t border-slate-200/50 dark:border-slate-700/50 mt-2 pt-3 px-4 flex flex-col gap-2">
                {!mounted ? (
                  <>
                    <div className="h-10 w-full bg-slate-200 dark:bg-slate-700 rounded-lg animate-pulse" />
                    <div className="h-10 w-full bg-slate-200 dark:bg-slate-700 rounded-lg animate-pulse" />
                  </>
                ) : isLoggedIn ? (
                  <>
                    <Link href={dashboardPath} onClick={closeMenu}>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:bg-indigo-50 dark:hover:bg-slate-800 bg-transparent"
                      >
                        <User className="w-4 h-4 mr-1" />
                        {dashboardLabel}
                      </Button>
                    </Link>
                    <Button
                      onClick={() => {
                        handleLogout();
                        closeMenu();
                      }}
                      size="sm"
                      variant="destructive"
                      className="w-full bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800 text-white"
                    >
                      <LogOut className="w-4 h-4 mr-1" />
                      লগআউট
                    </Button>
                  </>
                ) : (
                  <>
                    <Link href="/login" onClick={closeMenu}>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:bg-indigo-50 dark:hover:bg-slate-800 bg-transparent"
                      >
                        <LogIn className="w-4 h-4 mr-1" />
                        লগইন
                      </Button>
                    </Link>
                    <Link href="/sign-up" onClick={closeMenu}>
                      <Button
                        size="sm"
                        className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 dark:from-indigo-500 dark:to-purple-500 dark:hover:from-indigo-600 dark:hover:to-purple-600 text-white"
                      >
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
