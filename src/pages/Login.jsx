import React from 'react';

const Login = () => {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-900 relative overflow-hidden">
      {/* Fond animé */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-pattern opacity-20 animate-pulse"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/30 to-gray-900"></div>
      </div>

      {/* Contenu principal */}
      <div className="relative z-10 text-center px-4">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-8 tracking-tight">
          Générateur d'Overlay
        </h1>
        
        <div className="max-w-md mx-auto bg-gray-800/50 p-8 rounded-xl backdrop-blur-sm shadow-2xl">
          <p className="text-gray-300 mb-6">
            Connectez-vous avec Twitch pour accéder à vos overlays personnalisés
          </p>
          
          <a
            href="/auth/twitch"
            className="group inline-flex items-center px-8 py-4 bg-[#9146FF] text-white rounded-lg hover:bg-[#7c2cff] transition-all duration-200 text-lg font-medium shadow-lg hover:shadow-purple-500/20"
          >
            <svg 
              className="w-6 h-6 mr-3 transition-transform group-hover:-translate-y-px" 
              viewBox="0 0 24 24" 
              fill="currentColor"
            >
              <path d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714Z"/>
            </svg>
            Se connecter avec Twitch
          </a>
        </div>
      </div>

      {/* Message d'erreur */}
      <div 
        id="error-message" 
        className="fixed bottom-4 right-4 bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg transform transition-transform duration-200 translate-y-full"
      >
        Une erreur est survenue lors de la connexion
      </div>
    </div>
  );
};

export default Login; 