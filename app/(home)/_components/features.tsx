import { Card, CardContent } from "@/components/ui/card";
import { BookOpen, FlaskConical, Calculator, Languages, Globe, Microscope, Award, Target } from "lucide-react";

const subjects = [
  { icon: Calculator, title: "গণিত", description: "বীজগণিত, জ্যামিতি, ত্রিকোণমিতি", color: "text-blue-600 bg-blue-100 dark:bg-blue-900/30" },
  { icon: Languages, title: "বাংলা", description: "ব্যাকরণ, সাহিত্য এবং রচনা", color: "text-green-600 bg-green-100 dark:bg-green-900/30" },
  { icon: Globe, title: "ইংরেজি", description: "Grammar ও Writing Skills", color: "text-purple-600 bg-purple-100 dark:bg-purple-900/30" },
  { icon: FlaskConical, title: "রসায়ন", description: "জৈব, অজৈব ও ভৌত রসায়ন", color: "text-orange-600 bg-orange-100 dark:bg-orange-900/30" },
  { icon: Microscope, title: "পদার্থবিজ্ঞান", description: "মেকানিক্স, তাপ, আলো, বিদ্যুৎ", color: "text-red-600 bg-red-100 dark:bg-red-900/30" },
  { icon: BookOpen, title: "জীববিজ্ঞান", description: "উদ্ভিদবিজ্ঞান ও প্রাণিবিজ্ঞান", color: "text-teal-600 bg-teal-100 dark:bg-teal-900/30" },
];

const features = [
  { icon: Award, title: "অভিজ্ঞ শিক্ষক", description: "দেশসেরা শিক্ষকদের কাছ থেকে শিখুন" },
  { icon: Target, title: "পরীক্ষা প্রস্তুতি", description: "MCQ, CQ অনুশীলন" },
  { icon: BookOpen, title: "ডিজিটাল নোট", description: "সহজে ডাউনলোড করুন" },
];

export function Features() {
  return (
    <section className="py-16 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">
            আমাদের <span className="text-purple-600">কোর্সসমূহ</span>
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
              <Card key={subject.title} className="hover:shadow-lg transition-shadow dark:bg-gray-800 dark:border-gray-700">
                <CardContent className="p-5">
                  <div className={`w-12 h-12 rounded-lg ${subject.color} flex items-center justify-center mb-3`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">{subject.title}</h3>
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
                <div key={feature.title} className="flex flex-col items-center text-center">
                  <div className="w-14 h-14 rounded-full bg-linear-to-br from-purple-500 to-cyan-500 flex items-center justify-center mb-3">
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
