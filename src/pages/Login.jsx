import React from 'react';
import { config } from '../config';

const Login = () => {
  const loginUrl = `https://id.twitch.tv/oauth2/authorize?client_id=${config.twitchClientId}&redirect_uri=${encodeURIComponent(config.twitchRedirectUri)}&response_type=code&scope=${config.twitchScopes.join('+')}`;

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-900 relative overflow-hidden">
      {/* Fond animé */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-pattern opacity-10"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 to-gray-900"></div>
      </div>

      {/* Contenu principal */}
      <div className="relative z-10 text-center max-w-md w-full mx-4">
        <h1 className="text-3xl font-bold text-white mb-6">
          Générateur d'Overlay
        </h1>
        
        <div className="bg-gray-800/50 p-6 rounded-lg backdrop-blur-sm shadow-xl">
          <p className="text-gray-300 text-sm mb-6">
            Connectez-vous avec Twitch pour accéder à vos overlays
          </p>
          
          <a
            href={loginUrl}
            className="inline-flex items-center px-4 py-2 bg-[#9146FF] text-white text-sm rounded hover:bg-[#7c2cff] transition-all duration-200 font-medium"
          >
            <svg 
              className="w-5 h-5 mr-2" 
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
        className="fixed bottom-4 right-4 bg-red-500 text-white px-4 py-2 rounded shadow-lg hidden"
      >
        Une erreur est survenue lors de la connexion
      </div>
    </div>
  );
};

export default Login; 