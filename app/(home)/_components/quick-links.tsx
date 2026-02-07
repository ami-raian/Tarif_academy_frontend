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
    href: "#",
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
    title: "Quiz Command",
    subtitle: "Fast challenges",
    href: "#",
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
    <section className="relative py-10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-5 flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-400 dark:text-slate-500">
              Explore
            </p>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white sm:text-3xl">
              Popular Shortcuts
            </h2>
          </div>
          <div className="hidden sm:block text-sm text-slate-500 dark:text-slate-400">
            Start from anywhere
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
