import Image from "next/image";
import { Facebook, Youtube, Instagram, Mail, Phone, MapPin } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-gray-900 dark:bg-black text-gray-300 border-t border-gray-800">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Brand Section */}
          <div className="col-span-1 md:col-span-2 lg:col-span-1">
            <div className="flex items-center mb-4">
              <Image
                src="/tarifacademy-logo.png"
                alt="Tarif Academy"
                width={40}
                height={40}
                className="mr-3"
              />
              <span className="text-xl font-bold text-white">তারিফ একাডেমি</span>
            </div>
            <p className="text-sm text-gray-400 mb-4">
              বাংলাদেশের সেরা অনলাইন শিক্ষা প্ল্যাটফর্ম। SSC ও HSC পরীক্ষার জন্য সম্পূর্ণ প্রস্তুতি।
            </p>
            <div className="flex space-x-4">
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-gray-800 hover:bg-blue-600 flex items-center justify-center transition-colors"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-gray-800 hover:bg-red-600 flex items-center justify-center transition-colors"
              >
                <Youtube className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-gray-800 hover:bg-pink-600 flex items-center justify-center transition-colors"
              >
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">দ্রুত লিংক</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="hover:text-blue-400 transition-colors">
                  হোম
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-400 transition-colors">
                  কোর্সসমূহ
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-400 transition-colors">
                  শিক্ষকবৃন্দ
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-400 transition-colors">
                  ব্লগ
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-400 transition-colors">
                  আমাদের সম্পর্কে
                </a>
              </li>
            </ul>
          </div>

          {/* Courses */}
          <div>
            <h3 className="text-white font-semibold mb-4">জনপ্রিয় কোর্স</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="hover:text-blue-400 transition-colors">
                  SSC গণিত
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-400 transition-colors">
                  HSC পদার্থবিজ্ঞান
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-400 transition-colors">
                  SSC রসায়ন
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-400 transition-colors">
                  HSC জীববিজ্ঞান
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-400 transition-colors">
                  ইংরেজি ব্যাকরণ
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-white font-semibold mb-4">যোগাযোগ</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start">
                <MapPin className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0 text-blue-400" />
                <span>ঢাকা, বাংলাদেশ</span>
              </li>
              <li className="flex items-center">
                <Phone className="w-5 h-5 mr-2 flex-shrink-0 text-blue-400" />
                <span>+880 1XXX-XXXXXX</span>
              </li>
              <li className="flex items-center">
                <Mail className="w-5 h-5 mr-2 flex-shrink-0 text-blue-400" />
                <span>info@tarifacademy.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-400">
            <p>&copy; 2026 Tarif Academy. সর্বস্বত্ব সংরক্ষিত।</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="hover:text-blue-400 transition-colors">
                গোপনীয়তা নীতি
              </a>
              <a href="#" className="hover:text-blue-400 transition-colors">
                শর্তাবলী
              </a>
              <a href="#" className="hover:text-blue-400 transition-colors">
                সাহায্য
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
