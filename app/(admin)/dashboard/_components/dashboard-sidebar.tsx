"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import {
  LayoutDashboard,
  HelpCircle,
  Users,
  GraduationCap,
  Home,
  LogOut,
  X,
  Moon,
  Sun,
  ChevronRight,
  UserCircle2,
  FolderKanban,
} from "lucide-react";

const navLinks = [
  { href: "/dashboard", label: "ড্যাশবোর্ড", icon: LayoutDashboard },
  {
    href: "/dashboard/categories",
    label: "কোর্স ক্যাটাগরি",
    icon: FolderKanban,
  },
  { href: "/dashboard/mcq", label: "MCQ পরীক্ষা", icon: HelpCircle },
  { href: "/dashboard/enrollments", label: "এনরোলমেন্ট", icon: Users },
  { href: "/dashboard/students", label: "শিক্ষার্থী", icon: GraduationCap },
];

function deleteCookie(name: string) {
  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
}

interface DashboardSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function DashboardSidebar({
  isOpen,
  onClose,
}: DashboardSidebarProps) {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();

  const isActive = (href: string) => {
    if (href === "/dashboard") return pathname === "/dashboard";
    return pathname.startsWith(href);
  };

  const handleLogout = () => {
    ["accessToken", "refreshToken", "userType"].forEach(deleteCookie);
    window.location.href = "/";
  };

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-50 h-full w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Brand */}
        <div className="flex items-center justify-between h-16 px-5 border-b border-gray-200 dark:border-gray-800 my-1">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-linear-to-br from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-500/30">
              <GraduationCap className="w-4.5 h-4.5 text-white" />
            </div>
            <span className="text-base font-bold text-slate-900 dark:text-white">
              Tarif Academy
            </span>
          </Link>
          <button
            onClick={onClose}
            className="lg:hidden w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:text-gray-300 dark:hover:bg-gray-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          <p className="px-3 mb-3 text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-gray-500">
            মেনু
          </p>
          {navLinks.map((link) => {
            const active = isActive(link.href);
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={onClose}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  active
                    ? "bg-indigo-50 dark:bg-indigo-500/15 text-indigo-700 dark:text-indigo-400"
                    : "text-slate-600 dark:text-gray-400 hover:bg-slate-100 dark:hover:bg-gray-800 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                <Icon
                  className={`w-5 h-5 ${
                    active
                      ? "text-indigo-600 dark:text-indigo-400"
                      : "text-slate-400 dark:text-gray-500"
                  }`}
                />
                {link.label}
                {active && (
                  <div className="ml-auto w-1.5 h-1.5 rounded-full bg-indigo-600 dark:bg-indigo-400" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Bottom section */}
        <div className="px-4 py-4 border-t border-gray-200 dark:border-gray-800 space-y-4">
          {/* Appearance Toggle */}
          <div className="flex items-center justify-between py-2">
            <span className="text-sm font-medium text-slate-600 dark:text-gray-400">
              Appearance
            </span>
            <button
              onClick={toggleTheme}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                theme === "dark"
                  ? "bg-slate-400 dark:bg-gray-600"
                  : "bg-slate-300"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform ${
                  theme === "dark" ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>

          {/* User Profile Card */}
          <div className="bg-slate-100 dark:bg-gray-800 rounded-xl p-3 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm shadow-md">
              <UserCircle2 className="w-6 h-6" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                Admin User
              </p>
              <p className="text-xs text-slate-500 dark:text-gray-400 truncate">
                admin@tarifacademy.com
              </p>
            </div>
            <ChevronRight className="w-5 h-5 text-slate-400 dark:text-gray-500 flex-shrink-0" />
          </div>

          <Link
            href="/"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-600 dark:text-gray-400 hover:bg-slate-100 dark:hover:bg-gray-800 hover:text-slate-900 dark:hover:text-white transition-all"
          >
            <Home className="w-5 h-5 text-slate-400 dark:text-gray-500" />
            হোম
          </Link>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="group relative flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-600 dark:text-red-400 hover:bg-gradient-to-r hover:from-red-50 hover:to-red-100 dark:hover:from-red-950/30 dark:hover:to-red-900/30 transition-all w-full overflow-hidden"
          >
            <div className="absolute inset-0 bg-red-50 dark:bg-red-950/20 opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative flex items-center gap-3 w-full">
              <div className="w-8 h-8 rounded-lg bg-red-100 dark:bg-red-900/30 flex items-center justify-center group-hover:bg-red-200 dark:group-hover:bg-red-900/50 transition-colors">
                <LogOut className="w-4 h-4" />
              </div>
              <span className="font-semibold">লগআউট</span>
            </div>
          </button>
        </div>
      </aside>
    </>
  );
}
