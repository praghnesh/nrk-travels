/**
 * =========================================
 * Home Page
 * Main landing page for Shannu Car Travels
 * =========================================
 */

import React from "react";
import HeroSection from "@/components/hero/HeroSection";
import DestinationsSection from "@/components/tours/DestinationsSection";
import FleetSection from "@/components/fleet/FleetSection";
import OutstationSection from "@/components/tours/OutstationSection";
import TempoSection from "@/components/tempo/TempoSection";
import OffersSection from "@/components/offers/OffersSection";
import TrustSection from "@/components/about/TrustSection";
import CTASection from "@/components/about/CTASection";
import TestimonialsSection from "@/components/testimonials/TestimonialsSection";
import SocialSection from "@/components/social/SocialSection";
import { SectionReveal } from "@/components/ui/SectionReveal";

export default function Home() {
  return (
    <main className="bg-white">
      <HeroSection />
      <SectionReveal>
        <DestinationsSection />
      </SectionReveal>
      <SectionReveal>
        <FleetSection />
      </SectionReveal>
      <SectionReveal>
        <OutstationSection />
      </SectionReveal>
      <SectionReveal>
        <TempoSection />
      </SectionReveal>
      <SectionReveal>
        <OffersSection />
      </SectionReveal>
      <SectionReveal>
        <TrustSection />
      </SectionReveal>
      <SectionReveal>
        <TestimonialsSection />
      </SectionReveal>
      <SectionReveal>
        <CTASection />
      </SectionReveal>
      <SectionReveal>
        <SocialSection />
      </SectionReveal>
      </main>
  );
}
