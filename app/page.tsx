import HeroSection from "@/components/hero-section";
import FeatureCards from "@/components/FeatureCards";
import AgentEconomySection from "@/components/AgentEconomySection";
import TestimonialCarousel from "@/components/TestimonialCarousel";
import FaqSection from "@/components/FaqSection";
import CtaSection from "@/components/CtaSection";

export default function Home() {
  return (
    <>
      <HeroSection />
      <FeatureCards />
      <AgentEconomySection />
      <TestimonialCarousel />
      <FaqSection />
      <CtaSection />
    </>
  );
}
