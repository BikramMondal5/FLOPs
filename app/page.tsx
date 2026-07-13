import HeroSection from "@/components/hero-section";
import FeatureCards from "@/components/FeatureCards";
import TestimonialCarousel from "@/components/TestimonialCarousel";
import FaqSection from "@/components/FaqSection";

export default function Home() {
  return (
    <>
      <HeroSection />
      <FeatureCards />
      <TestimonialCarousel />
      <FaqSection />
    </>
  );
}
