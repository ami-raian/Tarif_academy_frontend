import { Award, Target, BookOpen, Users, Video, Trophy } from "lucide-react";

const features = [
  {
    icon: Award,
    title: "অভিজ্ঞ শিক্ষক",
    description: "দেশসেরা শিক্ষকদের কাছ থেকে শিখুন",
  },
  {
    icon: Video,
    title: "লাইভ ক্লাস",
    description: "Interactive লাইভ সেশন ও সাপোর্ট",
  },
  {
    icon: Target,
    title: "পরীক্ষা প্রস্তুতি",
    description: "MCQ, CQ ও মডেল টেস্ট",
  },
  {
    icon: BookOpen,
    title: "ডিজিটাল নোট",
    description: "PDF নোট ও রিসোর্স ডাউনলোড",
  },
  {
    icon: Users,
    title: "কমিউনিটি সাপোর্ট",
    description: "১০,০০০+ শিক্ষার্থীর নেটওয়ার্ক",
  },
  {
    icon: Trophy,
    title: "সার্টিফিকেট",
    description: "কোর্স সম্পন্ন করলে সার্টিফিকেট",
  },
];

export function Features() {
  return (
    <section className="relative py-16">
      <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">
            কেন{" "}
            <span className="bg-linear-to-r from-purple-600 to-cyan-500 dark:from-purple-400 dark:to-cyan-400 bg-clip-text text-transparent">
              তারিফ একাডেমি?
            </span>
          </h2>
          <p className="mt-3 text-gray-600 dark:text-gray-400 max-w-xl mx-auto">
            আমরা প্রদান করি সম্পূর্ণ অনলাইন শিক্ষা সমাধান
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className="group relative p-6 rounded-2xl bg-white/80 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 hover:border-purple-300 dark:hover:border-purple-500/50 hover:shadow-lg transition-all duration-300"
              >
                <div className="flex items-start gap-4">
                  <div className="shrink-0 w-12 h-12 rounded-xl bg-linear-to-br from-purple-500 to-cyan-500 dark:from-purple-400 dark:to-cyan-400 flex items-center justify-center shadow-lg shadow-purple-500/25 dark:shadow-purple-500/30 group-hover:scale-110 transition-transform">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
