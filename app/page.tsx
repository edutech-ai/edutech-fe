"use client";

import { Header } from "@/components/blocks/header";
import { HeroSection } from "@/components/blocks/hero-section";
import { FeaturesSection } from "@/components/blocks/features-section";
import { BenefitsSection } from "@/components/blocks/benefits-section";
import { ProcessSection } from "@/components/blocks/process-section";
import { PricingSection } from "@/components/blocks/pricing-section";
import { TargetAudienceSection } from "@/components/blocks/target-audience-section";
import { Footer } from "@/components/blocks/footer";

export default function HomePage() {
  return (
    <div className="min-h-screen w-full">
      <Header />
      <HeroSection />
      <FeaturesSection />
      <BenefitsSection />
      <ProcessSection />
      <PricingSection />
      <TargetAudienceSection />
      <Footer />
    </div>
  );
}
