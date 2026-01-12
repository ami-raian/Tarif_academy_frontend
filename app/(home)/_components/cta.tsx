import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";

export function CTA() {
  return (
    <section className="py-20 bg-gradient-to-br from-blue-600 via-blue-700 to-cyan-600 dark:from-blue-900 dark:via-blue-950 dark:to-cyan-900 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-white/[0.05] [mask-image:linear-gradient(0deg,transparent,rgba(255,255,255,0.6))]" />

      {/* Decorative Circles */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-white/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-cyan-400/10 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center rounded-full bg-white/20 backdrop-blur-sm px-4 py-2 mb-6">
            <Sparkles className="w-4 h-4 text-yellow-300 mr-2" />
            <span className="text-sm font-medium text-white">বিশেষ অফার চলছে</span>
          </div>

          <h2 className="text-3xl font-bold text-white sm:text-4xl md:text-5xl mb-6">
            আজই শুরু করুন আপনার{" "}
            <span className="bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
              সফলতার যাত্রা
            </span>
          </h2>

          <p className="text-lg text-blue-100 mb-8 max-w-2xl mx-auto leading-relaxed">
            হাজারো শিক্ষার্থী ইতিমধ্যে তারিফ একাডেমির সাথে তাদের স্বপ্ন পূরণ করছে।
            আপনিও যুক্ত হন আমাদের সাথে এবং নিশ্চিত করুন আপনার সফলতা।
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              size="lg"
              className="bg-white text-blue-600 hover:bg-blue-50 font-semibold text-base group shadow-xl"
            >
              ফ্রি ট্রায়াল শুরু করুন
              <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Button>

            <Button
              size="lg"
              variant="outline"
              className="bg-transparent border-2 border-white text-white hover:bg-white/10 font-semibold text-base"
            >
              আমাদের সম্পর্কে জানুন
            </Button>
          </div>

          {/* Trust Indicators */}
          <div className="mt-12 pt-8 border-t border-white/20">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-white">
              <div>
                <div className="text-3xl font-bold mb-1">98%</div>
                <div className="text-blue-100 text-sm">শিক্ষার্থী সন্তুষ্টি</div>
              </div>
              <div>
                <div className="text-3xl font-bold mb-1">24/7</div>
                <div className="text-blue-100 text-sm">সাপোর্ট সেবা</div>
              </div>
              <div>
                <div className="text-3xl font-bold mb-1">100%</div>
                <div className="text-blue-100 text-sm">মানি-ব্যাক গ্যারান্টি</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
