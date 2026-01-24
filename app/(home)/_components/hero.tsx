import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowRight, BookOpen, GraduationCap } from "lucide-react";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-linear-to-b from-blue-50 via-white to-white dark:from-gray-900 dark:via-gray-950 dark:to-black">
      <div className="absolute inset-0 bg-grid-slate-100 mask-[linear-gradient(0deg,white,rgba(255,255,255,0.6))] dark:bg-grid-slate-700/25 dark:mask-[linear-gradient(0deg,rgba(255,255,255,0.1),rgba(255,255,255,0.5))]" />

      <div className="container relative mx-auto px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-8 items-center">
          {/* Left Content */}
          <div className="flex flex-col justify-center space-y-8">
            <div className="space-y-4">
              <div className="inline-flex items-center rounded-full bg-blue-100 px-4 py-1.5 text-sm font-medium text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                <GraduationCap className="mr-2 h-4 w-4" />
                বাংলাদেশের সেরা অনলাইন শিক্ষা প্ল্যাটফর্ম
              </div>

              <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl md:text-6xl lg:text-7xl">
                স্বপ্ন পূরণের পথ{" "}
                <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                  তারিফ একাডেমি
                </span>
              </h1>

              <p className="text-lg text-gray-600 dark:text-gray-300 sm:text-xl">
                SSC ও HSC পরীক্ষার্থীদের জন্য সম্পূর্ণ বিষয়ভিত্তিক লেসন, নোট
                এবং অনুশীলন। অভিজ্ঞ শিক্ষকদের গাইডেন্সে তোমার পড়াশোনাকে করো আরও
                সহজ এবং কার্যকর।
              </p>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row sm:gap-6">
              <Button size="lg" className="group text-base font-semibold">
                <BookOpen className="mr-2 h-5 w-5" />
                শুরু করুন
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Button>

              <Button
                size="lg"
                variant="outline"
                className="text-base font-semibold"
              >
                কোর্স দেখুন
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 pt-8 border-t border-gray-200 dark:border-gray-800">
              <div>
                <div className="text-3xl font-bold text-gray-900 dark:text-white">
                  500+
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  ভিডিও লেসন
                </div>
              </div>
              <div>
                <div className="text-3xl font-bold text-gray-900 dark:text-white">
                  10K+
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  শিক্ষার্থী
                </div>
              </div>
              <div>
                <div className="text-3xl font-bold text-gray-900 dark:text-white">
                  50+
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  অভিজ্ঞ শিক্ষক
                </div>
              </div>
            </div>
          </div>

          {/* Right Content - Image/Illustration */}
          <div className="relative lg:h-150 flex items-center justify-center">
            <div className="relative w-full max-w-lg">
              {/* Decorative Elements */}
              <div className="absolute -top-4 -left-4 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob dark:bg-blue-900/30" />
              <div className="absolute -top-4 -right-4 w-72 h-72 bg-cyan-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000 dark:bg-cyan-900/30" />
              <div className="absolute -bottom-8 left-20 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000 dark:bg-purple-900/30" />

              {/* Central Image/Logo */}
              <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 backdrop-blur-sm">
                <div className="relative w-full h-64 flex items-center justify-center">
                  <Image
                    src="/tarifacademy-logo.png"
                    alt="Tarif Academy Logo"
                    width={300}
                    height={300}
                    className="object-contain"
                    priority
                  />
                </div>

                {/* Floating Cards */}
                <div className="absolute -left-6 top-1/4 bg-white dark:bg-gray-900 rounded-lg shadow-lg p-3 animate-float">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                      <span className="text-2xl">📚</span>
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-gray-900 dark:text-white">
                        Physics
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        50 Lessons
                      </div>
                    </div>
                  </div>
                </div>

                <div className="absolute -right-6 bottom-1/4 bg-white dark:bg-gray-900 rounded-lg shadow-lg p-3 animate-float animation-delay-2000">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center">
                      <span className="text-2xl">🧪</span>
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-gray-900 dark:text-white">
                        Chemistry
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        45 Lessons
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
