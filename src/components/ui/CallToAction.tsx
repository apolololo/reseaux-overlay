
import { Phone, CalendarClock, ArrowRight, Shield, Clock, CheckCircle, Zap } from "lucide-react";
import { motion } from "framer-motion";

const CallToAction = () => {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="container mx-auto px-4 md:px-6">
        {/* Background elements */}
        <div className="absolute inset-0 bg-gradient-to-b from-cme-navy/10 via-black/40 to-black/60 opacity-30 rounded-3xl"></div>
        
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-cme-gold/20 to-transparent rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 opacity-30"></div>
        
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-cme-cyan/20 to-transparent rounded-full blur-3xl translate-y-1/2 -translate-x-1/3 opacity-30"></div>
        
        <div className="relative z-10 neo-glass rounded-3xl p-10 md:p-16 overflow-hidden border border-white/10">
          <motion.div 
            className="max-w-6xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true, margin: "-100px" }}
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className="inline-flex items-center px-3 py-1 rounded-full neo-glass text-xs font-medium mb-4">
                  <span className="w-2 h-2 rounded-full bg-cme-gold mr-2"></span>
                  <span>Contactez-moi</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                  Besoin d'un expert en électricité&nbsp;?
                </h2>
                <p className="text-white/80 mb-8 text-lg">
                  Je suis à votre disposition pour répondre à tous vos besoins. Contactez-moi dès maintenant pour un devis gratuit ou une intervention rapide.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 mb-8 md:mb-0">
                  <a 
                    href="/contact" 
                    className="btn-primary group flex items-center justify-center rounded-xl py-3.5 px-6 font-medium"
                  >
                    <span>Demander un devis</span>
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </a>
                  <a 
                    href="tel:0123456789" 
                    className="btn-outline rounded-xl py-3.5 px-6 flex items-center justify-center font-medium"
                  >
                    <Phone className="h-4 w-4 mr-2 flex-shrink-0" />
                    <span className="whitespace-nowrap">01 23 45 67 89</span>
                  </a>
                </div>
              </div>
              
              <div className="space-y-6">
                <div className="neo-glass rounded-xl p-6 border border-white/10">
                  <div className="flex items-start space-x-4 mb-4">
                    <div className="p-2.5 rounded-full bg-cme-navy/20">
                      <Shield className="h-5 w-5 text-cme-gold" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white text-lg">Qualité professionnelle</h3>
                      <p className="text-sm text-white/70">Toutes mes prestations sont effectuées dans les règles de l'art et selon les normes en vigueur</p>
                    </div>
                  </div>
                </div>
                
                <div className="neo-glass rounded-xl p-6 border border-white/10">
                  <div className="flex items-start space-x-4 mb-4">
                    <div className="p-2.5 rounded-full bg-cme-navy/20">
                      <Clock className="h-5 w-5 text-cme-cyan" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white text-lg">Disponibilité 7j/7</h3>
                      <p className="text-sm text-white/70">Service d'urgence disponible tous les jours de la semaine</p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-3 text-white/80 text-sm py-2 px-4">
                  {["Intervention d'urgence sous 24h", "Devis gratuit sans engagement", "Déplacement offert"].map((item, index) => (
                    <div key={index} className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-cme-gold mr-2" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;
