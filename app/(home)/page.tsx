import { Navbar } from "./_components/navbar";
import { Hero } from "./_components/hero";
import { Features } from "./_components/features";
import { CTA } from "./_components/cta";
import { Footer } from "./_components/footer";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-white dark:bg-gray-950">
      <Navbar />
      <div className="pt-16">
        <Hero />
        <Features />
        <CTA />
        <Footer />
      </div>
    </main>
  );
}
