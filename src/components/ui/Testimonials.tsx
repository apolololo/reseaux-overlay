
import { useState } from "react";
import { Snowflake, Bolt, ArrowLeft, ArrowRight, Star, ExternalLink } from "lucide-react";

const Testimonials = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextTestimonial = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % 1);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + 1) % 1);
  };

  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 opacity-10">
          <Snowflake className="w-48 h-48 text-cme-cyan" />
        </div>
        <div className="absolute bottom-0 left-0 opacity-10">
          <Bolt className="w-32 h-32 text-cme-gold" />
        </div>
      </div>
      
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <span className="inline-flex items-center px-3 py-1 text-xs font-medium bg-white/10 text-white backdrop-blur-md rounded-full">
            <span className="mr-1.5 text-cme-gold">✦</span> Témoignages clients
          </span>
          <h2 className="mt-4 text-3xl md:text-4xl font-bold text-white">
            Ils me font confiance
          </h2>
          <p className="mt-4 text-white/70">
            Découvrez ce que mes clients disent de mes services
          </p>
        </div>
        
        <div className="max-w-4xl mx-auto">
          <div className="glass-morphism p-8 rounded-2xl border border-white/10 text-center">
            <div className="flex justify-center mb-8">
              <img 
                src="https://cdn.trustpilot.net/brand-assets/4.1.0/logo-white.svg" 
                alt="Trustpilot" 
                className="h-8"
              />
            </div>
            
            <div className="mb-6 flex justify-center">
              <p className="text-white/90 text-lg">
                Pas encore d'avis sur Trustpilot. Soyez le premier à partager votre expérience !
              </p>
            </div>
            
            <div className="mt-8">
              <a 
                href="https://www.trustpilot.com/evaluate/cme.lovable.app" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center px-6 py-3 rounded-lg bg-[#00b67a] hover:bg-[#00a06a] text-white font-medium transition-all"
              >
                <span>Noter sur Trustpilot</span>
                <ExternalLink className="ml-2 h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
