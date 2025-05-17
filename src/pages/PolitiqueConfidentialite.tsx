
import { useEffect } from "react";
import Navigation from "@/components/ui/Navigation";
import Footer from "@/components/ui/Footer";

const PolitiqueConfidentialite = () => {
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
              Politique de Confidentialité
            </h1>
            
            <div className="glass-morphism p-8 rounded-xl border border-white/10 space-y-8">
              <section>
                <p className="text-white/70 mb-6">
                  Dernière mise à jour : 1er juin 2023
                </p>
                <p className="text-white/70 mb-4">
                  La présente politique de confidentialité décrit la façon dont CME collecte, utilise et partage vos informations personnelles lorsque vous utilisez notre site www.cme-clim.fr.
                </p>
                <p className="text-white/70">
                  En utilisant notre site, vous acceptez les conditions décrites dans cette politique de confidentialité.
                </p>
              </section>
              
              <section>
                <h2 className="text-xl font-semibold mb-4 text-cme-gold">
                  1. Informations collectées
                </h2>
                <p className="text-white/70 mb-2">
                  Lorsque vous visitez notre site, nous pouvons collecter automatiquement certaines informations sur votre appareil, notamment des informations sur votre navigateur web, votre adresse IP, votre fuseau horaire et certains des cookies qui sont installés sur votre appareil.
                </p>
                <p className="text-white/70 mb-2">
                  De plus, lorsque vous naviguez sur le site, nous collectons des informations sur les pages web ou produits individuels que vous consultez, les sites web ou termes de recherche qui vous ont redirigé vers notre site, et des informations sur la façon dont vous interagissez avec le site.
                </p>
                <p className="text-white/70">
                  Nous collectons également les informations personnelles que vous nous fournissez volontairement, telles que votre nom, adresse, numéro de téléphone et adresse e-mail lorsque vous remplissez un formulaire de contact ou demandez un devis.
                </p>
              </section>
              
              <section>
                <h2 className="text-xl font-semibold mb-4 text-cme-gold">
                  2. Utilisation des informations
                </h2>
                <p className="text-white/70 mb-2">
                  Nous utilisons les informations que nous collectons pour :
                </p>
                <ul className="list-disc list-inside space-y-1 text-white/70 ml-4 mb-2">
                  <li>Répondre à vos demandes et vous fournir les services que vous avez sollicités</li>
                  <li>Vous contacter concernant votre demande de devis ou d'intervention</li>
                  <li>Améliorer notre site web et l'expérience utilisateur</li>
                  <li>Vous envoyer des emails marketing si vous avez accepté d'en recevoir</li>
                  <li>Analyser l'utilisation de notre site et personnaliser nos services</li>
                </ul>
                <p className="text-white/70">
                  Nous ne vendons, n'échangeons ni ne transférons vos informations personnelles identifiables à des tiers, sauf si nous vous en informons au préalable et obtenons votre consentement.
                </p>
              </section>
              
              <section>
                <h2 className="text-xl font-semibold mb-4 text-cme-gold">
                  3. Cookies et technologies similaires
                </h2>
                <p className="text-white/70 mb-2">
                  Notre site utilise des cookies pour améliorer votre expérience de navigation et analyser l'utilisation du site.
                </p>
                <p className="text-white/70 mb-2">
                  Un cookie est un petit fichier placé sur votre appareil. Vous pouvez configurer votre navigateur pour refuser tous les cookies ou pour être averti lorsqu'un cookie est envoyé. Toutefois, si vous n'acceptez pas les cookies, il se peut que vous ne puissiez pas utiliser certaines parties de notre site.
                </p>
                <p className="text-white/70">
                  Nous utilisons principalement des cookies pour comprendre comment vous interagissez avec notre site, pour vous permettre de rester connecté, pour se souvenir de vos préférences et pour mesurer l'efficacité de nos campagnes marketing.
                </p>
              </section>
              
              <section>
                <h2 className="text-xl font-semibold mb-4 text-cme-gold">
                  4. Conservation des données
                </h2>
                <p className="text-white/70">
                  Nous conservons vos informations personnelles aussi longtemps que nécessaire pour les finalités décrites dans cette politique de confidentialité, à moins qu'une période de conservation plus longue ne soit requise ou permise par la loi. Pour les demandes de devis ou d'intervention, nous conservons généralement les données pendant 3 ans après la dernière interaction.
                </p>
              </section>
              
              <section>
                <h2 className="text-xl font-semibold mb-4 text-cme-gold">
                  5. Vos droits
                </h2>
                <p className="text-white/70 mb-2">
                  Conformément à la réglementation applicable, notamment le Règlement Général sur la Protection des Données (RGPD), vous disposez des droits suivants concernant vos données personnelles :
                </p>
                <ul className="list-disc list-inside space-y-1 text-white/70 ml-4">
                  <li>Droit d'accès à vos données</li>
                  <li>Droit de rectification des données inexactes</li>
                  <li>Droit d'effacement de vos données</li>
                  <li>Droit à la limitation du traitement</li>
                  <li>Droit d'opposition au traitement</li>
                  <li>Droit à la portabilité de vos données</li>
                </ul>
                <p className="text-white/70 mt-2">
                  Pour exercer ces droits, vous pouvez nous contacter par email à l'adresse contact@cme-clim.fr ou par courrier à l'adresse indiquée dans les mentions légales.
                </p>
              </section>
              
              <section>
                <h2 className="text-xl font-semibold mb-4 text-cme-gold">
                  6. Sécurité des données
                </h2>
                <p className="text-white/70">
                  Nous prenons des mesures raisonnables pour protéger vos informations personnelles contre toute perte, utilisation abusive, accès non autorisé, divulgation, altération et destruction. Cependant, aucune méthode de transmission sur Internet ou de stockage électronique n'est sécurisée à 100%.
                </p>
              </section>
              
              <section>
                <h2 className="text-xl font-semibold mb-4 text-cme-gold">
                  7. Modifications de cette politique
                </h2>
                <p className="text-white/70">
                  Nous pouvons mettre à jour cette politique de confidentialité de temps à autre. Nous vous informerons de tout changement en publiant la nouvelle politique de confidentialité sur cette page et en mettant à jour la date de "Dernière mise à jour" en haut de cette politique de confidentialité.
                </p>
              </section>
              
              <section>
                <h2 className="text-xl font-semibold mb-4 text-cme-gold">
                  8. Nous contacter
                </h2>
                <p className="text-white/70">
                  Pour toute question concernant cette politique de confidentialité, veuillez nous contacter par email à contact@cme-clim.fr ou par téléphone au 06 12 34 56 78.
                </p>
              </section>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default PolitiqueConfidentialite;
