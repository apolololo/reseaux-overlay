
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Zap, Plug2, Wrench, Settings, Shield, Construction, Home, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

const serviceItems = [
  {
    id: 1,
    title: "Installation Électrique",
    description: "J'assure l'installation professionnelle de systèmes électriques pour particuliers et professionnels.",
    icon: <Plug2 className="h-8 w-8 text-cme-gold group-hover:text-white transition-colors duration-300" />,
    color: "from-cme-gold/20 to-cme-gold/40",
    textColor: "text-cme-gold",
    linkTo: "/services#electricite"
  },
  {
    id: 2,
    title: "Dépannage Électrique",
    description: "J'interviens rapidement pour résoudre tous vos problèmes électriques en urgence.",
    icon: <Wrench className="h-8 w-8 text-cme-gold group-hover:text-white transition-colors duration-300" />,
    color: "from-cme-gold/20 to-cme-gold/40",
    textColor: "text-cme-gold",
    linkTo: "/services#electricite"
  },
  {
    id: 3,
    title: "Rénovation Électrique",
    description: "Je modernise vos installations électriques pour plus de sécurité et d'efficacité.",
    icon: <Construction className="h-8 w-8 text-cme-gold group-hover:text-white transition-colors duration-300" />,
    color: "from-cme-gold/20 to-cme-gold/40",
    textColor: "text-cme-gold",
    linkTo: "/services#electricite"
  },
  {
    id: 4,
    title: "Mise aux Normes",
    description: "Je mets votre installation électrique en conformité avec les normes de sécurité en vigueur.",
    icon: <Shield className="h-8 w-8 text-cme-gold group-hover:text-white transition-colors duration-300" />,
    color: "from-cme-gold/20 to-cme-gold/40",
    textColor: "text-cme-gold",
    linkTo: "/services#electricite"
  }
];

const additionalServices = [
  {
    id: 5,
    title: "Tableaux Électriques",
    description: "Installation et mise à niveau de tableaux électriques pour une distribution optimale de l'électricité.",
    icon: <Zap className="h-8 w-8 text-cme-gold group-hover:text-white transition-colors duration-300" />,
    color: "from-cme-gold/20 to-cme-gold/40",
    textColor: "text-cme-gold",
    linkTo: "/services#electricite"
  },
  {
    id: 6,
    title: "Éclairage",
    description: "Installation et optimisation de systèmes d'éclairage intérieur et extérieur pour votre confort.",
    icon: <Settings className="h-8 w-8 text-cme-gold group-hover:text-white transition-colors duration-300" />,
    color: "from-cme-gold/20 to-cme-gold/40",
    textColor: "text-cme-gold",
    linkTo: "/services#electricite"
  }
];

const featuredBenefits = [
  {
    icon: <Clock className="h-6 w-6 text-cme-cyan" />,
    title: "Intervention 7j/7",
    description: "Je suis disponible 7 jours sur 7 pour vos urgences électriques."
  },
  {
    icon: <Home className="h-6 w-6 text-cme-gold" />,
    title: "Déplacement gratuit",
    description: "Devis gratuit avec déplacement à domicile pour évaluer précisément vos besoins."
  }
];

const Services = () => {
  const navigate = useNavigate();

  const handleServiceClick = (linkTo: string) => {
    navigate(linkTo);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  return (
    <section id="services" className="py-20 md:py-28 relative">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-black/50 to-transparent opacity-40"></div>
        <div className="absolute -top-32 right-32 w-64 h-64 bg-cme-navy/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-cme-gold/20 rounded-full blur-3xl"></div>
      </div>
      
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <motion.div 
          className="max-w-3xl mx-auto text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-flex items-center px-3 py-1 text-xs font-medium bg-cme-navy/30 text-white backdrop-blur-md rounded-full">
            <span className="mr-1.5 text-cme-gold">✦</span> Mes prestations
          </span>
          <h2 className="mt-4 headline text-white">
            Des services professionnels <br />
            <span className="text-gradient-gold">pour votre confort</span>
          </h2>
          <p className="mt-4 subheadline">
            Je propose une gamme complète de services d'installation, d'entretien et de dépannage 
            pour vos systèmes électriques.
          </p>
        </motion.div>
        
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {serviceItems.map((service) => (
            <motion.div
              key={service.id}
              variants={itemVariants}
              className="group glass-card p-6 rounded-2xl border border-white/10 hover:border-white/20 cursor-pointer"
              onClick={() => handleServiceClick(service.linkTo)}
            >
              <div className={cn(
                "w-14 h-14 rounded-2xl flex items-center justify-center mb-6 bg-gradient-to-br", 
                service.color
              )}>
                {service.icon}
              </div>
              <h3 className={cn("text-xl font-semibold mb-3 group-hover:text-white transition-colors", service.textColor)}>
                {service.title}
              </h3>
              <p className="text-white/70 group-hover:text-white/90 transition-colors">
                {service.description}
              </p>
            </motion.div>
          ))}
        </motion.div>

        <motion.div 
          className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <div className="lg:col-span-4 order-2 lg:order-1">
            <div className="glass-panel rounded-2xl p-6 h-full">
              <h3 className="text-xl font-semibold text-white mb-4">Prestations complémentaires</h3>
              
              <div className="space-y-6">
                {featuredBenefits.map((benefit, idx) => (
                  <div key={idx} className="flex gap-4">
                    <div className="flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center bg-white/5">
                      {benefit.icon}
                    </div>
                    <div>
                      <h4 className="font-medium text-white">{benefit.title}</h4>
                      <p className="text-white/70 text-sm">{benefit.description}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-8 space-y-3">
                <p className="text-white/80 text-sm">Des questions sur mes services ?</p>
                <a 
                  href="/contact" 
                  className="inline-flex w-full items-center justify-center px-4 py-2.5 rounded-lg bg-gradient-to-r from-cme-navy to-cme-gold text-white font-medium transition-all hover:shadow-lg"
                >
                  Me contacter
                </a>
              </div>
            </div>
          </div>
          
          <div className="lg:col-span-8 order-1 lg:order-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-full">
              {additionalServices.map((service) => (
                <motion.div
                  key={service.id}
                  variants={itemVariants}
                  className="group glass-card p-6 rounded-2xl border border-white/10 hover:border-white/20 cursor-pointer h-full"
                  onClick={() => handleServiceClick(service.linkTo)}
                >
                  <div className={cn(
                    "w-14 h-14 rounded-2xl flex items-center justify-center mb-6 bg-gradient-to-br", 
                    service.color
                  )}>
                    {service.icon}
                  </div>
                  <h3 className={cn("text-xl font-semibold mb-3 group-hover:text-white transition-colors", service.textColor)}>
                    {service.title}
                  </h3>
                  <p className="text-white/70 group-hover:text-white/90 transition-colors">
                    {service.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
        
        <motion.div 
          className="mt-12 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <a
            href="/services"
            className="inline-flex items-center px-6 py-3 rounded-xl glass-card hover:bg-white/10 text-white font-medium transition-all"
          >
            <span>Voir tous mes services</span>
            <svg className="ml-2 w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default Services;
