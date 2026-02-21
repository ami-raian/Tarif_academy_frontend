"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import type { ElementType } from "react";
import {
  Trophy,
  FileText,
  Command,
  ArrowUpRight,
  BookOpen,
} from "lucide-react";
import { getCourseCategories, type CourseCategory } from "@/lib/api";

type QuickLink = {
  title: string;
  subtitle: string;
  href: string;
  icon: ElementType;
  accent: string;
  tint: string;
};

const staticLinks: QuickLink[] = [
  {
    title: "Leaderboard",
    subtitle: "Top scorers",
    href: "/leaderboard",
    icon: Trophy,
    accent: "text-amber-700",
    tint: "bg-amber-100",
  },
  {
    title: "MCQ Exam & Challenges",
    subtitle: "Fast challenges",
    href: "/exams",
    icon: Command,
    accent: "text-teal-700",
    tint: "bg-teal-100",
  },
  {
    title: "Result",
    subtitle: "Exam history",
    href: "/results",
    icon: FileText,
    accent: "text-emerald-700",
    tint: "bg-emerald-100",
  },
];

// Color combinations for dynamic categories
const categoryColors = [
  { accent: "text-sky-700", tint: "bg-sky-100" },
  { accent: "text-rose-700", tint: "bg-rose-100" },
  { accent: "text-indigo-700", tint: "bg-indigo-100" },
  { accent: "text-purple-700", tint: "bg-purple-100" },
  { accent: "text-pink-700", tint: "bg-pink-100" },
  { accent: "text-orange-700", tint: "bg-orange-100" },
  { accent: "text-cyan-700", tint: "bg-cyan-100" },
  { accent: "text-violet-700", tint: "bg-violet-100" },
];

const QuickLinkCard = ({ item }: { item: QuickLink }) => {
  const Icon = item.icon;
  return (
    <Link
      href={item.href}
      className="group relative flex items-center gap-4 rounded-2xl border border-black/5 bg-white/80 p-4 shadow-sm backdrop-blur-sm transition-all hover:-translate-y-0.5 hover:shadow-lg dark:border-white/10 dark:bg-white/5 dark:shadow-[0_10px_30px_rgba(0,0,0,0.35)]"
    >
      <div
        className={`relative grid h-12 w-12 place-items-center rounded-xl ${item.tint} ring-1 ring-black/5 dark:bg-white/10 dark:ring-white/10`}
      >
        <Icon className={`h-6 w-6 ${item.accent}`} />
        <span className="absolute -right-1 -top-1 h-3 w-3 rounded-full bg-white shadow dark:bg-white/70" />
      </div>
      <div className="min-w-0">
        <div className="flex items-center gap-2">
          <h3 className="truncate text-base font-semibold text-slate-900 dark:text-white">
            {item.title}
          </h3>
          <ArrowUpRight className="h-4 w-4 text-slate-400 opacity-0 transition-opacity group-hover:opacity-100 dark:text-slate-300" />
        </div>
        <p className="text-sm text-slate-500 dark:text-slate-300">
          {item.subtitle}
        </p>
      </div>
      <div className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-transparent transition group-hover:ring-slate-200 dark:group-hover:ring-white/20" />
      <div className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity group-hover:opacity-100 dark:bg-linear-to-br dark:from-white/10 dark:via-transparent dark:to-transparent" />
    </Link>
  );
};

export function QuickLinks() {
  const [categories, setCategories] = useState<CourseCategory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await getCourseCategories({ isActive: true, limit: 50 });
        if (res.success) {
          setCategories(res.data);
        }
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  // Convert categories to QuickLink format
  const categoryLinks: QuickLink[] = categories.map((category, index) => ({
    title: category.name,
    subtitle: category.description || "Explore courses",
    href: `/courses?categoryId=${category._id}`,
    icon: BookOpen,
    accent: categoryColors[index % categoryColors.length].accent,
    tint: categoryColors[index % categoryColors.length].tint,
  }));

  return (
    <section className="relative py-12">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-24 top-10 h-48 w-48 rounded-full bg-purple-200/50 blur-3xl" />
        <div className="absolute right-10 top-4 h-40 w-40 rounded-full bg-cyan-200/40 blur-3xl" />
      </div>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-600 shadow-sm dark:border-white/10 dark:bg-white/10 dark:text-slate-300">
              <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.65)]" />
              Explore
            </div>
            <h2 className="mt-3 text-3xl font-semibold text-slate-900 dark:text-white sm:text-4xl">
              Popular{" "}
              <span className="bg-linear-to-r from-slate-900 via-purple-700 to-cyan-600 bg-clip-text text-transparent dark:from-white dark:via-purple-300 dark:to-cyan-300">
                Shortcuts
              </span>
            </h2>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
              Jump into your next lesson in one click.
            </p>
          </div>
          <div className="hidden sm:flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2 text-xs font-medium text-slate-600 shadow-sm dark:border-white/10 dark:bg-white/10 dark:text-slate-300">
            Start from anywhere
            <span className="h-1.5 w-8 rounded-full bg-linear-to-r from-purple-400 to-cyan-400" />
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="h-20 rounded-2xl border border-black/5 bg-white/80 animate-pulse dark:border-white/10 dark:bg-white/5"
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {staticLinks.map((item) => (
              <QuickLinkCard key={item.title} item={item} />
            ))}
            {categoryLinks.map((item) => (
              <QuickLinkCard key={item.title} item={item} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
