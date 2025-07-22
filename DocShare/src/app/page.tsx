"use client";

import HeroSection from "@/components/home/hero-section";
import HowItWorksSection from "@/components/home/how-it-works-section";
import TestimonialsSection from "@/components/home/testimonials-section";
import CTASection from "@/components/home/cta-section";
import FeaturesSection from "@/components/home/features-section";
import StatsSection from "@/components/home/stats-section";
import CursorEffects from "@/components/ui/cursor-effects";
import useAnimations from "@/hooks/useAnimations";

export default function Home() {
  const { howItWorksRef, featuresRef, statsRef, testimonialsRef, ctaRef } = useAnimations();

  return (
    <div className="relative">
      <CursorEffects />

      <main>
        {/* Hero Section */}
        <section className="home-section">
          <HeroSection howItWorksRef={howItWorksRef as React.RefObject<HTMLElement>} />
        </section>

        {/* Divider */}
        <div className="relative h-24 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-black to-zinc-950"></div>
          <div className="absolute left-1/2 -translate-x-1/2 bottom-0 w-1/2 h-px bg-gradient-to-r from-transparent via-zinc-800 to-transparent"></div>
        </div>

        {/* How It Works Section */}
        <section className="home-section">
          <HowItWorksSection howItWorksRef={howItWorksRef as React.RefObject<HTMLElement>} />
        </section>

        {/* Divider with decorative element */}
        <div className="relative h-32 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-zinc-950 to-black"></div>
          <div className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 w-2/3 h-px bg-gradient-to-r from-transparent via-blue-500/30 to-transparent"></div>
          <div className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 w-4 h-4 bg-blue-500/30 rounded-full blur-sm"></div>
          <div className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 w-2 h-2 bg-blue-500 rounded-full"></div>
        </div>

        {/* Features section */}
        <section className="home-section">
          <FeaturesSection featuresRef={featuresRef as React.RefObject<HTMLElement>} />
        </section>

        {/* Divider */}
        <div className="relative h-24 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-black to-zinc-950"></div>
          <div className="absolute left-1/2 -translate-x-1/2 bottom-0 w-1/2 h-px bg-gradient-to-r from-transparent via-zinc-800 to-transparent"></div>
        </div>

        {/* Testimonials Section */}
        <section className="home-section">
          <TestimonialsSection testimonialsRef={testimonialsRef as React.RefObject<HTMLElement>} />
        </section>

        {/* Divider with wave pattern */}
        <div className="relative h-32 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-zinc-950 to-transparent"></div>
          <svg
            className="absolute bottom-0 left-0 w-full"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1440 320"
            preserveAspectRatio="none"
          >
            <path
              fill="rgba(59, 130, 246, 0.05)"
              fillOpacity="1"
              d="M0,288L48,272C96,256,192,224,288,197.3C384,171,480,149,576,165.3C672,181,768,235,864,250.7C960,267,1056,245,1152,224C1248,203,1344,181,1392,170.7L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
            ></path>
          </svg>
        </div>

        {/* Stats Section with Counter Animation */}
        <section className="home-section">
          <StatsSection statsRef={statsRef as React.RefObject<HTMLElement>} />
        </section>

        {/* CTA Section */}
        <section className="home-section">
          <CTASection ctaRef={ctaRef as React.RefObject<HTMLElement>} />
        </section>

        {/* Footer spacer */}
        <div className="h-24 bg-black"></div>
      </main>
    </div>
  );
}
