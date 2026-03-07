import { Navbar } from "./_components/navbar";
import { QuickLinks } from "./_components/quick-links";
import { Hero } from "./_components/hero";
import { Features } from "./_components/features";
// import { CTA } from "./_components/cta";
import { Footer } from "./_components/footer";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-white dark:bg-gray-950">
      <Navbar />
      <div className="pt-16">
        {/* Hero + Features wrapper with continuous background */}
        <div className="relative overflow-hidden bg-white dark:bg-gray-950">
          {/* Light mode background */}
          <div className="absolute inset-0 bg-linear-to-br from-violet-50 via-white to-cyan-50 dark:from-transparent dark:via-transparent dark:to-transparent" />

          {/* Dark mode background with gradient mesh */}
          <div className="absolute inset-0 hidden dark:block">
            <div className="absolute inset-0 bg-linear-to-br from-gray-950 via-gray-900 to-gray-950" />
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl" />
            <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-cyan-600/20 rounded-full blur-3xl" />
            <div className="absolute bottom-1/3 left-1/3 w-96 h-96 bg-violet-600/15 rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-1/3 w-96 h-96 bg-purple-600/15 rounded-full blur-3xl" />
          </div>

          {/* Light mode decorative elements */}
          <div className="absolute inset-0 overflow-hidden dark:hidden">
            <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-200/50 rounded-full blur-3xl" />
            <div className="absolute top-1/2 -left-40 w-80 h-80 bg-cyan-200/50 rounded-full blur-3xl" />
            <div className="absolute -bottom-40 right-1/4 w-80 h-80 bg-violet-200/40 rounded-full blur-3xl" />
          </div>

          {/* Content */}
          <div className="relative">
            <QuickLinks />
            <Hero />
            <Features />
          </div>
        </div>

        {/* <CTA /> */}
        <Footer />
      </div>
    </main>
  );
}
