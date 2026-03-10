import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import ServiceGrid from "@/pages/Service";
import KnowYourRights from "@/components/KnowYourRights";
import LatestUpdates from "@/components/LatestUpdates";
import Footer from "@/components/Footer";
import ServiceCategories from "./ServiceCategories";
import ServiceForm from "@/components/admin/ServiceForm";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <ServiceGrid />
      <KnowYourRights />
      <ServiceCategories />
      <LatestUpdates />

      <Footer />
    </div>
  );
};

export default Index;
