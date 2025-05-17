
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import Navigation from "@/components/ui/Navigation";
import Footer from "@/components/ui/Footer";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";

const UserProfilePage = () => {
  const { isSignedIn, firstName, lastName, email, signOut } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isSignedIn) {
      toast({
        title: "Accès refusé",
        description: "Vous devez être connecté pour accéder à cette page",
        variant: "destructive"
      });
      navigate("/login");
    }
  }, [isSignedIn, navigate, toast]);

  const handleSignOut = async () => {
    await signOut();
    toast({
      title: "Déconnexion réussie",
      description: "Vous avez été déconnecté avec succès"
    });
    navigate("/");
  };

  if (!isSignedIn) {
    return null;
  }

  return (
    <div className="min-h-screen text-white overflow-x-hidden bg-[#080810]">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-cme-navy/5 via-transparent to-transparent pointer-events-none"></div>
      <Navigation />
      
      <main className="container mx-auto px-4 py-20 md:py-32">
        <div className="max-w-4xl mx-auto">
          <div className="mb-10 flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Mon profil</h1>
              <p className="text-white/70">Gérez vos informations personnelles et préférences</p>
            </div>
            <div className="mt-4 md:mt-0">
              <button 
                onClick={handleSignOut}
                className="px-4 py-2 bg-white/10 hover:bg-white/15 rounded-lg text-white"
              >
                Se déconnecter
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Sidebar Navigation */}
            <div className="neo-glass border border-white/10 rounded-xl p-6 md:sticky md:top-24 h-fit">
              <nav className="space-y-1">
                <a href="#profile" className="block py-2 px-3 rounded-lg bg-white/10 text-cme-gold">
                  Information personnelles
                </a>
                <a href="#newsletters" className="block py-2 px-3 rounded-lg hover:bg-white/5 transition-colors">
                  Préférences de communication
                </a>
                <a href="#security" className="block py-2 px-3 rounded-lg hover:bg-white/5 transition-colors">
                  Sécurité
                </a>
              </nav>
            </div>
            
            {/* Main Content */}
            <div className="md:col-span-2 space-y-8">
              {/* Profile Information */}
              <section id="profile" className="neo-glass border border-white/10 rounded-xl p-6 md:p-8">
                <h2 className="text-xl font-semibold mb-6">Informations personnelles</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-1">Prénom</label>
                    <p className="px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white">
                      {firstName || "Non défini"}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Nom</label>
                    <p className="px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white">
                      {lastName || "Non défini"}
                    </p>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-1">Email</label>
                    <p className="px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white">
                      {email || "Non défini"}
                    </p>
                  </div>
                </div>
              </section>
              
              {/* Newsletter Preferences */}
              <section id="newsletters" className="neo-glass border border-white/10 rounded-xl p-6 md:p-8">
                <h2 className="text-xl font-semibold mb-6">Préférences de communication</h2>
                
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="flex h-6 items-center">
                      <input
                        id="newsletter"
                        type="checkbox"
                        defaultChecked
                        className="h-4 w-4 rounded border-gray-300 text-cme-gold focus:ring-cme-gold"
                      />
                    </div>
                    <div className="ml-3">
                      <label htmlFor="newsletter" className="font-medium">Newsletter générale</label>
                      <p className="text-sm text-white/60">
                        Recevez nos dernières actualités, offres et conseils par email.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="flex h-6 items-center">
                      <input
                        id="promotions"
                        type="checkbox"
                        className="h-4 w-4 rounded border-gray-300 text-cme-gold focus:ring-cme-gold"
                      />
                    </div>
                    <div className="ml-3">
                      <label htmlFor="promotions" className="font-medium">Offres promotionnelles</label>
                      <p className="text-sm text-white/60">
                        Recevez nos offres spéciales et promotions exclusives.
                      </p>
                    </div>
                  </div>
                </div>
                
                <button className="mt-6 py-2 px-4 bg-gradient-to-r from-cme-navy to-cme-gold rounded-lg text-white">
                  Enregistrer les préférences
                </button>
              </section>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default UserProfilePage;
