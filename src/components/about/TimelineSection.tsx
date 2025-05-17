
import React from "react";

const TimelineSection = () => {
  const timelineItems = [
    {
      year: "2012",
      title: "Formation technique",
      description: "Obtention de mon diplôme en électricité et systèmes thermiques."
    },
    {
      year: "2013-2016",
      title: "Premières expériences",
      description: "Technicien au sein d'une entreprise spécialisée dans l'installation de climatisations résidentielles."
    },
    {
      year: "2016-2019",
      title: "Expertise technique",
      description: "Responsable d'équipe pour des projets d'installations électriques et climatiques dans le secteur tertiaire."
    },
    {
      year: "2019-2021",
      title: "Formation continue",
      description: "Obtention de certifications supplémentaires en efficacité énergétique et nouvelles technologies de climatisation."
    },
    {
      year: "2021",
      title: "Création de mon entreprise",
      description: "Lancement de mon activité indépendante pour offrir des services personnalisés et de qualité."
    }
  ];

  return (
    <section className="py-20">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl font-bold mb-6">Mon parcours</h2>
          <p className="text-white/70">
            De la formation à l'expertise, découvrez les étapes clés de mon évolution professionnelle
          </p>
        </div>
        
        <div className="max-w-3xl mx-auto">
          <div className="relative border-l border-white/20 pl-10 space-y-12">
            {timelineItems.map((item, index) => (
              <div key={index} className="relative">
                <div className="absolute -left-[44px] mt-1.5 w-7 h-7 rounded-full flex items-center justify-center bg-gradient-to-r from-cme-blue to-cme-gold">
                  <div className="w-3 h-3 rounded-full bg-white"></div>
                </div>
                <div className="glass-morphism p-6 rounded-xl border border-white/10">
                  <span className="inline-block px-3 py-1 text-xs font-medium bg-white/10 text-white backdrop-blur-md rounded-full mb-2">
                    {item.year}
                  </span>
                  <h3 className="text-xl font-semibold mb-2 text-white">{item.title}</h3>
                  <p className="text-white/70">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TimelineSection;
