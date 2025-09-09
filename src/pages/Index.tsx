
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import SearchSection from "@/components/SearchSection";
import FeaturedSpecialtiesSection from "@/components/FeaturedSpecialtiesSection";
import HowItWorks from "@/components/HowItWorks";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";
import { DemoAccessButton } from "@/components/DemoAccessButton";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroSection />
        <SearchSection />
        <FeaturedSpecialtiesSection />
        <HowItWorks />
        <CTASection />
      </main>
      <Footer />
      <DemoAccessButton />
    </div>
  );
};

export default Index;
