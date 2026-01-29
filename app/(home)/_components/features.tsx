import { Card, CardContent } from "@/components/ui/card";
import {
  BookOpen,
  FlaskConical,
  Calculator,
  Languages,
  Globe,
  Microscope,
  Award,
  Target,
} from "lucide-react";

const subjects = [
  {
    icon: Calculator,
    title: "গণিত",
    description: "বীজগণিত, জ্যামিতি, ত্রিকোণমিতি",
    iconColor: "text-blue-600 dark:text-blue-400",
    bgColor: "bg-blue-100 dark:bg-blue-500/20",
  },
  {
    icon: Languages,
    title: "বাংলা",
    description: "ব্যাকরণ, সাহিত্য এবং রচনা",
    iconColor: "text-emerald-600 dark:text-emerald-400",
    bgColor: "bg-emerald-100 dark:bg-emerald-500/20",
  },
  {
    icon: Globe,
    title: "ইংরেজি",
    description: "Grammar ও Writing Skills",
    iconColor: "text-violet-600 dark:text-violet-400",
    bgColor: "bg-violet-100 dark:bg-violet-500/20",
  },
  {
    icon: FlaskConical,
    title: "রসায়ন",
    description: "জৈব, অজৈব ও ভৌত রসায়ন",
    iconColor: "text-orange-600 dark:text-orange-400",
    bgColor: "bg-orange-100 dark:bg-orange-500/20",
  },
  {
    icon: Microscope,
    title: "পদার্থবিজ্ঞান",
    description: "মেকানিক্স, তাপ, আলো, বিদ্যুৎ",
    iconColor: "text-rose-600 dark:text-rose-400",
    bgColor: "bg-rose-100 dark:bg-rose-500/20",
  },
  {
    icon: BookOpen,
    title: "জীববিজ্ঞান",
    description: "উদ্ভিদবিজ্ঞান ও প্রাণিবিজ্ঞান",
    iconColor: "text-teal-600 dark:text-teal-400",
    bgColor: "bg-teal-100 dark:bg-teal-500/20",
  },
];

const features = [
  { icon: Award, title: "অভিজ্ঞ শিক্ষক", description: "দেশসেরা শিক্ষকদের কাছ থেকে শিখুন" },
  { icon: Target, title: "পরীক্ষা প্রস্তুতি", description: "MCQ, CQ অনুশীলন" },
  { icon: BookOpen, title: "ডিজিটাল নোট", description: "সহজে ডাউনলোড করুন" },
];

export function Features() {
  return (
    <section className="relative py-16 bg-gray-50 dark:bg-gray-900">
      {/* Dark mode subtle gradient */}
      <div className="absolute inset-0 hidden dark:block">
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-600/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-cyan-600/5 rounded-full blur-3xl" />
      </div>

      <div className="container relative mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">
            আমাদের{" "}
            <span className="bg-linear-to-r from-purple-600 to-cyan-500 dark:from-purple-400 dark:to-cyan-400 bg-clip-text text-transparent">
              কোর্সসমূহ
            </span>
          </h2>
          <p className="mt-3 text-gray-600 dark:text-gray-400 max-w-xl mx-auto">
            SSC ও HSC পরীক্ষার্থীদের জন্য সকল বিষয়ের সম্পূর্ণ সিলেবাস কভারেজ
          </p>
        </div>

        {/* Subject Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-16">
          {subjects.map((subject) => {
            const Icon = subject.icon;
            return (
              <Card
                key={subject.title}
                className="group hover:shadow-lg transition-all duration-300 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-500/50"
              >
                <CardContent className="p-5">
                  <div className={`w-12 h-12 rounded-xl ${subject.bgColor} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                    <Icon className={`w-6 h-6 ${subject.iconColor}`} />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                    {subject.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{subject.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Features */}
        <div className="border-t border-gray-200 dark:border-gray-700 pt-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <div key={feature.title} className="flex flex-col items-center text-center group">
                  <div className="w-14 h-14 rounded-full bg-linear-to-br from-purple-500 to-cyan-500 dark:from-purple-400 dark:to-cyan-400 flex items-center justify-center mb-3 shadow-lg shadow-purple-500/25 dark:shadow-purple-500/30 group-hover:scale-110 transition-transform">
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">{feature.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
