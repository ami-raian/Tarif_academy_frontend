// import Link from "next/link";
// import { Button } from "@/components/ui/button";
// import { ArrowRight, Sparkles } from "lucide-react";

// const stats = [
//   { value: "98%", label: "শিক্ষার্থী সন্তুষ্টি" },
//   { value: "24/7", label: "সাপোর্ট সেবা" },
//   { value: "100%", label: "মানি-ব্যাক গ্যারান্টি" },
// ];

// export function CTA() {
//   return (
//     <section className="relative py-16 overflow-hidden">
//       {/* Background */}
//       <div className="absolute inset-0 bg-linear-to-br from-purple-600 via-violet-600 to-cyan-500 dark:from-purple-900 dark:via-violet-900 dark:to-cyan-900" />
//       <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2230%22 height=%2230%22 viewBox=%220 0 30 30%22 fill=%22none%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cpath d=%22M1.22676 0C1.91374 0 2.45351 0.539773 2.45351 1.22676C2.45351 1.91374 1.91374 2.45351 1.22676 2.45351C0.539773 2.45351 0 1.91374 0 1.22676C0 0.539773 0.539773 0 1.22676 0Z%22 fill=%22rgba(255,255,255,0.07)%22/%3E%3C/svg%3E')] opacity-50" />

//       <div className="container relative mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="max-w-3xl mx-auto text-center">
//           {/* Badge */}
//           <div className="inline-flex items-center rounded-full bg-white/20 dark:bg-white/10 backdrop-blur-sm px-4 py-1.5 mb-6 border border-white/20">
//             <Sparkles className="w-4 h-4 text-yellow-300 mr-2" />
//             <span className="text-sm font-medium text-white">
//               বিশেষ অফার চলছে
//             </span>
//           </div>

//           <h2 className="text-3xl font-bold text-white sm:text-4xl mb-4">
//             আজই শুরু করুন আপনার{" "}
//             <span className="text-yellow-300 dark:text-yellow-200">
//               সফলতার যাত্রা
//             </span>
//           </h2>

//           <p className="text-lg text-white/80 dark:text-white/70 mb-8 max-w-xl mx-auto">
//             হাজারো শিক্ষার্থী ইতিমধ্যে তারিফ একাডেমির সাথে তাদের স্বপ্ন পূরণ
//             করছে।
//           </p>

//           <div className="flex flex-col sm:flex-row gap-4 justify-center">
//             <Link href="/sign-up">
//               <Button
//                 size="lg"
//                 className="bg-white text-purple-600 hover:bg-white/90 shadow-xl shadow-black/20"
//               >
//                 ফ্রি ট্রায়াল শুরু করুন
//                 <ArrowRight className="w-5 h-5 ml-2" />
//               </Button>
//             </Link>
//             <Link href="/about">
//               <Button
//                 size="lg"
//                 variant="outline"
//                 className="border-2 border-white/50 text-white bg-white/10 hover:bg-white/20 backdrop-blur-sm"
//               >
//                 আমাদের সম্পর্কে জানুন
//               </Button>
//             </Link>
//           </div>

//           {/* Stats */}
//           <div className="mt-12 pt-8 border-t border-white/20 grid grid-cols-3 gap-4">
//             {stats.map((stat) => (
//               <div key={stat.label}>
//                 <div className="text-2xl font-bold text-white sm:text-3xl">
//                   {stat.value}
//                 </div>
//                 <div className="text-sm text-white/70">{stat.label}</div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// }
