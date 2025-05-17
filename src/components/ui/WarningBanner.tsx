
import { AlertTriangle, X } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";

const WarningBanner = () => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed bottom-4 left-4 z-50 max-w-sm"
    >
      <div className="backdrop-blur-md bg-gradient-to-r from-amber-900/70 to-amber-800/70 border border-amber-700/30 rounded-lg shadow-lg">
        <div className="p-3 pr-8 relative">
          <button 
            onClick={() => setIsVisible(false)} 
            className="absolute top-2 right-2 text-amber-200/80 hover:text-amber-200 transition-colors"
            aria-label="Fermer"
          >
            <X className="h-3 w-3" />
          </button>
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-amber-400 flex-shrink-0 mt-0.5" />
            <p className="text-amber-200 text-sm">
              Les services de climatisation seront bientôt disponibles. Pour le moment, je me concentre uniquement sur les prestations d'électricité.
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default WarningBanner;
