
import { useEffect } from "react";
import Navigation from "@/components/ui/Navigation";
import Footer from "@/components/ui/Footer";
import CallToAction from "@/components/ui/CallToAction";
import HeroSection from "@/components/about/HeroSection";
import AboutSection from "@/components/about/AboutSection";
import ValuesSection from "@/components/about/ValuesSection";
import TimelineSection from "@/components/about/TimelineSection";

const AProposPage = () => {
  useEffect(() => {
    document.body.classList.add("bg-[#0A0A0C]");
    window.scrollTo(0, 0);
    return () => {
      document.body.classList.remove("bg-[#0A0A0C]");
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#0A0A0C] text-white overflow-x-hidden">
      <Navigation />
      
      <main className="pt-20">
        <HeroSection />
        <AboutSection />
        <ValuesSection />
        <TimelineSection />
        <CallToAction />
      </main>
      
      <Footer />
    </div>
  );
};

export default AProposPage;
