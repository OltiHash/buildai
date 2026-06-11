import { LandingHero } from "@/components/landing/hero";
import { LandingFeatures } from "@/components/landing/features";
import { LandingDemo } from "@/components/landing/demo";
import { LandingPricing } from "@/components/landing/pricing";
import { LandingFAQ } from "@/components/landing/faq";
import { LandingFooter } from "@/components/landing/footer";
import { LandingNav } from "@/components/landing/nav";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#050505] overflow-x-hidden">
      <LandingNav />
      <LandingHero />
      <LandingFeatures />
      <LandingDemo />
      <LandingPricing />
      <LandingFAQ />
      <LandingFooter />
    </div>
  );
}
