import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowRight, BookOpen } from "lucide-react";

const stats = [
  { value: "500+", label: "ভিডিও লেসন" },
  { value: "10K+", label: "শিক্ষার্থী" },
  { value: "50+", label: "অভিজ্ঞ শিক্ষক" },
];

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-linear-to-br from-violet-50 via-white to-cyan-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-300/30 dark:bg-purple-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-300/30 dark:bg-cyan-500/10 rounded-full blur-3xl" />
      </div>

      <div className="container relative mx-auto px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-8 items-center">
          {/* Content */}
          <div className="space-y-6">
            <div className="inline-flex items-center rounded-full bg-purple-100 dark:bg-purple-500/20 px-4 py-1.5 text-sm font-medium text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-500/30">
              বাংলাদেশের সেরা অনলাইন শিক্ষা প্ল্যাটফর্ম
            </div>

            <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl lg:text-6xl">
              স্বপ্ন পূরণের পথ{" "}
              <span className="bg-linear-to-r from-purple-600 to-cyan-500 dark:from-purple-400 dark:to-cyan-400 bg-clip-text text-transparent">
                তারিফ একাডেমি
              </span>
            </h1>

            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-xl leading-relaxed">
              SSC ও HSC পরীক্ষার্থীদের জন্য সম্পূর্ণ বিষয়ভিত্তিক লেসন, নোট এবং অনুশীলন।
              অভিজ্ঞ শিক্ষকদের গাইডেন্সে তোমার পড়াশোনাকে করো আরও সহজ।
            </p>

            <div className="flex flex-wrap gap-4">
              <Link href="/courses">
                <Button size="lg" className="bg-linear-to-r from-purple-600 to-cyan-500 hover:from-purple-700 hover:to-cyan-600 shadow-lg shadow-purple-500/25 dark:shadow-purple-500/20">
                  <BookOpen className="w-5 h-5 mr-2" />
                  শুরু করুন
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Link href="/courses">
                <Button size="lg" variant="outline" className="border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 dark:text-white">
                  কোর্স দেখুন
                </Button>
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 pt-6 border-t border-gray-200 dark:border-gray-700">
              {stats.map((stat) => (
                <div key={stat.label}>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white sm:text-3xl">
                    {stat.value}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Image */}
          <div className="relative flex items-center justify-center">
            <div className="absolute w-72 h-72 bg-linear-to-br from-purple-400/40 to-purple-600/40 dark:from-purple-500/20 dark:to-purple-700/20 rounded-full blur-3xl" />
            <div className="absolute w-72 h-72 bg-linear-to-br from-cyan-400/40 to-cyan-600/40 dark:from-cyan-500/20 dark:to-cyan-700/20 rounded-full blur-3xl translate-x-16 translate-y-8" />
            <div className="relative bg-white dark:bg-gray-800/80 rounded-2xl shadow-2xl dark:shadow-gray-900/50 p-8 backdrop-blur-sm border border-gray-100 dark:border-gray-700">
              <Image
                src="/tarifacademy-logo.png"
                alt="Tarif Academy"
                width={280}
                height={280}
                className="object-contain"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
