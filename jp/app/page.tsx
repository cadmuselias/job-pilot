import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/homepage/Hero";
import { Features } from "@/components/homepage/Features";
import { Testimonial } from "@/components/homepage/Testimonial";
import { CallToAction } from "@/components/homepage/CallToAction";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-background bg-diagonal-stripes selection:bg-accent-light selection:text-accent">
      <Navbar />
      <main className="flex-1">
        <Hero />
        <Features />
        <Testimonial />
        <CallToAction />
      </main>
      <Footer />
    </div>
  );
}