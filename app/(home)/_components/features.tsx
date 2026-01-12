import { Card, CardContent } from "@/components/ui/card";
import { BookOpen, FlaskConical, Calculator, Languages, Globe, Microscope, Award, Target } from "lucide-react";

const sscSubjects = [
  {
    icon: Calculator,
    title: "গণিত (Mathematics)",
    description: "বীজগণিত, জ্যামিতি, ত্রিকোণমিতি সহ সম্পূর্ণ গণিত কোর্স",
    color: "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300",
  },
  {
    icon: Languages,
    title: "বাংলা (Bangla)",
    description: "ব্যাকরণ, সাহিত্য এবং রচনা দক্ষতা উন্নয়ন",
    color: "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300",
  },
  {
    icon: Globe,
    title: "ইংরেজি (English)",
    description: "Grammar, Literature এবং Writing Skills",
    color: "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300",
  },
  {
    icon: FlaskConical,
    title: "রসায়ন (Chemistry)",
    description: "জৈব, অজৈব এবং ভৌত রসায়নের সম্পূর্ণ কভারেজ",
    color: "bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300",
  },
  {
    icon: Microscope,
    title: "পদার্থবিজ্ঞান (Physics)",
    description: "মেকানিক্স, তাপ, আলো, বিদ্যুৎ ও চুম্বকত্ব",
    color: "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300",
  },
  {
    icon: BookOpen,
    title: "জীববিজ্ঞান (Biology)",
    description: "উদ্ভিদবিজ্ঞান ও প্রাণিবিজ্ঞানের বিস্তারিত লেসন",
    color: "bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300",
  },
];

const features = [
  {
    icon: Award,
    title: "অভিজ্ঞ শিক্ষক",
    description: "দেশসেরা শিক্ষকদের কাছ থেকে শিখুন",
  },
  {
    icon: Target,
    title: "পরীক্ষা প্রস্তুতি",
    description: "MCQ, CQ এবং সৃজনশীল প্রশ্ন অনুশীলন",
  },
  {
    icon: BookOpen,
    title: "ডিজিটাল নোট",
    description: "সহজে ডাউনলোড করুন এবং অফলাইন পড়ুন",
  },
];

export function Features() {
  return (
    <section className="py-20 bg-white dark:bg-black">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl md:text-5xl">
            আমাদের <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">কোর্সসমূহ</span>
          </h2>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            SSC ও HSC পরীক্ষার্থীদের জন্য সকল বিষয়ের সম্পূর্ণ সিলেবাস কভারেজ
          </p>
        </div>

        {/* Subject Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
          {sscSubjects.map((subject, index) => {
            const Icon = subject.icon;
            return (
              <Card
                key={index}
                className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-2 hover:border-blue-200 dark:hover:border-blue-800 cursor-pointer"
              >
                <CardContent className="p-6">
                  <div className={`w-14 h-14 rounded-xl ${subject.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-7 h-7" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {subject.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                    {subject.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Features Section */}
        <div className="border-t border-gray-200 dark:border-gray-800 pt-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="flex flex-col items-center text-center group">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
