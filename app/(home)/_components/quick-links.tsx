import Link from "next/link";
import type { ElementType } from "react";
import {
  Trophy,
  FileText,
  GraduationCap,
  School,
  Globe,
  Command,
  ArrowUpRight,
} from "lucide-react";

type QuickLink = {
  title: string;
  subtitle: string;
  href: string;
  icon: ElementType;
  accent: string;
  tint: string;
};

const quickLinks: QuickLink[] = [
  {
    title: "Leaderboard",
    subtitle: "Top scorers",
    href: "/leaderboard",
    icon: Trophy,
    accent: "text-amber-700",
    tint: "bg-amber-100",
  },
  {
    title: "Result",
    subtitle: "Exam history",
    href: "#",
    icon: FileText,
    accent: "text-emerald-700",
    tint: "bg-emerald-100",
  },
  {
    title: "HSC",
    subtitle: "Full syllabus",
    href: "#",
    icon: GraduationCap,
    accent: "text-sky-700",
    tint: "bg-sky-100",
  },
  {
    title: "SSC",
    subtitle: "Crash prep",
    href: "#",
    icon: School,
    accent: "text-rose-700",
    tint: "bg-rose-100",
  },
  {
    title: "GK-English Crush Course",
    subtitle: "Daily practice",
    href: "#",
    icon: Globe,
    accent: "text-indigo-700",
    tint: "bg-indigo-100",
  },
  {
    title: "MCQ Exam & Challenges",
    subtitle: "Fast challenges",
    href: "/exams",
    icon: Command,
    accent: "text-teal-700",
    tint: "bg-teal-100",
  },
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
  return (
    <section className="relative py-12">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-24 top-10 h-48 w-48 rounded-full bg-purple-200/50 blur-3xl" />
        <div className="absolute right-10 top-4 h-40 w-40 rounded-full bg-cyan-200/40 blur-3xl" />
      </div>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-600 shadow-sm dark:border-white/10 dark:bg-white/10 dark:text-slate-300">
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
          <div className="hidden sm:flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-medium text-slate-600 shadow-sm dark:border-white/10 dark:bg-white/10 dark:text-slate-300">
            Start from anywhere
            <span className="h-1.5 w-8 rounded-full bg-linear-to-r from-purple-400 to-cyan-400" />
          </div>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {quickLinks.map((item) => (
            <QuickLinkCard key={item.title} item={item} />
          ))}
        </div>
      </div>
    </section>
  );
}
