import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import ServiceCategories from "@/components/ServiceCategories";
import LatestUpdates from "@/components/LatestUpdates";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <ServiceCategories />
      <LatestUpdates />
      <Footer />
    </div>
  );
};

export default Index;
