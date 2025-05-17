
import { useEffect, useState } from "react";
import { Mail, Phone, MapPin, Send, Clock, Plus, X } from "lucide-react";
import Navigation from "@/components/ui/Navigation";
import Footer from "@/components/ui/Footer";
import { cn } from "@/lib/utils";
import { toast } from "@/components/ui/use-toast";

// Liste des marques disponibles
const availableBrands = [
  "ABB",
  "Hager",
  "Legrand",
  "Schneider Electric"
];

const ContactPage = () => {
  useEffect(() => {
    document.body.classList.add("bg-[#0A0A0C]");
    window.scrollTo(0, 0);
    return () => {
      document.body.classList.remove("bg-[#0A0A0C]");
    };
  }, []);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    service: "climatisation",
    message: ""
  });

  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [customBrand, setCustomBrand] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleBrandSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    if (value && !selectedBrands.includes(value)) {
      setSelectedBrands(prev => [...prev, value]);
      e.target.value = ""; // Reset select after selection
    }
  };

  const handleAddCustomBrand = () => {
    if (customBrand.trim() && !selectedBrands.includes(customBrand.trim())) {
      setSelectedBrands(prev => [...prev, customBrand.trim()]);
      setCustomBrand("");
    }
  };

  const handleRemoveBrand = (brand: string) => {
    setSelectedBrands(prev => prev.filter(b => b !== brand));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Préparer l'objet contenant toutes les données du formulaire
    const submissionData = {
      ...formData,
      preferredBrands: selectedBrands.join(", ")
    };

    // Construire le sujet et le corps du mail
    const subject = `Demande de devis - ${formData.service}`;
    
    let body = `Bonjour,\n\n`;
    body += `Je vous contacte pour une demande de devis concernant ${formData.service}.\n\n`;
    body += `Mes informations :\n`;
    body += `- Nom : ${formData.name}\n`;
    body += `- Téléphone : ${formData.phone}\n`;
    body += `- Adresse : ${formData.address}\n`;
    
    if (selectedBrands.length > 0) {
      body += `- Marques préférées : ${selectedBrands.join(", ")}\n`;
    }
    
    body += `\nDétails de ma demande :\n${formData.message}\n\n`;
    body += `Cordialement,\n${formData.name}`;
    
    // Encoder les paramètres pour l'URL mailto
    const mailtoLink = `mailto:climathelec@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    
    // Rediriger vers le client mail
    window.location.href = mailtoLink;
    
    // Afficher un toast de confirmation
    toast({
      title: "Redirection vers votre messagerie...",
      description: "Je vous remercie pour votre demande de devis. À bientôt !"
    });
    
    // Réinitialiser le formulaire et l'état
    setTimeout(() => {
      setIsSubmitting(false);
      setFormData({
        name: "",
        phone: "",
        address: "",
        service: "climatisation",
        message: ""
      });
      setSelectedBrands([]);
    }, 1000);
  };

  const contactInfo = [
    {
      icon: <Phone className="h-5 w-5 text-cme-gold" />,
      title: "Téléphone",
      value: "06 12 34 56 78",
      link: "tel:0612345678"
    },
    {
      icon: <Mail className="h-5 w-5 text-cme-gold" />,
      title: "Email",
      value: "climathelec@gmail.com",
      link: "mailto:climathelec@gmail.com"
    },
    {
      icon: <MapPin className="h-5 w-5 text-cme-gold" />,
      title: "Adresse",
      value: "Lyon et sa périphérie",
      link: "https://maps.google.com/?q=Lyon,France"
    },
    {
      icon: <Clock className="h-5 w-5 text-cme-gold" />,
      title: "Horaires",
      value: "Lun-Ven: 8h-19h | Sam: 9h-17h",
      link: null
    }
  ];

  return (
    <div className="min-h-screen bg-[#0A0A0C] text-white overflow-x-hidden">
      <Navigation />
      
      <main className="pt-20">
        {/* Hero Section */}
        <section className="relative py-20 overflow-hidden">
          <div className="absolute inset-0 z-0">
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-black/50 to-transparent opacity-40"></div>
            <div className="absolute -top-32 -left-32 w-64 h-64 bg-cme-blue/20 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-32 -right-32 w-64 h-64 bg-cme-gold/20 rounded-full blur-3xl"></div>
          </div>
          
          <div className="container mx-auto px-4 md:px-6 relative z-10">
            <div className="max-w-3xl mx-auto text-center">
              <span className="inline-flex items-center px-3 py-1 text-xs font-medium bg-white/10 text-white backdrop-blur-md rounded-full mb-4">
                <span className="mr-1.5 text-cme-gold">✦</span> Contact & Devis
              </span>
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Demandez un <span className="text-gradient-primary">devis gratuit</span>
              </h1>
              <p className="text-white/70 text-lg mb-8">
                Besoin d'un devis pour vos travaux d'électricité ou de climatisation ? 
                Contactez-moi pour une étude personnalisée et gratuite de votre projet.
              </p>
            </div>
          </div>
        </section>
        
        {/* Contact Form Section */}
        <section className="py-12">
          <div className="container mx-auto px-4 md:px-6">
            <div className="flex flex-col lg:flex-row gap-12">
              {/* Contact Form */}
              <div className="lg:w-2/3">
                <div className="glass-morphism rounded-xl p-8 border border-white/10">
                  <h2 className="text-2xl font-bold mb-6">Formulaire de demande de devis</h2>
                  
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-white/70 mb-2">
                          Nom complet
                        </label>
                        <input type="text" id="name" name="name" required value={formData.name} onChange={handleChange} className="w-full px-4 py-2.5 rounded-md bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-cme-gold/50" placeholder="Votre nom" />
                      </div>
                      
                      <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-white/70 mb-2">
                          Téléphone
                        </label>
                        <input type="tel" id="phone" name="phone" required value={formData.phone} onChange={handleChange} className="w-full px-4 py-2.5 rounded-md bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-cme-gold/50" placeholder="06 XX XX XX XX" />
                      </div>
                      
                      <div className="md:col-span-2">
                        <label htmlFor="address" className="block text-sm font-medium text-white/70 mb-2">
                          Adresse
                        </label>
                        <input type="text" id="address" name="address" value={formData.address} onChange={handleChange} className="w-full px-4 py-2.5 rounded-md bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-cme-gold/50" placeholder="Votre adresse" />
                      </div>
                    </div>
                    
                    <div>
                      <label htmlFor="service" className="block text-sm font-medium text-white/70 mb-2">
                        Service concerné
                      </label>
                      <select id="service" name="service" value={formData.service} onChange={handleChange} className="w-full px-4 py-2.5 rounded-md border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-cme-gold/50 bg-zinc-900">
                        <option value="climatisation">Climatisation</option>
                        <option value="electricite">Électricité</option>
                        <option value="chauffage">Chauffage</option>
                        <option value="depannage">Dépannage</option>
                        <option value="entretien">Entretien</option>
                        <option value="autre">Autre</option>
                      </select>
                    </div>
                    
                    {/* Section des marques préférées */}
                    <div>
                      <label className="block text-sm font-medium text-white/70 mb-2">
                        Marques préférées (facultatif)
                      </label>
                      
                      <div className="mb-3">
                        <select 
                          onChange={handleBrandSelect}
                          className="w-full px-4 py-2.5 rounded-md border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-cme-gold/50 bg-zinc-900"
                        >
                          <option value="">Sélectionner une marque...</option>
                          {availableBrands.map(brand => (
                            <option key={brand} value={brand}>{brand}</option>
                          ))}
                        </select>
                      </div>
                      
                      <div className="flex gap-2 mb-3">
                        <input
                          type="text"
                          value={customBrand}
                          onChange={(e) => setCustomBrand(e.target.value)}
                          className="flex-1 px-4 py-2.5 rounded-md bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-cme-gold/50"
                          placeholder="Ou ajouter une autre marque..."
                        />
                        <button
                          type="button"
                          onClick={handleAddCustomBrand}
                          className="px-4 py-2.5 bg-white/10 rounded-md hover:bg-white/20 transition-colors"
                        >
                          <Plus className="h-5 w-5" />
                        </button>
                      </div>
                      
                      {selectedBrands.length > 0 && (
                        <div className="flex flex-wrap gap-2 bg-white/5 p-3 rounded-md">
                          {selectedBrands.map(brand => (
                            <div key={brand} className="flex items-center bg-white/10 border border-white/10 rounded-full px-3 py-1 text-sm">
                              <span>{brand}</span>
                              <button
                                type="button"
                                onClick={() => handleRemoveBrand(brand)}
                                className="ml-2 text-white/60 hover:text-white transition-colors"
                              >
                                <X className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    
                    <div>
                      <label htmlFor="message" className="block text-sm font-medium text-white/70 mb-2">
                        Détails de votre projet
                      </label>
                      <textarea id="message" name="message" rows={5} value={formData.message} onChange={handleChange} className="w-full px-4 py-2.5 rounded-md bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-cme-gold/50 resize-none" placeholder="Décrivez votre projet ou votre demande en quelques mots..."></textarea>
                    </div>
                    
                    <div>
                      <button type="submit" disabled={isSubmitting} className={cn("w-full px-6 py-3 bg-gradient-to-r from-cme-blue to-cme-gold text-white font-medium rounded-md transition-all duration-300", isSubmitting ? "opacity-70 cursor-not-allowed" : "hover:shadow-lg hover:shadow-cme-gold/20 transform hover:translate-y-[-2px]")}>
                        {isSubmitting ? <span className="flex items-center justify-center">
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Préparation du mail...
                          </span> : <span className="flex items-center justify-center">
                            <Send className="h-5 w-5 mr-2" />
                            Envoyer ma demande
                          </span>}
                      </button>
                      <p className="text-center text-white/50 text-sm mt-3">
                        Je vous répondrai sous 24h ouvrées
                      </p>
                    </div>
                  </form>
                </div>
              </div>
              
              {/* Contact Info */}
              <div className="lg:w-1/3 space-y-6">
                <div className="glass-morphism rounded-xl p-8 border border-white/10">
                  <h2 className="text-2xl font-bold mb-6">Coordonnées</h2>
                  
                  <div className="space-y-5">
                    {contactInfo.map((item, index) => <div key={index} className="flex items-start">
                        <div className="mr-4 mt-1.5">
                          <div className="w-10 h-10 rounded-full flex items-center justify-center bg-white/5">
                            {item.icon}
                          </div>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-white/70">{item.title}</h3>
                          {item.link ? <a href={item.link} className="text-white hover:text-cme-gold transition-colors" target={item.link.startsWith('http') ? "_blank" : undefined} rel={item.link.startsWith('http') ? "noopener noreferrer" : undefined}>
                              {item.value}
                            </a> : <p className="text-white">{item.value}</p>}
                        </div>
                      </div>)}
                  </div>
                </div>
                
                <div className="glass-morphism rounded-xl p-8 border border-white/10">
                  <h2 className="text-xl font-bold mb-4">Zone d'intervention</h2>
                  <p className="text-white/70 mb-3">
                    J'interviens principalement à Lyon et sa périphérie, dans un rayon de 50km.
                  </p>
                  <ul className="space-y-2 text-white/80">
                    <li className="flex items-center">
                      <span className="text-cme-gold mr-2">•</span>
                      Lyon et tous ses arrondissements
                    </li>
                    <li className="flex items-center">
                      <span className="text-cme-gold mr-2">•</span>
                      Villeurbanne, Bron, Vénissieux
                    </li>
                    <li className="flex items-center">
                      <span className="text-cme-gold mr-2">•</span>
                      Caluire, Ecully, Tassin-la-Demi-Lune
                    </li>
                    <li className="flex items-center">
                      <span className="text-cme-gold mr-2">•</span>
                      Saint-Priest, Vaulx-en-Velin
                    </li>
                    <li className="flex items-center">
                      <span className="text-cme-gold mr-2">•</span>
                      Autres communes sur demande
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default ContactPage;
