
/**
 * Ce composant était utilisé pour gérer les clés API
 * Il a été conservé en tant que coquille vide pour référence future
 * Ce composant n'est plus utilisé dans l'application
 * 
 * Pour Netlify, utilisez plutôt les variables d'environnement dans l'interface Netlify
 */

import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";

const ApiKeyManager = () => {
  return (
    <Button
      variant="outline"
      size="sm"
      className="hidden" // Caché intentionnellement 
    >
      <Settings className="h-4 w-4 mr-2" />
      Configuration API
    </Button>
  );
};

export default ApiKeyManager;
