"use client";

import { Header } from "@/components/organisms/header";
import { HeroSection } from "@/components/organisms/hero-section";
import { FeaturesSection } from "@/components/organisms/features-section";
import { BenefitsSection } from "@/components/organisms/benefits-section";
import { ProcessSection } from "@/components/organisms/process-section";
import { PricingSection } from "@/components/organisms/pricing-section";
import { TargetAudienceSection } from "@/components/organisms/target-audience-section";
import { Footer } from "@/components/organisms/footer";

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
