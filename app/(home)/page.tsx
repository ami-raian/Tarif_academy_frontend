import { Hero } from "./_components/hero";
import { Features } from "./_components/features";
import { CTA } from "./_components/cta";
import { Footer } from "./_components/footer";

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <Hero />
      <Features />
      <CTA />
      <Footer />
    </main>
  );
}
