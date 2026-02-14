import PageLayout from "@/components/layout/PageLayout";
import HeroCarousel from "@/components/home/HeroCarousel";
import HeroContent from "@/components/home/HeroContent";
import LeadershipSection from "@/components/home/LeadershipSection";
import FeaturesSection from "@/components/home/FeaturesSection";
import CTASection from "@/components/home/CTASection";

const Index = () => {
  return (
    <PageLayout>
      {/* Hero Section */}
      <section className="relative">
        <HeroCarousel />
        <HeroContent />
      </section>

      {/* Leadership Section */}
      <LeadershipSection />

      {/* Features Section */}
      <FeaturesSection />

      {/* CTA Section */}
      <CTASection />
    </PageLayout>
  );
};

export default Index;
