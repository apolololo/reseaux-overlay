
import React from "react";

const HeroSection = () => {
  return (
    <section className="relative py-20 overflow-hidden">
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-black/50 to-transparent opacity-40"></div>
        <div className="absolute -top-32 -left-32 w-64 h-64 bg-cme-blue/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-32 -right-32 w-64 h-64 bg-cme-gold/20 rounded-full blur-3xl"></div>
      </div>
      
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <span className="inline-flex items-center px-3 py-1 text-xs font-medium bg-white/10 text-white backdrop-blur-md rounded-full mb-4">
            <span className="mr-1.5 text-cme-gold">✦</span> À propos de moi
          </span>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Votre expert en <span className="text-gradient-primary">climatisation & électricité</span>
          </h1>
          <p className="text-white/70 text-lg mb-8">
            Découvrez mon parcours, mes valeurs et mon engagement à vous fournir des services de qualité exceptionnelle.
          </p>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
