
import { useEffect, useState } from "react";
import Navigation from "@/components/ui/Navigation";
import Hero from "@/components/ui/Hero";
import Services from "@/components/ui/Services";
import Portfolio from "@/components/ui/Portfolio";
import Testimonials from "@/components/ui/Testimonials";
import CallToAction from "@/components/ui/CallToAction";
import Footer from "@/components/ui/Footer";
import BrandCarousel from "@/components/ui/BrandCarousel";
import { useAuth } from "@/contexts/AuthContext";

const Index = () => {
  const [isLoading, setIsLoading] = useState(true);
  const { supabase } = useAuth();

  useEffect(() => {
    document.body.classList.add("bg-[#080810]");
    window.scrollTo(0, 0);
    
    // Add error handling for potential issues
    const handleError = (event: ErrorEvent) => {
      console.error("Caught error:", event.error);
    };
    
    window.addEventListener('error', handleError);
    
    // Test Supabase connection
    const testSupabase = async () => {
      try {
        const { error } = await supabase.from('profiles').select('count', { count: 'exact', head: true });
        if (error) {
          console.warn("Supabase connection test:", error.message);
        } else {
          console.log("Supabase connection successful");
        }
      } catch (err) {
        console.error("Error testing Supabase:", err);
      }
      
      // Set loading to false regardless of result
      setIsLoading(false);
    };
    
    testSupabase();
    
    return () => {
      document.body.classList.remove("bg-[#080810]");
      window.removeEventListener('error', handleError);
    };
  }, [supabase]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#080810]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-cme-gold border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-white">Chargement de la page...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-white overflow-x-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-cme-navy/5 via-transparent to-transparent pointer-events-none"></div>
      <Navigation />
      <main>
        <Hero />
        <Services />
        <Portfolio />
        <Testimonials />
        <BrandCarousel />
        <CallToAction />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
