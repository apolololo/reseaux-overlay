import { Zap, Shield, Phone, Star, Plug2, Construction, Wrench, Home } from "lucide-react";
import { motion } from "framer-motion";

const Hero = () => {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  };

  const fadeIn = {
    hidden: { opacity: 0 },
    show: { 
      opacity: 1,
      transition: {
        duration: 0.8
      }
    }
  };

  return (
    <section className="relative min-h-screen flex items-center pt-32 pb-20 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute h-full w-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-cme-navy/30 via-black/60 to-black/90"></div>
        <div className="absolute top-1/3 left-0 w-[600px] h-[600px] opacity-5">
          <Zap className="w-full h-full text-cme-gold" />
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Text Content */}
          <motion.div 
            className="lg:col-span-7"
            initial="hidden"
            animate="show"
            variants={container}
          >
            <div className="flex flex-col space-y-8 max-w-xl">
              <motion.div variants={item} className="space-y-2">
                <div className="inline-flex items-center px-3 py-1 text-xs font-medium neo-glass rounded-full">
                  <Star className="w-3 h-3 text-cme-gold mr-1.5" />
                  Expert en électricité
                </div>
                
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.1]">
                  <span className="text-gradient-gold">CliMathElec,</span>
                  <br /> 
                  <span className="text-white">à votre service</span>
                </h1>
              </motion.div>
              
              <motion.p 
                variants={item}
                className="text-white/80 text-xl leading-relaxed"
              >
                Installation, dépannage, rénovation et mise aux normes électriques. 
                Je vous garantis un travail soigné, rapide et au meilleur prix.
              </motion.p>
              
              <motion.div 
                variants={item}
                className="flex flex-col sm:flex-row gap-4 pt-4"
              >
                <a 
                  href="#services" 
                  className="btn-primary rounded-full py-3.5 px-8 font-semibold"
                >
                  Découvrir mes services
                </a>
                <a 
                  href="/contact" 
                  className="btn-outline rounded-full py-3.5 px-8 font-semibold"
                >
                  Demander un devis
                </a>
              </motion.div>
              
              {/* Trust Indicators */}
              <motion.div 
                variants={fadeIn}
                className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-8"
              >
                {[
                  { icon: <Plug2 className="h-5 w-5 text-cme-gold" />, label: "Installation électrique" },
                  { icon: <Wrench className="h-5 w-5 text-cme-gold" />, label: "Dépannage" },
                  { icon: <Construction className="h-5 w-5 text-cme-gold" />, label: "Rénovation" },
                  { icon: <Shield className="h-5 w-5 text-cme-gold" />, label: "Mise aux normes" },
                  { icon: <Star className="h-5 w-5 text-white" />, label: "5+ ans d'expertise" }
                ].map((item, index) => (
                  <div key={index} className="flex items-center space-x-3 neo-glass p-3 rounded-lg">
                    <div className="p-2 rounded-full bg-white/5">
                      {item.icon}
                    </div>
                    <p className="text-sm font-medium text-white">{item.label}</p>
                  </div>
                ))}
              </motion.div>
            </div>
          </motion.div>
          
          {/* Visual Element/Logo */}
          <motion.div 
            className="lg:col-span-5 flex justify-center lg:justify-end"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, delay: 0.5 }}
          >
            <div className="relative w-full max-w-md">
              <div className="absolute inset-0 bg-gradient-to-br from-cme-navy/40 via-cme-gold/20 to-cme-cyan/30 rounded-full blur-3xl opacity-60 animate-pulse-glow"></div>
              <div className="relative neo-glass rounded-3xl p-8 border border-white/10">
                <img 
                  src="/lovable-uploads/15bf8621-1434-4e12-9075-cc5cf2be4dec.png" 
                  alt="CME Logo" 
                  className="w-full h-auto"
                />
                <div className="grid grid-cols-2 gap-4 mt-10">
                  <div className="neo-glass rounded-xl p-4 text-center">
                    <p className="text-cme-gold font-semibold text-xl">7J/7</p>
                    <p className="text-xs text-white/70">Disponibilité</p>
                  </div>
                  <div className="neo-glass rounded-xl p-4 text-center">
                    <p className="text-cme-cyan font-semibold text-xl">DEVIS</p>
                    <p className="text-xs text-white/70">Gratuit</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
