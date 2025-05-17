
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import Navigation from "@/components/ui/Navigation";
import Footer from "@/components/ui/Footer";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";

const RegisterPage = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { signUp } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleEmailSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setIsLoading(true);
      
      // Sign up the user
      const { error } = await signUp(email, password, firstName, lastName);
      
      if (error) {
        toast({
          title: "Erreur d'inscription",
          description: error.message || "Une erreur est survenue lors de l'inscription.",
          variant: "destructive"
        });
        return;
      }
      
      toast({
        title: "Inscription réussie",
        description: "Vous pouvez maintenant vous connecter avec vos identifiants"
      });
      
      navigate("/login");
    } catch (err: any) {
      toast({
        title: "Erreur d'inscription",
        description: err.message || "Une erreur est survenue lors de l'inscription.",
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
            <h1 className="text-3xl font-bold mb-2">Créer un compte</h1>
            <p className="text-white/70">Rejoignez CME pour suivre vos projets</p>
          </div>
          
          <div className="neo-glass border border-white/10 rounded-xl p-6 md:p-8">
            <form onSubmit={handleEmailSignUp} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium mb-1">Prénom</label>
                  <input
                    id="firstName"
                    type="text"
                    placeholder="Prénom"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className={cn(
                      "w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg",
                      "focus:outline-none focus:ring-2 focus:ring-cme-gold/50 text-white"
                    )}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium mb-1">Nom</label>
                  <input
                    id="lastName"
                    type="text"
                    placeholder="Nom"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className={cn(
                      "w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg",
                      "focus:outline-none focus:ring-2 focus:ring-cme-gold/50 text-white"
                    )}
                    required
                  />
                </div>
              </div>
              
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
                <label htmlFor="password" className="block text-sm font-medium mb-1">Mot de passe</label>
                <input
                  id="password"
                  type="password"
                  placeholder="8 caractères minimum"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={cn(
                    "w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg",
                    "focus:outline-none focus:ring-2 focus:ring-cme-gold/50 text-white"
                  )}
                  required
                  minLength={8}
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
                {isLoading ? "Inscription en cours..." : "Créer un compte"}
              </button>
            </form>
            
            <p className="mt-6 text-center text-sm text-white/60">
              Vous avez déjà un compte?{" "}
              <Link to="/login" className="text-cme-gold hover:underline">
                Se connecter
              </Link>
            </p>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default RegisterPage;
