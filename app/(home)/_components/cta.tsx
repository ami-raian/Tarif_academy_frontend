import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const stats = [
  { value: "98%", label: "শিক্ষার্থী সন্তুষ্টি" },
  { value: "24/7", label: "সাপোর্ট সেবা" },
  { value: "100%", label: "মানি-ব্যাক গ্যারান্টি" },
];

export function CTA() {
  return (
    <section className="py-16 bg-linear-to-r from-purple-600 to-cyan-600 dark:from-purple-900 dark:to-cyan-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white sm:text-4xl mb-4">
            আজই শুরু করুন আপনার{" "}
            <span className="text-yellow-300">সফলতার যাত্রা</span>
          </h2>

          <p className="text-lg text-purple-100 mb-8 max-w-xl mx-auto">
            হাজারো শিক্ষার্থী ইতিমধ্যে তারিফ একাডেমির সাথে তাদের স্বপ্ন পূরণ করছে।
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/sign-up">
              <Button size="lg" className="bg-white text-purple-600 hover:bg-gray-100">
                ফ্রি ট্রায়াল শুরু করুন
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Link href="/about">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                আমাদের সম্পর্কে জানুন
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="mt-12 pt-8 border-t border-white/20 grid grid-cols-3 gap-4">
            {stats.map((stat) => (
              <div key={stat.label} className="text-white">
                <div className="text-2xl font-bold sm:text-3xl">{stat.value}</div>
                <div className="text-sm text-purple-100">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
