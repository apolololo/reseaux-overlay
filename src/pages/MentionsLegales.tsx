
import { useEffect } from "react";
import Navigation from "@/components/ui/Navigation";
import Footer from "@/components/ui/Footer";

const MentionsLegales = () => {
  useEffect(() => {
    document.body.classList.add("bg-[#0A0A0C]");
    window.scrollTo(0, 0);
    return () => {
      document.body.classList.remove("bg-[#0A0A0C]");
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#0A0A0C] text-white overflow-x-hidden">
      <Navigation />
      
      <main className="pt-32 pb-20">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl md:text-4xl font-bold mb-8">
              Mentions Légales
            </h1>
            
            <div className="glass-morphism p-8 rounded-xl border border-white/10 space-y-8">
              <section>
                <h2 className="text-xl font-semibold mb-4 text-cme-gold">
                  1. Informations légales
                </h2>
                <p className="text-white/70 mb-2">
                  Le site www.cme-clim.fr est édité par :
                </p>
                <div className="space-y-2 text-white/80">
                  <p>CME - Climatisation & Électricité</p>
                  <p>Entreprise individuelle</p>
                  <p>SIRET : 123 456 789 00012</p>
                  <p>Adresse : 123 Avenue de la République, 13001 Marseille</p>
                  <p>Téléphone : 06 12 34 56 78</p>
                  <p>Email : contact@cme-clim.fr</p>
                </div>
              </section>
              
              <section>
                <h2 className="text-xl font-semibold mb-4 text-cme-gold">
                  2. Hébergement
                </h2>
                <p className="text-white/70 mb-2">
                  Le site www.cme-clim.fr est hébergé par :
                </p>
                <div className="space-y-2 text-white/80">
                  <p>OVH SAS</p>
                  <p>Adresse : 2 rue Kellermann - 59100 Roubaix - France</p>
                  <p>Téléphone : 09 72 10 10 10</p>
                </div>
              </section>
              
              <section>
                <h2 className="text-xl font-semibold mb-4 text-cme-gold">
                  3. Propriété intellectuelle
                </h2>
                <p className="text-white/70 mb-2">
                  L'ensemble du contenu du site www.cme-clim.fr (illustrations, textes, logos, icônes, images, vidéos) est la propriété de CME et est protégé par les lois françaises et internationales relatives à la propriété intellectuelle.
                </p>
                <p className="text-white/70">
                  Toute reproduction totale ou partielle de ce contenu est strictement interdite sans autorisation préalable.
                </p>
              </section>
              
              <section>
                <h2 className="text-xl font-semibold mb-4 text-cme-gold">
                  4. Conditions d'utilisation
                </h2>
                <p className="text-white/70 mb-2">
                  L'utilisation du site www.cme-clim.fr implique l'acceptation pleine et entière des conditions générales d'utilisation décrites ci-après. Ces conditions d'utilisation sont susceptibles d'être modifiées à tout moment, les utilisateurs sont donc invités à les consulter régulièrement.
                </p>
                <p className="text-white/70">
                  Le site www.cme-clim.fr est normalement accessible à tout moment aux utilisateurs. Une interruption pour raison de maintenance technique peut être toutefois décidée, CME s'efforcera alors de communiquer préalablement aux utilisateurs les dates et heures de l'intervention.
                </p>
              </section>
              
              <section>
                <h2 className="text-xl font-semibold mb-4 text-cme-gold">
                  5. Limitation de responsabilité
                </h2>
                <p className="text-white/70 mb-2">
                  CME ne pourra être tenue responsable des dommages directs et indirects causés au matériel de l'utilisateur, lors de l'accès au site www.cme-clim.fr, et résultant soit de l'utilisation d'un matériel ne répondant pas aux spécifications indiquées, soit de l'apparition d'un bug ou d'une incompatibilité.
                </p>
                <p className="text-white/70">
                  CME ne pourra également être tenue responsable des dommages indirects consécutifs à l'utilisation du site www.cme-clim.fr.
                </p>
              </section>
              
              <section>
                <h2 className="text-xl font-semibold mb-4 text-cme-gold">
                  6. Loi applicable et juridiction
                </h2>
                <p className="text-white/70 mb-2">
                  Les présentes conditions sont régies par les lois françaises. En cas de litige, les tribunaux français seront seuls compétents.
                </p>
                <p className="text-white/70">
                  Pour toute question relative à l'application des présentes conditions, vous pouvez contacter CME à l'adresse indiquée précédemment.
                </p>
              </section>
              
              <p className="text-white/60 text-sm pt-4 border-t border-white/10">
                Dernière mise à jour : 1er juin 2023
              </p>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default MentionsLegales;
