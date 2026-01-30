import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { AppWrapper } from "@/components/app-wrapper";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Tarif Academy - SSC & HSC Online Learning Platform",
  description: "বাংলাদেশের সেরা অনলাইন শিক্ষা প্ল্যাটফর্ম। SSC ও HSC পরীক্ষার জন্য বিষয়ভিত্তিক লেসন, নোট এবং অনুশীলন।",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="bn" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white dark:bg-gray-950`}
        suppressHydrationWarning
      >
        <AppWrapper>{children}</AppWrapper>
      </body>
    </html>
  );
}
