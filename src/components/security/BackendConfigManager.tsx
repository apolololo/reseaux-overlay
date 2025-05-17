
import { useState, useEffect } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CloudCog, Info } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

interface BackendConfigManagerProps {
  onConfigured?: () => void;
}

const BackendConfigManager = ({ onConfigured }: BackendConfigManagerProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [backendUrl, setBackendUrl] = useState('');
  const [isConfigured, setIsConfigured] = useState(false);
  const [usingEnvVars, setUsingEnvVars] = useState(false);

  useEffect(() => {
    // Vérifier si on utilise les variables d'environnement
    const envBackendUrl = import.meta.env.VITE_BACKEND_URL;
    setUsingEnvVars(!!envBackendUrl);
    setIsConfigured(!!envBackendUrl);
    
    // Si on n'utilise pas les variables d'environnement, charger depuis localStorage
    if (!envBackendUrl) {
      const storedUrl = localStorage.getItem('backend_url');
      if (storedUrl) {
        setBackendUrl(storedUrl);
        setIsConfigured(true);
      }
    }
  }, []);

  const handleSave = () => {
    if (!backendUrl || !backendUrl.startsWith('http')) {
      toast({
        title: "Erreur",
        description: "Veuillez saisir une URL valide (commençant par http:// ou https://)",
        variant: "destructive"
      });
      return;
    }
    
    localStorage.setItem('backend_url', backendUrl);
    
    toast({
      title: "Configuration sauvegardée",
      description: "L'URL du backend a été enregistrée localement"
    });
    
    setIsConfigured(true);
    if (onConfigured) onConfigured();
    setIsOpen(false);
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button 
            variant="outline" 
            size="sm" 
            className="absolute top-4 right-20 text-white/70 hover:text-white border-white/10 hover:border-white/30 bg-white/5"
          >
            <CloudCog className="h-4 w-4 mr-2" />
            {isConfigured ? 'Backend configuré' : 'Configurer Backend'}
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Configuration du Backend</DialogTitle>
            <DialogDescription>
              Configurez l'URL de votre serveur backend qui gère l'inscription à la newsletter.
            </DialogDescription>
          </DialogHeader>
          
          {usingEnvVars && (
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3 text-sm text-blue-200 mb-4 flex items-start">
              <Info className="h-4 w-4 mt-0.5 mr-2 flex-shrink-0" />
              <div>
                <p className="font-medium">Variable d'environnement détectée!</p>
                <p>L'URL du backend est configurée via la variable d'environnement VITE_BACKEND_URL. Cette configuration locale sera ignorée.</p>
              </div>
            </div>
          )}
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="backend-url">URL du Backend</Label>
              <Input
                id="backend-url"
                type="text"
                placeholder="https://votre-backend.com/api/subscribe"
                value={backendUrl}
                onChange={(e) => setBackendUrl(e.target.value)}
                disabled={usingEnvVars}
              />
              <p className="text-sm text-gray-500">
                URL complète du point d'API qui gère l'inscription à la newsletter
              </p>
            </div>
          </div>
          <DialogFooter>
            {usingEnvVars ? (
              <Button variant="outline" onClick={() => setIsOpen(false)}>Fermer</Button>
            ) : (
              <Button type="submit" onClick={handleSave}>Enregistrer</Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {!isConfigured && (
        <div className="w-full bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3 mb-4 text-sm text-yellow-200">
          <p className="flex items-center">
            <CloudCog className="h-4 w-4 mr-2" />
            Pour activer la newsletter, veuillez configurer l'URL de votre backend ou définir la variable d'environnement VITE_BACKEND_URL
          </p>
        </div>
      )}
    </>
  );
};

export default BackendConfigManager;
