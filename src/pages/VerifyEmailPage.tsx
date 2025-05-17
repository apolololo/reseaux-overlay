
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSignUp } from "@clerk/clerk-react";
import { useToast } from "@/hooks/use-toast";
import Navigation from "@/components/ui/Navigation";
import Footer from "@/components/ui/Footer";
import { cn } from "@/lib/utils";

const VerifyEmailPage = () => {
  const [verificationCode, setVerificationCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { signUp, isLoaded: clerkLoaded } = useSignUp();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleVerifyEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clerkLoaded || !signUp) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue. Veuillez réessayer.",
        variant: "destructive"
      });
      return;
    }
    
    try {
      setIsLoading(true);
      
      const result = await signUp.attemptEmailAddressVerification({
        code: verificationCode,
      });
      
      if (result.status === "complete") {
        toast({
          title: "Email vérifié",
          description: "Votre compte a été créé avec succès"
        });
        navigate("/");
      } else {
        toast({
          title: "Vérification incomplète",
          description: "Veuillez réessayer ou contacter le support",
          variant: "destructive"
        });
      }
    } catch (err: any) {
      toast({
        title: "Erreur de vérification",
        description: err.errors?.[0]?.message || "Code de vérification invalide. Veuillez réessayer.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (!clerkLoaded || !signUp) return;
    
    try {
      setIsLoading(true);
      await signUp.prepareEmailAddressVerification({
        strategy: "email_code"
      });
      
      toast({
        title: "Code envoyé",
        description: "Un nouveau code de vérification a été envoyé à votre email"
      });
    } catch (err: any) {
      toast({
        title: "Erreur",
        description: err.errors?.[0]?.message || "Une erreur est survenue lors de l'envoi du code.",
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
            <h1 className="text-3xl font-bold mb-2">Vérifiez votre email</h1>
            <p className="text-white/70">
              Nous avons envoyé un code de vérification à votre adresse email.
              Veuillez entrer ce code ci-dessous pour vérifier votre compte.
            </p>
          </div>
          
          <div className="neo-glass border border-white/10 rounded-xl p-6 md:p-8">
            <form onSubmit={handleVerifyEmail} className="space-y-6">
              <div>
                <label htmlFor="code" className="block text-sm font-medium mb-1">
                  Code de vérification
                </label>
                <input
                  id="code"
                  type="text"
                  placeholder="Entrez le code à 6 chiffres"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  className={cn(
                    "w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg",
                    "focus:outline-none focus:ring-2 focus:ring-cme-gold/50 text-white",
                    "font-mono text-center text-lg tracking-wide"
                  )}
                  maxLength={6}
                  required
                />
              </div>
              
              <button
                type="submit"
                disabled={isLoading || verificationCode.length < 6}
                className={cn(
                  "w-full py-3 rounded-lg bg-gradient-to-r from-cme-navy to-cme-gold",
                  "text-white font-medium transition-all hover:opacity-90",
                  (isLoading || verificationCode.length < 6) && "opacity-70 cursor-not-allowed"
                )}
              >
                {isLoading ? "Vérification..." : "Vérifier mon email"}
              </button>
              
              <div className="text-center">
                <button
                  type="button"
                  onClick={handleResendCode}
                  disabled={isLoading}
                  className="text-cme-gold hover:underline text-sm"
                >
                  Je n'ai pas reçu de code, renvoyer
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default VerifyEmailPage;
