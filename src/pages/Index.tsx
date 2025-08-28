
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import SearchSection from "@/components/SearchSection";
import FreelancerGrid from "@/components/FreelancerGrid";
import HowItWorks from "@/components/HowItWorks";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroSection />
        <SearchSection />
        <FreelancerGrid />
        <HowItWorks />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
