
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Building, House, Zap, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const categories = [
  {
    id: "tous",
    label: "Tous"
  },
  {
    id: "electricite",
    label: "Électricité",
    icon: <Zap className="w-4 h-4 mr-1.5" />
  }
];

const projects = [{
  id: 2,
  title: "Rénovation électrique complète",
  category: "electricite",
  image: "https://images.unsplash.com/photo-1581092335397-9583eb92d232?q=80&w=1000&auto=format&fit=crop",
  client: "Bureau d'architecte",
  location: "Lyon"
}, {
  id: 5,
  title: "Mise aux normes électriques",
  category: "electricite",
  image: "https://images.unsplash.com/photo-1555963966-b7ae5404b6ed?q=80&w=1000&auto=format&fit=crop",
  client: "Restaurant La Plage",
  location: "Cannes"
}];

const Portfolio = () => {
  const [activeTab, setActiveTab] = useState("tous");
  const filteredProjects = activeTab === "tous" ? projects : projects.filter(project => project.category === activeTab);

  return (
    <section className="py-20 md:py-28 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-64 right-0 w-96 h-96 bg-cme-cyan/10 rounded-full blur-3xl opacity-60"></div>
        <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-cme-gold/10 rounded-full blur-3xl opacity-60"></div>
        <div className="absolute top-1/3 left-1/3 w-64 h-64 bg-cme-navy/20 rounded-full blur-3xl opacity-40"></div>
      </div>
      
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="max-w-3xl mx-auto text-center mb-12 md:mb-16">
          <div className="inline-flex items-center px-3 py-1 text-xs font-medium neo-glass rounded-full mb-4">
            <span className="w-2 h-2 rounded-full bg-cme-gold mr-2"></span>
            Mon portfolio
          </div>
          <h2 className="headline text-white mb-4">
            Mes <span className="text-gradient-gold">réalisations</span> récentes
          </h2>
          <p className="subheadline max-w-2xl mx-auto">
            Découvrez mes projets d'installation, de dépannage et d'entretien réalisés 
            pour mes clients particuliers et professionnels.
          </p>
        </div>
        
        <Tabs defaultValue="tous" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="flex justify-center mb-8 md:mb-12 px-0 py-[12px] my-0 mx-0">
            <TabsList className="grid grid-cols-2 w-full max-w-md backdrop-blur-sm p-1.5 gap-1 border border-white/10 my-0 mx-0 py-0 bg-[cme-cyan-light] rounded-xl px-[3px] bg-[#152bdd]/[0.11]">
              {categories.map(category => (
                <TabsTrigger 
                  key={category.id} 
                  value={category.id} 
                  className="flex items-center justify-center py-2.5 px-3 text-sm font-medium rounded-lg transition-all duration-200 data-[state=active]:bg-gradient-to-br data-[state=active]:from-cme-gold data-[state=active]:to-cme-gold-dark data-[state=active]:text-cme-navy data-[state=active]:shadow-md hover:bg-white/5"
                >
                  {category.icon}
                  <span>{category.label}</span>
                </TabsTrigger>
              ))}
            </TabsList>
          </div>
          
          <div className="mt-8">
            <motion.div 
              layout 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8" 
              transition={{
                duration: 0.2,
                ease: "easeInOut"
              }}
            >
              {filteredProjects.map(project => (
                <motion.div 
                  key={project.id} 
                  className="neo-glass overflow-hidden border border-white/10" 
                  initial={{
                    opacity: 0
                  }} 
                  animate={{
                    opacity: 1
                  }} 
                  exit={{
                    opacity: 0
                  }} 
                  transition={{
                    duration: 0.2
                  }} 
                  layout
                >
                  <div className="relative h-56 sm:h-64 overflow-hidden">
                    <img src={project.image} alt={project.title} className="w-full h-full object-cover" loading="lazy" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent flex flex-col justify-end p-6">
                      <div>
                        <span className={cn(
                          "px-2.5 py-1 text-xs font-semibold rounded-full", 
                          project.category === "electricite" ? "bg-cme-gold/20 text-cme-gold-light" : "bg-white/20 text-white"
                        )}>
                          {project.category === "electricite" ? "Électricité" : project.category}
                        </span>
                        <h3 className="text-lg font-semibold text-white mt-2 mb-1">{project.title}</h3>
                        <div className="flex items-center text-sm text-white/80 space-x-4">
                          <div className="flex items-center">
                            <Building className="h-3.5 w-3.5 mr-1.5" />
                            <span>{project.client}</span>
                          </div>
                          <div className="flex items-center">
                            <House className="h-3.5 w-3.5 mr-1.5" />
                            <span>{project.location}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </Tabs>
      </div>
    </section>
  );
};

export default Portfolio;
