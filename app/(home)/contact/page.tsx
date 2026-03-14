"use client";

import { Navbar } from "@/app/(home)/_components/navbar";
import { Phone, Mail, MapPin, MessageCircle } from "lucide-react";

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      <Navbar />

      <main className="pt-28 pb-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-3">
              যোগাযোগ করুন
            </h1>
            <p className="text-gray-500 dark:text-gray-400">
              যেকোনো প্রশ্ন বা সাহায্যের জন্য আমাদের সাথে যোগাযোগ করুন
            </p>
          </div>

          {/* Contact cards */}
          <div className="grid gap-5 sm:grid-cols-3 mb-10">
            <a
              href="tel:+8801315743441"
              className="group flex flex-col items-center gap-3 rounded-2xl border border-black/5 bg-white/80 p-6 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all dark:border-white/10 dark:bg-white/5 text-center"
            >
              <div className="w-12 h-12 rounded-xl bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center group-hover:bg-violet-200 dark:group-hover:bg-violet-900/50 transition-colors">
                <Phone className="w-5 h-5 text-violet-600 dark:text-violet-400" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 dark:text-gray-500 mb-1">ফোন</p>
                <p className="font-semibold text-gray-900 dark:text-white">+8801315743441</p>
              </div>
            </a>

            <a
              href="mailto:medimystery@gmail.com"
              className="group flex flex-col items-center gap-3 rounded-2xl border border-black/5 bg-white/80 p-6 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all dark:border-white/10 dark:bg-white/5 text-center"
            >
              <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center group-hover:bg-emerald-200 dark:group-hover:bg-emerald-900/50 transition-colors">
                <Mail className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 dark:text-gray-500 mb-1">ইমেইল</p>
                <p className="font-semibold text-gray-900 dark:text-white break-all">medimystery@gmail.com</p>
              </div>
            </a>

            <a
              href="https://wa.me/8801315743441"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col items-center gap-3 rounded-2xl border border-black/5 bg-white/80 p-6 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all dark:border-white/10 dark:bg-white/5 text-center"
            >
              <div className="w-12 h-12 rounded-xl bg-teal-100 dark:bg-teal-900/30 flex items-center justify-center group-hover:bg-teal-200 dark:group-hover:bg-teal-900/50 transition-colors">
                <MessageCircle className="w-5 h-5 text-teal-600 dark:text-teal-400" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 dark:text-gray-500 mb-1">WhatsApp</p>
                <p className="font-semibold text-gray-900 dark:text-white">+8801315743441</p>
              </div>
            </a>
          </div>

          {/* Address */}
          <div className="flex items-center gap-3 rounded-2xl border border-black/5 bg-white/80 dark:border-white/10 dark:bg-white/5 px-6 py-4 shadow-sm">
            <MapPin className="w-5 h-5 text-purple-600 dark:text-purple-400 shrink-0" />
            <p className="text-gray-700 dark:text-gray-300 font-medium">ঢাকা, বাংলাদেশ</p>
          </div>
        </div>
      </main>
    </div>
  );
}
