
import React from "react";

const AboutSection = () => {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          <div className="lg:w-1/2">
            <div className="rounded-2xl overflow-hidden glass-morphism p-2">
              <img 
                src="https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=2000&auto=format&fit=crop" 
                alt="Portrait du technicien" 
                className="rounded-xl w-full h-[450px] object-cover"
              />
            </div>
          </div>
          
          <div className="lg:w-1/2">
            <h2 className="text-3xl font-bold mb-6 text-cme-gold">Mon histoire</h2>
            <div className="space-y-4 text-white/80">
              <p>
                Passionné par la technique depuis mon plus jeune âge, j'ai suivi une formation spécialisée en électricité et climatisation, obtenant mes certifications avec distinction.
              </p>
              <p>
                Après plusieurs années d'expérience dans de grandes entreprises du secteur, j'ai décidé de créer ma propre structure pour offrir un service plus personnalisé et à l'écoute des besoins spécifiques de chaque client.
              </p>
              <p>
                Aujourd'hui, je mets mon expertise au service des particuliers et professionnels de Lyon et sa région, avec l'ambition de fournir des prestations de haute qualité tout en maintenant une relation de proximité et de confiance.
              </p>
              <p>
                Je suis titulaire des qualifications suivantes :
              </p>
              <ul className="space-y-2 pl-5">
                <li className="flex items-start">
                  <span className="text-cme-gold mr-2">•</span>
                  Certification Qualipac pour les pompes à chaleur
                </li>
                <li className="flex items-start">
                  <span className="text-cme-gold mr-2">•</span>
                  Attestation de capacité à manipuler les fluides frigorigènes
                </li>
                <li className="flex items-start">
                  <span className="text-cme-gold mr-2">•</span>
                  Habilitation électrique B2V - BR
                </li>
                <li className="flex items-start">
                  <span className="text-cme-gold mr-2">•</span>
                  Certification QualiClimafroid
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
