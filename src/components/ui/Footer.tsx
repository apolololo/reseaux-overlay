
import { useState } from "react";
import { Link } from "react-router-dom";
import { MapPin, Phone, Mail, Clock, Instagram, Facebook, Linkedin, ChevronRight, ArrowRight } from "lucide-react";
import { subscribeToNewsletter } from "@/services/newsletterService";
import { toast } from "@/components/ui/use-toast";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !email.includes('@')) {
      toast({
        title: "Erreur",
        description: "Veuillez saisir une adresse email valide",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const response = await subscribeToNewsletter(email);
      
      if (response.success) {
        toast({
          title: "Inscription réussie!",
          description: "Merci de vous être inscrit à notre newsletter"
        });
        setEmail("");
      } else {
        toast({
          title: "Erreur",
          description: response.message,
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'inscription",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <footer className="relative overflow-hidden bg-gradient-to-b from-black/95 via-cme-navy/20 to-black/95 border-t border-white/10 pt-20 pb-8">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-20 -right-20 w-80 h-80 bg-cme-gold/5 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-cme-cyan/5 rounded-full blur-3xl"></div>
      </div>
      
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        {/* Top Section with Newsletter */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 pb-16 border-b border-white/10">
          <div>
            <Link to="/" className="inline-block mb-6">
              <img 
                src="/lovable-uploads/15bf8621-1434-4e12-9075-cc5cf2be4dec.png" 
                alt="CME Logo" 
                className="h-12 w-auto" 
              />
            </Link>
            <h3 className="text-xl font-bold text-white mb-4">Expert en électricité à votre service</h3>
            <p className="text-white/70 mb-6 max-w-lg">
              Installation, dépannage et entretien de systèmes électriques. 
              Je vous garantis un travail soigné, rapide et au meilleur prix pour tous vos projets.
            </p>
            <div className="flex space-x-3">
              <a href="#" className="btn-icon text-white/80 hover:text-white">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="btn-icon text-white/80 hover:text-white">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="btn-icon text-white/80 hover:text-white">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          <div className="flex flex-col justify-center">
            <div className="neo-glass rounded-xl p-6 border border-white/10">
              <h3 className="text-xl font-bold text-white mb-2">Restez informé</h3>
              <p className="text-white/70 mb-4">
                Inscrivez-vous à notre newsletter pour recevoir nos dernières actualités et promotions.
              </p>
              
              <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-3">
                <input 
                  type="email" 
                  placeholder="Votre email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 px-4 py-3 rounded-lg bg-white/5 border border-white/10 focus:border-cme-gold/50 focus:outline-none text-white"
                />
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="btn-primary rounded-lg py-3 px-6 flex items-center justify-center"
                >
                  {isSubmitting ? 'Envoi...' : 'S\'inscrire'}
                  {!isSubmitting && <ArrowRight className="ml-2 h-4 w-4" />}
                </button>
              </form>
              <p className="text-xs text-white/50 mt-3">
                En vous inscrivant, vous acceptez notre politique de confidentialité et de recevoir des emails de notre part.
              </p>
            </div>
          </div>
        </div>
        
        {/* Main Footer Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 py-12">
          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-6">Contact</h3>
            <ul className="space-y-4">
              <li className="flex items-start">
                <MapPin className="h-5 w-5 text-cme-gold mt-0.5 flex-shrink-0" />
                <span className="ml-3 text-white/70">123 Avenue de la République, 13001 Marseille</span>
              </li>
              <li className="flex items-center">
                <Phone className="h-5 w-5 text-cme-gold flex-shrink-0" />
                <a href="tel:0123456789" className="ml-3 text-white/70 hover:text-white transition-colors">01 23 45 67 89</a>
              </li>
              <li className="flex items-center">
                <Mail className="h-5 w-5 text-cme-gold flex-shrink-0" />
                <a href="mailto:climathelec@gmail.com" className="ml-3 text-white/70 hover:text-white transition-colors">climathelec@gmail.com</a>
              </li>
              <li className="flex items-start">
                <Clock className="h-5 w-5 text-cme-gold mt-0.5 flex-shrink-0" />
                <div className="ml-3 text-white/70">
                  <p>Lun - Ven: 8h - 18h</p>
                  <p>Sam: 9h - 12h</p>
                </div>
              </li>
            </ul>
          </div>
          
          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-6">Navigation</h3>
            <ul className="space-y-3">
              {[
                { name: "Accueil", path: "/" },
                { name: "Services", path: "/services" },
                { name: "Réalisations", path: "/realisations" },
                { name: "À propos", path: "/a-propos" },
                { name: "Contact", path: "/contact" }
              ].map((link, index) => (
                <li key={index}>
                  <Link 
                    to={link.path} 
                    className="text-white/70 hover:text-white transition-colors flex items-center group"
                  >
                    <ChevronRight className="h-4 w-4 text-cme-gold mr-2 transition-transform group-hover:translate-x-1" />
                    <span>{link.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Services */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-6">Mes services</h3>
            <ul className="space-y-3">
              {[
                { name: "Électricité", path: "/services#electricite" },
                { name: "Dépannage", path: "/services#depannage" },
                { name: "Installation", path: "/services#installation" },
                { name: "Rénovation", path: "/services#renovation" }
              ].map((link, index) => (
                <li key={index}>
                  <Link 
                    to={link.path} 
                    className="text-white/70 hover:text-white transition-colors flex items-center group"
                  >
                    <ChevronRight className="h-4 w-4 text-cme-gold mr-2 transition-transform group-hover:translate-x-1" />
                    <span>{link.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Hours & Zone */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-6">Zone d'intervention</h3>
            <div className="neo-glass rounded-lg p-4 border border-white/10">
              <ul className="space-y-2 text-white/80">
                <li className="flex items-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-cme-gold mr-2"></span>
                  Lyon et tous ses arrondissements
                </li>
                <li className="flex items-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-cme-gold mr-2"></span>
                  Villeurbanne, Bron, Vénissieux
                </li>
                <li className="flex items-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-cme-gold mr-2"></span>
                  Caluire, Ecully, Tassin-la-Demi-Lune
                </li>
                <li className="flex items-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-cme-gold mr-2"></span>
                  Interventions d'urgence 7j/7
                </li>
              </ul>
            </div>
          </div>
        </div>
        
        {/* Divider */}
        <div className="border-t border-white/10 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-white/50 text-sm mb-4 md:mb-0">
              &copy; {currentYear} CME. Tous droits réservés.
            </p>
            <div className="flex space-x-6 text-sm text-white/50">
              <Link to="/mentions-legales" className="hover:text-white transition-colors">Mentions légales</Link>
              <Link to="/politique-confidentialite" className="hover:text-white transition-colors">Politique de confidentialité</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
