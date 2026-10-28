"use client";

import { useState, useSyncExternalStore } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Menu,
  X,
  LogIn,
  UserPlus,
  LogOut,
  User,
  Sun,
  Moon,
  ClipboardList,
  Settings,
  BookCheck,
} from "lucide-react";

const NAV_LINKS = [
  { href: "/", label: "হোম" },
  { href: "/courses", label: "কোর্স সমূহ" },
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

  return (
    <nav className="fixed inset-x-0 top-0 z-50 bg-white/85 dark:bg-slate-900/90 backdrop-blur-xl border-b border-gray-200/40 dark:border-slate-700/50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <Image
              src="/tarifAcademyLogo.png"
              alt="Tarif Academy"
              width={150}
              height={28}
              className="block dark:hidden transition-all duration-300 group-hover:opacity-90"
              priority
            />
            <Image
              src="/tarifAcademyLogo-dark.png"
              alt="Tarif Academy"
              width={150}
              height={28}
              className="hidden dark:block transition-all duration-300 group-hover:opacity-90"
              priority
            />
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
          <div className="hidden md:flex items-center gap-3">
            {!mounted ? (
              <>
                <div className="h-10 w-10 bg-slate-200 dark:bg-slate-700 rounded-full animate-pulse" />
                <div className="h-10 w-10 bg-slate-200 dark:bg-slate-700 rounded-full animate-pulse" />
              </>
            ) : (
              <>
                <button
                  onClick={toggleTheme}
                  className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 hover:scale-105 active:scale-95 transition-all duration-200 flex items-center justify-center"
                  aria-label="Toggle theme"
                >
                  {theme === "dark" ? (
                    <Sun className="w-5 h-5" />
                  ) : (
                    <Moon className="w-5 h-5" />
                  )}
                </button>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="w-10 h-10 rounded-full bg-linear-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:scale-105 active:scale-95 transition-all duration-200">
                      <User className="w-5 h-5" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="w-52 p-2 rounded-xl shadow-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900"
                  >
                    {isLoggedIn ? (
                      <>
                        <DropdownMenuItem
                          asChild
                          className="rounded-lg px-3 py-2.5 cursor-pointer"
                        >
                          <Link
                            href={dashboardPath}
                            className="flex items-center gap-3"
                          >
                            <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-500/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                              <User className="w-4 h-4" />
                            </div>
                            <span className="font-medium">
                              {dashboardLabel}
                            </span>
                          </Link>
                        </DropdownMenuItem>
                        {userType === "student" && (
                          <DropdownMenuItem
                            asChild
                            className="rounded-lg px-3 py-2.5 cursor-pointer"
                          >
                            <Link
                              href="/exams"
                              className="flex items-center gap-3"
                            >
                              <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-500/20 flex items-center justify-center text-purple-600 dark:text-purple-400">
                                <ClipboardList className="w-4 h-4" />
                              </div>
                              <span className="font-medium">MCQ পরীক্ষা</span>
                            </Link>
                          </DropdownMenuItem>
                        )}
                        {userType === "student" && (
                          <DropdownMenuItem
                            asChild
                            className="rounded-lg px-3 py-2.5 cursor-pointer"
                          >
                            <Link
                              href="/study-log"
                              className="flex items-center gap-3"
                            >
                              <div className="w-8 h-8 rounded-full bg-violet-100 dark:bg-violet-500/20 flex items-center justify-center text-violet-600 dark:text-violet-400">
                                <BookCheck className="w-4 h-4" />
                              </div>
                              <span className="font-medium">Study Log</span>
                            </Link>
                          </DropdownMenuItem>
                        )}
                        {userType === "student" && (
                          <DropdownMenuItem
                            asChild
                            className="rounded-lg px-3 py-2.5 cursor-pointer"
                          >
                            <Link
                              href="/profile"
                              className="flex items-center gap-3"
                            >
                              <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                                <Settings className="w-4 h-4" />
                              </div>
                              <span className="font-medium">প্রোফাইল</span>
                            </Link>
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuSeparator className="my-2" />
                        <DropdownMenuItem
                          onClick={handleLogout}
                          className="rounded-lg px-3 py-2.5 cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-950/50"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-red-100 dark:bg-red-500/20 flex items-center justify-center">
                              <LogOut className="w-4 h-4" />
                            </div>
                            <span className="font-medium">লগআউট</span>
                          </div>
                        </DropdownMenuItem>
                      </>
                    ) : (
                      <>
                        <DropdownMenuItem
                          asChild
                          className="rounded-lg px-3 py-2.5 cursor-pointer"
                        >
                          <Link
                            href="/login"
                            className="flex items-center gap-3"
                          >
                            <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-500/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                              <LogIn className="w-4 h-4" />
                            </div>
                            <span className="font-medium">লগইন</span>
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          asChild
                          className="rounded-lg px-3 py-2.5 cursor-pointer"
                        >
                          <Link
                            href="/sign-up"
                            className="flex items-center gap-3"
                          >
                            <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-500/20 flex items-center justify-center text-purple-600 dark:text-purple-400">
                              <UserPlus className="w-4 h-4" />
                            </div>
                            <span className="font-medium">সাইন আপ</span>
                          </Link>
                        </DropdownMenuItem>
                      </>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            )}
          </div>

          {/* Mobile Actions */}
          <div className="flex md:hidden items-center gap-2">
            {!mounted ? (
              <div className="w-9 h-9 bg-slate-200 dark:bg-slate-700 rounded-full animate-pulse" />
            ) : (
              <button
                onClick={toggleTheme}
                className="w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 active:scale-95 transition-all duration-200 flex items-center justify-center"
                aria-label="Toggle theme"
              >
                {theme === "dark" ? (
                  <Sun className="w-5 h-5" />
                ) : (
                  <Moon className="w-5 h-5" />
                )}
              </button>
            )}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 active:scale-95 transition-all duration-200 flex items-center justify-center"
            >
              {isMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200/50 dark:border-slate-700/50 bg-slate-50/50 dark:bg-slate-800/30">
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
              <div className="border-t border-gray-200/50 dark:border-slate-700/50 mt-2 pt-3 px-4 flex flex-col gap-2">
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
                        className="w-full border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:bg-indigo-50 dark:hover:bg-slate-800 bg-transparent"
                      >
                        <User className="w-4 h-4 mr-1" />
                        {dashboardLabel}
                      </Button>
                    </Link>
                    {userType === "student" && (
                      <Link href="/exams" onClick={closeMenu}>
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:bg-indigo-50 dark:hover:bg-slate-800 bg-transparent"
                        >
                          <ClipboardList className="w-4 h-4 mr-1" />
                          MCQ পরীক্ষা
                        </Button>
                      </Link>
                    )}
                    {userType === "student" && (
                      <Link href="/study-log" onClick={closeMenu}>
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full border-slate-200 dark:border-slate-600 text-violet-600 dark:text-violet-400 hover:bg-violet-50 dark:hover:bg-slate-800 bg-transparent"
                        >
                          <BookCheck className="w-4 h-4 mr-1" />
                          Study Log
                        </Button>
                      </Link>
                    )}
                    {userType === "student" && (
                      <Link href="/profile" onClick={closeMenu}>
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:bg-indigo-50 dark:hover:bg-slate-800 bg-transparent"
                        >
                          <Settings className="w-4 h-4 mr-1" />
                          প্রোফাইল
                        </Button>
                      </Link>
                    )}
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
                        className="w-full border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:bg-indigo-50 dark:hover:bg-slate-800 bg-transparent"
                      >
                        <LogIn className="w-4 h-4 mr-1" />
                        লগইন
                      </Button>
                    </Link>
                    <Link href="/sign-up" onClick={closeMenu}>
                      <Button
                        size="sm"
                        className="w-full bg-linear-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 dark:from-indigo-500 dark:to-purple-500 dark:hover:from-indigo-600 dark:hover:to-purple-600 text-white"
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
