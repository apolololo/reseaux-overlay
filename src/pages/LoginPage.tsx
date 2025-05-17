
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import Navigation from "@/components/ui/Navigation";
import Footer from "@/components/ui/Footer";
import { FcGoogle } from "react-icons/fc";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { signIn } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setIsLoading(true);
      
      const { error } = await signIn(email, password);
      
      if (error) {
        toast({
          title: "Erreur de connexion",
          description: error.message || "Identifiants invalides. Veuillez réessayer.",
          variant: "destructive"
        });
        return;
      }
      
      toast({
        title: "Connexion réussie",
        description: "Vous êtes maintenant connecté"
      });
      navigate("/");
      
    } catch (err: any) {
      toast({
        title: "Erreur de connexion",
        description: err.message || "Une erreur est survenue lors de la connexion.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen text-white overflow-x-hidden bg-[#080810]">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-cme-navy/5 via-transparent to-transparent pointer-events-none"></div>
      <Navigation />
      
      <main className="container mx-auto px-4 py-20 md:py-32">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">Connexion</h1>
            <p className="text-white/70">Accédez à votre espace client CME</p>
          </div>
          
          <div className="neo-glass border border-white/10 rounded-xl p-6 md:p-8">
            <form onSubmit={handleEmailSignIn} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-1">Email</label>
                <input
                  id="email"
                  type="email"
                  placeholder="votre@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={cn(
                    "w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg",
                    "focus:outline-none focus:ring-2 focus:ring-cme-gold/50 text-white"
                  )}
                  required
                />
              </div>
              
              <div>
                <div className="flex justify-between mb-1">
                  <label htmlFor="password" className="block text-sm font-medium">Mot de passe</label>
                  <Link to="/forgot-password" className="text-sm text-cme-gold hover:underline">
                    Mot de passe oublié?
                  </Link>
                </div>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={cn(
                    "w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg",
                    "focus:outline-none focus:ring-2 focus:ring-cme-gold/50 text-white"
                  )}
                  required
                />
              </div>
              
              <button
                type="submit"
                disabled={isLoading}
                className={cn(
                  "w-full py-3 rounded-lg bg-gradient-to-r from-cme-navy to-cme-gold",
                  "text-white font-medium transition-all hover:opacity-90",
                  isLoading && "opacity-70 cursor-not-allowed"
                )}
              >
                {isLoading ? "Connexion en cours..." : "Se connecter"}
              </button>
            </form>
            
            <div className="mt-6 relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10"></div>
              </div>
              <div className="relative flex justify-center">
                <span className="px-2 bg-cme-navy/60 text-white/60 text-sm">ou</span>
              </div>
            </div>
            
            <p className="mt-6 text-center text-sm text-white/60">
              Vous n'avez pas de compte?{" "}
              <Link to="/register" className="text-cme-gold hover:underline">
                Créer un compte
              </Link>
            </p>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default LoginPage;
