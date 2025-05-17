import { useEffect, useState } from "react";
import Navigation from "@/components/ui/Navigation";
import Footer from "@/components/ui/Footer";
import CallToAction from "@/components/ui/CallToAction";
import { Zap, Wrench, Star } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";

const RealisationsPage = () => {
  useEffect(() => {
    document.body.classList.add("bg-[#0A0A0C]");
    window.scrollTo(0, 0);
    return () => {
      document.body.classList.remove("bg-[#0A0A0C]");
    };
  }, []);

  const [selectedCategory, setSelectedCategory] = useState("all");

  const projects = [{
    id: 2,
    title: "Rénovation électrique complète",
    description: "Rénovation complète du système électrique d'un appartement ancien de 90m² avec mise aux normes NF C 15-100.",
    category: "electricite",
    image: "https://images.unsplash.com/photo-1544724569-5f171fafebb4?q=80&w=1200&auto=format&fit=crop",
    icon: <Zap className="h-6 w-6" />,
    client: "Particulier - Villeurbanne",
    date: "Avril 2023"
  }, {
    id: 4,
    title: "Dépannage urgence commerciale",
    description: "Intervention d'urgence suite à une panne électrique dans un restaurant, avec remplacement du tableau électrique défectueux.",
    category: "depannage",
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1200&auto=format&fit=crop",
    icon: <Wrench className="h-6 w-6" />,
    client: "Restaurant - Lyon 2ème",
    date: "Mars 2023"
  }, {
    id: 6,
    title: "Installation système domotique",
    description: "Installation d'un système domotique complet pour la gestion de l'éclairage et des volets.",
    category: "electricite",
    image: "https://images.unsplash.com/photo-1473091534298-04dcbce3278c?q=80&w=1200&auto=format&fit=crop",
    icon: <Zap className="h-6 w-6" />,
    client: "Particulier - Tassin-la-Demi-Lune",
    date: "Février 2023"
  }];

  const categories = [{
    id: "all",
    label: "Tous",
    shortLabel: "Tous",
    icon: <Star className="h-4 w-4" />
  }, {
    id: "electricite",
    label: "Électricité",
    shortLabel: "Élec",
    icon: <Zap className="h-4 w-4" />
  }, {
    id: "depannage",
    label: "Dépannage",
    shortLabel: "Dép",
    icon: <Wrench className="h-4 w-4" />
  }];

  const filteredProjects = selectedCategory === 'all' ? projects : projects.filter(project => project.category === selectedCategory);

  return (
    <div className="min-h-screen bg-[#0A0A0C] text-white overflow-x-hidden">
      <Navigation />
      
      <main className="pt-20">
        <section className="relative py-12 md:py-20 overflow-hidden">
          <div className="absolute inset-0 z-0">
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-black/50 to-transparent opacity-40"></div>
            <div className="absolute -top-32 -left-32 w-64 h-64 bg-cme-blue/20 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-32 -right-32 w-64 h-64 bg-cme-gold/20 rounded-full blur-3xl"></div>
          </div>
          
          <div className="container mx-auto px-4 md:px-6 relative z-10">
            <div className="max-w-3xl mx-auto text-center">
              <span className="inline-flex items-center px-3 py-1 text-xs font-medium bg-white/10 text-white backdrop-blur-md rounded-full mb-4">
                <span className="mr-1.5 text-cme-gold">✦</span> Portfolio
              </span>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 md:mb-6">
                Mes <span className="text-gradient-primary">réalisations</span>
              </h1>
              <p className="text-white/70 text-base md:text-lg mb-6 md:mb-8">
                Découvrez quelques-uns des projets que j'ai réalisés pour mes clients particuliers et professionnels.
              </p>
              
              <div className="flex justify-center">
                <Tabs defaultValue="all" value={selectedCategory} onValueChange={setSelectedCategory} className="w-full">
                  <TabsList className="grid grid-cols-3 w-full max-w-md backdrop-blur-sm border border-white/10 p-1.5 gap-1 rounded-xl py-0 px-[3px] mx-0 my-0 bg-[cme-cyan-dark] bg-[#152bdd]/[0.11]">
                    {categories.map(category => (
                      <TabsTrigger 
                        key={category.id} 
                        value={category.id} 
                        className="py-2 px-2 text-xs md:text-sm rounded-lg flex items-center justify-center gap-1 
                                  transition-all duration-200 data-[state=active]:bg-gradient-to-br 
                                  data-[state=active]:from-cme-gold data-[state=active]:to-cme-gold-dark 
                                  data-[state=active]:text-cme-navy data-[state=active]:shadow-md hover:bg-white/5"
                      >
                        <span className="flex items-center gap-1">
                          {category.icon}
                          <span className="hidden md:block">{category.label}</span>
                          <span className="block md:hidden">{category.shortLabel}</span>
                        </span>
                      </TabsTrigger>
                    ))}
                  </TabsList>
                </Tabs>
              </div>
            </div>
          </div>
        </section>
        
        <section className="py-10 md:py-16">
          <div className="container mx-auto px-4 md:px-6">
            <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {filteredProjects.map(project => <motion.div key={project.id} className="glass-morphism rounded-xl overflow-hidden border border-white/10 transition-all duration-200 hover:border-white/20 hover:translate-y-[-5px] group" initial={{
              opacity: 0
            }} animate={{
              opacity: 1
            }} transition={{
              duration: 0.2
            }} layout>
                  <div className="relative h-48 sm:h-60 overflow-hidden">
                    <img src={project.image} alt={project.title} className="w-full h-full object-cover" loading="lazy" />
                    <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-sm rounded-full p-2">
                      <div className="text-cme-gold">
                        {project.icon}
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4 md:p-6">
                    <h3 className="text-lg md:text-xl font-semibold mb-2 text-white group-hover:text-cme-gold transition-colors">
                      {project.title}
                    </h3>
                    <p className="text-white/70 mb-4 text-xs md:text-sm line-clamp-3">
                      {project.description}
                    </p>
                    
                    <div className="flex justify-between items-center text-xs md:text-sm text-white/60">
                      <span>{project.client}</span>
                      <span>{project.date}</span>
                    </div>
                  </div>
                </motion.div>)}
            </motion.div>
            
            {filteredProjects.length === 0 && <div className="text-center py-12 md:py-16">
                <p className="text-white/70 text-lg">
                  Aucun projet ne correspond à cette catégorie pour le moment.
                </p>
              </div>}
          </div>
        </section>
        
        <CallToAction />
      </main>
      
      <Footer />
    </div>
  );
};

export default RealisationsPage;
