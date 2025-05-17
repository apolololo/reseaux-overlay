
import { useEffect, useRef } from "react";
import { Zap, Plug2, Wrench, ShieldCheck, Clock, Settings } from "lucide-react";
import Navigation from "@/components/ui/Navigation";
import Footer from "@/components/ui/Footer";
import CallToAction from "@/components/ui/CallToAction";
import { cn } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const ServicePage = () => {
  useEffect(() => {
    document.body.classList.add("bg-[#0A0A0C]");
    window.scrollTo(0, 0);
    return () => {
      document.body.classList.remove("bg-[#0A0A0C]");
    };
  }, []);

  const scrollToSection = (sectionId: string) => {
    const section = document.getElementById(sectionId);
    if (section) {
      const yOffset = -120;
      const y = section.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({
        top: y,
        behavior: 'smooth'
      });
    }
  };

  const mainServices = [{
    id: "electricite",
    title: "Électricité",
    description: "Je réalise tous travaux d'électricité, de l'installation à la rénovation, en respectant les normes de sécurité en vigueur pour votre tranquillité.",
    icon: <Zap className="h-12 w-12 text-cme-gold" />,
    bulletPoints: ["Installation électrique complète", "Mise aux normes (norme NF C 15-100)", "Dépannage et recherche de pannes", "Installation de tableaux électriques", "Éclairage intérieur et extérieur"],
    color: "from-cme-gold/20 to-cme-gold/40",
    textColor: "text-cme-gold",
    image: "https://images.unsplash.com/photo-1544724569-5f171fafebb4?q=80&w=2000&auto=format&fit=crop"
  }];

  const secondaryServices = [{
    id: "depannage",
    title: "Dépannage",
    description: "J'interviens rapidement pour tout dépannage électrique. Un problème ? Je suis là pour le résoudre !",
    icon: <Wrench className="h-10 w-10 text-white" />,
    color: "from-white/5 to-white/10"
  }, {
    id: "entretien",
    title: "Entretien",
    description: "Je propose des contrats d'entretien pour garantir la durabilité et l'efficacité de vos installations électriques.",
    icon: <Settings className="h-10 w-10 text-white" />,
    color: "from-white/5 to-white/10"
  }, {
    id: "urgence",
    title: "Intervention d'urgence",
    description: "Disponible pour les interventions urgentes sous 24h. Votre confort et votre sécurité sont mes priorités.",
    icon: <Clock className="h-10 w-10 text-white" />,
    color: "from-white/5 to-white/10"
  }, {
    id: "conseil",
    title: "Conseil & Devis",
    description: "Je vous accompagne dans votre projet avec des conseils personnalisés et des devis détaillés, clairs et sans surprise.",
    icon: <ShieldCheck className="h-10 w-10 text-white" />,
    color: "from-white/5 to-white/10"
  }];

  return <div className="min-h-screen bg-[#0A0A0C] text-white overflow-x-hidden">
      <Navigation />
      
      <main className="pt-20">
        {/* Hero Section */}
        <section className="relative py-12 md:py-20 overflow-hidden">
          <div className="absolute inset-0 z-0">
            <div className="absolute bottom-0 right-0 opacity-10 -rotate-12">
              <Zap className="w-80 h-80 text-cme-gold" />
            </div>
          </div>
          
          <div className="container mx-auto px-4 md:px-6 relative z-10">
            <div className="max-w-3xl mx-auto text-center">
              <span className="inline-flex items-center px-3 py-1 text-xs font-medium bg-white/10 text-white backdrop-blur-md rounded-full mb-4">
                <span className="mr-1.5 text-cme-gold">✦</span> Mes prestations
              </span>
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Mes services professionnels <br />
                <span className="text-gradient-primary">pour votre confort</span>
              </h1>
              <p className="text-white/70 text-lg mb-8">
                Je vous propose une large gamme de services en électricité. 
                Chaque prestation est réalisée avec professionnalisme et rigueur pour garantir votre satisfaction.
              </p>
            </div>
          </div>
        </section>
        
        {/* Sticky Navigation Tabs */}
        <div className="sticky top-20 z-30 backdrop-blur-md border-y border-white/10 shadow-lg bg-[cme-cyan-dark] mx-0 my-0 px-0 py-[5px] bg-transparent">
          <div className="container mx-auto px-4 md:px-6">
            <Tabs defaultValue="electricite" className="w-full md:max-w-md mx-auto">
              <div className="overflow-x-auto pb-2 scrollbar-none flex justify-center">
                <TabsList className="flex flex-row min-w-[340px] sm:min-w-0 bg-black/20 border border-white/10 rounded-xl sm:rounded-full p-1.5 gap-1.5 shadow-inner mx-auto">
                  <TabsTrigger value="electricite" className="flex-1 py-2 sm:py-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-cme-gold/30 data-[state=active]:to-cme-gold/10 data-[state=active]:text-white transition-all duration-300 rounded-lg sm:rounded-full whitespace-nowrap" onClick={() => scrollToSection("electricite")}>
                    <span className="flex items-center justify-center text-xs sm:text-sm">
                      <Zap className="w-4 h-4 mr-1.5" />
                      <span>Électricité</span>
                    </span>
                  </TabsTrigger>
                </TabsList>
              </div>
            </Tabs>
          </div>
        </div>
        
        {/* Main Services */}
        <section className="py-12 md:py-20">
          <div className="container mx-auto px-4 md:px-6">
            {mainServices.map((service, index) => <div key={service.id} id={service.id} className={cn("mb-16 md:mb-24 flex flex-col lg:flex-row items-center gap-8 md:gap-12 max-w-6xl mx-auto", index % 2 !== 0 && 'lg:flex-row-reverse')}>
                <div className="lg:w-1/2">
                  <div className={cn("w-16 h-16 rounded-xl flex items-center justify-center mb-6 bg-gradient-to-br", service.color)}>
                    {service.icon}
                  </div>
                  <h2 className={cn("text-3xl font-bold mb-4", service.textColor)}>
                    {service.title}
                  </h2>
                  <p className="text-white/70 text-lg mb-6">
                    {service.description}
                  </p>
                  <ul className="space-y-3 mb-8">
                    {service.bulletPoints.map((point, idx) => <li key={idx} className="flex items-start">
                        <span className={cn("mr-2 mt-1 text-lg", service.textColor)}>•</span>
                        <span className="text-white/80">{point}</span>
                      </li>)}
                  </ul>
                  <a href="/contact" className="px-6 py-3 bg-gradient-to-r from-cme-blue to-cme-gold text-white font-medium rounded-md hover:shadow-lg hover:shadow-cme-gold/20 transition-all duration-300 inline-block">
                    Demander un devis
                  </a>
                </div>
                <div className="lg:w-1/2">
                  <div className="rounded-2xl overflow-hidden glass-morphism p-2">
                    <img src={service.image} alt={service.title} className="rounded-xl w-full h-[350px] object-cover" />
                  </div>
                </div>
              </div>)}
          </div>
        </section>
        
        {/* Secondary Services */}
        <section className="py-12 md:py-16 bg-black/30">
          <div className="container mx-auto px-4 md:px-6">
            <div className="max-w-3xl mx-auto text-center mb-10 md:mb-16">
              <h2 className="text-2xl md:text-3xl font-bold mb-4">
                Autres prestations
              </h2>
              <p className="text-white/70">
                En plus de mes services principaux, je propose également ces prestations complémentaires
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 max-w-6xl mx-auto">
              {secondaryServices.map(service => <div key={service.id} id={service.id} className="glass-morphism p-6 rounded-xl border border-white/10 transition-all duration-300 hover:border-white/20 hover:translate-y-[-5px]">
                  <div className={cn("w-14 h-14 rounded-xl flex items-center justify-center mb-6 bg-gradient-to-br", service.color)}>
                    {service.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-white">
                    {service.title}
                  </h3>
                  <p className="text-white/70">
                    {service.description}
                  </p>
                </div>)}
            </div>
          </div>
        </section>
        
        {/* FAQ Section */}
        <section className="py-12 md:py-20">
          <div className="container mx-auto px-4 md:px-6">
            <div className="max-w-3xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold mb-4">Questions fréquentes</h2>
                <p className="text-white/70">
                  Retrouvez les réponses aux questions les plus courantes sur mes services
                </p>
              </div>
              
              <div className="space-y-6">
                {[{
                question: "Intervenez-vous le week-end pour les urgences ?",
                answer: "Oui, je suis disponible 7j/7 pour les interventions urgentes. Je m'engage à intervenir dans les 24h suivant votre appel pour résoudre rapidement votre problème."
              }, {
                question: "Proposez-vous un service après-vente ?",
                answer: "Oui, je reste à votre disposition après l'installation ou la réparation pour tout conseil ou ajustement nécessaire."
              }, {
                question: "Quand proposerez-vous des services de climatisation ?",
                answer: "Les services de climatisation seront disponibles prochainement. Pour le moment, je me concentre uniquement sur les prestations d'électricité. N'hésitez pas à vous inscrire à la newsletter pour être informé dès qu'ils seront disponibles."
              }, {
                question: "Êtes-vous certifié pour les installations électriques ?",
                answer: "Oui, je suis certifié et habilité pour réaliser tous types de travaux électriques conformément aux normes en vigueur, notamment la norme NF C 15-100."
              }, {
                question: "Comment obtenir un devis pour mes travaux ?",
                answer: "Vous pouvez me contacter par téléphone ou via le formulaire de contact du site. Je me déplace gratuitement pour évaluer vos besoins et vous remettre un devis détaillé sous 48h."
              }].map((faq, index) => <div key={index} className="glass-morphism p-6 rounded-xl border border-white/10">
                    <h3 className="text-xl font-medium mb-3 text-white">
                      {faq.question}
                    </h3>
                    <p className="text-white/70">
                      {faq.answer}
                    </p>
                  </div>)}
              </div>
            </div>
          </div>
        </section>
        
        <CallToAction />
      </main>
      
      <Footer />
    </div>;
};

export default ServicePage;
