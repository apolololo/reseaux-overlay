
import { Zap, Award, Clock, ShieldCheck, Wrench, Bolt } from "lucide-react";

const ValuesSection = () => {
  const values = [
    {
      icon: <Zap className="h-8 w-8 text-cme-gold" />,
      title: "Qualité",
      description: "Je m'engage à fournir des prestations de haute qualité avec des matériaux sélectionnés pour leur fiabilité."
    },
    {
      icon: <Award className="h-8 w-8 text-cme-gold" />,
      title: "Professionnalisme",
      description: "Chaque projet est traité avec sérieux et rigueur, en respectant les normes en vigueur et vos exigences."
    },
    {
      icon: <ShieldCheck className="h-8 w-8 text-cme-cyan" />,
      title: "Fiabilité",
      description: "Vous pouvez compter sur mon engagement pour des installations durables et des interventions efficaces."
    },
    {
      icon: <Clock className="h-8 w-8 text-cme-cyan" />,
      title: "Ponctualité",
      description: "Je respecte scrupuleusement les délais convenus et suis disponible pour des interventions d'urgence dans les 24 heures."
    },
    {
      icon: <Wrench className="h-8 w-8 text-cme-cyan" />,
      title: "Expertise",
      description: "Formé aux dernières techniques et technologies, je me tiens constamment informé des innovations dans mon domaine."
    },
    {
      icon: <Bolt className="h-8 w-8 text-cme-gold" />,
      title: "Réactivité",
      description: "Je suis à votre écoute et réponds rapidement à vos demandes pour vous apporter satisfaction."
    }
  ];

  return (
    <section className="py-16 bg-black/30">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl font-bold mb-6">Mes valeurs</h2>
          <p className="text-white/70">
            Chaque intervention est guidée par des principes qui garantissent la qualité de mon travail et votre satisfaction
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {values.map((value, index) => (
            <div 
              key={index}
              className="glass-morphism p-6 rounded-xl border border-white/10 transition-all duration-300 hover:border-white/20 hover:translate-y-[-5px]"
            >
              <div className="w-14 h-14 rounded-xl flex items-center justify-center mb-6 bg-white/5">
                {value.icon}
              </div>
              <h3 className="text-xl font-semibold mb-3 text-white">
                {value.title}
              </h3>
              <p className="text-white/70">
                {value.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ValuesSection;
