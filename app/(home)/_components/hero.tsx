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
    <section className="relative bg-gradient-to-b from-purple-50 to-white dark:from-gray-900 dark:to-gray-950">
      <div className="container mx-auto px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-8 items-center">
          {/* Content */}
          <div className="space-y-6">
            <div className="inline-flex items-center rounded-full bg-purple-100 dark:bg-purple-900/30 px-4 py-1.5 text-sm font-medium text-purple-700 dark:text-purple-300">
              বাংলাদেশের সেরা অনলাইন শিক্ষা প্ল্যাটফর্ম
            </div>

            <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl lg:text-6xl">
              স্বপ্ন পূরণের পথ{" "}
              <span className="bg-linear-to-r from-purple-600 to-cyan-500 bg-clip-text text-transparent">
                তারিফ একাডেমি
              </span>
            </h1>

            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-xl">
              SSC ও HSC পরীক্ষার্থীদের জন্য সম্পূর্ণ বিষয়ভিত্তিক লেসন, নোট এবং অনুশীলন।
              অভিজ্ঞ শিক্ষকদের গাইডেন্সে তোমার পড়াশোনাকে করো আরও সহজ।
            </p>

            <div className="flex flex-wrap gap-4">
              <Link href="/courses">
                <Button size="lg" className="bg-linear-to-r from-purple-600 to-cyan-500 hover:from-purple-700 hover:to-cyan-600">
                  <BookOpen className="w-5 h-5 mr-2" />
                  শুরু করুন
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Link href="/courses">
                <Button size="lg" variant="outline">
                  কোর্স দেখুন
                </Button>
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 pt-6 border-t border-gray-200 dark:border-gray-800">
              {stats.map((stat) => (
                <div key={stat.label}>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white sm:text-3xl">
                    {stat.value}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Image */}
          <div className="relative flex items-center justify-center">
            <div className="absolute w-64 h-64 bg-purple-200 dark:bg-purple-900/20 rounded-full blur-3xl opacity-50" />
            <div className="absolute w-64 h-64 bg-cyan-200 dark:bg-cyan-900/20 rounded-full blur-3xl opacity-50 translate-x-20" />
            <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
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
