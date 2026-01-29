import Link from "next/link";
import Image from "next/image";
import { Facebook, Youtube, Instagram, Mail, Phone, MapPin } from "lucide-react";

const quickLinks = [
  { href: "/", label: "হোম" },
  { href: "/courses", label: "কোর্সসমূহ" },
  { href: "/about", label: "আমাদের সম্পর্কে" },
  { href: "/contact", label: "যোগাযোগ" },
];

const courses = [
  { href: "/courses", label: "SSC গণিত" },
  { href: "/courses", label: "HSC পদার্থবিজ্ঞান" },
  { href: "/courses", label: "SSC রসায়ন" },
  { href: "/courses", label: "ইংরেজি ব্যাকরণ" },
];

const socials = [
  { icon: Facebook, href: "#", hoverClass: "hover:bg-blue-600" },
  { icon: Youtube, href: "#", hoverClass: "hover:bg-red-600" },
  { icon: Instagram, href: "#", hoverClass: "hover:bg-pink-600" },
];

export function Footer() {
  return (
    <footer className="bg-gray-900 dark:bg-black text-gray-300">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div>
            <div className="flex items-center mb-4">
              <Image src="/tarifacademy-logo.png" alt="Tarif Academy" width={36} height={36} className="mr-2" />
              <span className="text-lg font-bold text-white">তারিফ একাডেমি</span>
            </div>
            <p className="text-sm text-gray-400 mb-4">
              বাংলাদেশের সেরা অনলাইন শিক্ষা প্ল্যাটফর্ম
            </p>
            <div className="flex gap-3">
              {socials.map((social, i) => (
                <a key={i} href={social.href} className={`w-9 h-9 rounded-full bg-gray-800 ${social.hoverClass} flex items-center justify-center transition-colors`}>
                  <social.icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">দ্রুত লিংক</h3>
            <ul className="space-y-2 text-sm">
              {quickLinks.map((link) => (
                <li key={link.href + link.label}>
                  <Link href={link.href} className="hover:text-purple-400 transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Courses */}
          <div>
            <h3 className="text-white font-semibold mb-4">জনপ্রিয় কোর্স</h3>
            <ul className="space-y-2 text-sm">
              {courses.map((course) => (
                <li key={course.label}>
                  <Link href={course.href} className="hover:text-purple-400 transition-colors">
                    {course.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-4">যোগাযোগ</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center">
                <MapPin className="w-4 h-4 mr-2 text-purple-400 shrink-0" />
                ঢাকা, বাংলাদেশ
              </li>
              <li className="flex items-center">
                <Phone className="w-4 h-4 mr-2 text-purple-400 shrink-0" />
                +880 1XXX-XXXXXX
              </li>
              <li className="flex items-center">
                <Mail className="w-4 h-4 mr-2 text-purple-400 shrink-0" />
                info@tarifacademy.com
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-gray-800 flex flex-col sm:flex-row justify-between items-center text-sm text-gray-400 gap-4">
          <p>&copy; 2026 Tarif Academy. সর্বস্বত্ব সংরক্ষিত।</p>
          <div className="flex gap-6">
            <Link href="/privacy" className="hover:text-purple-400 transition-colors">গোপনীয়তা নীতি</Link>
            <Link href="/terms" className="hover:text-purple-400 transition-colors">শর্তাবলী</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
