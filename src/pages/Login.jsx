import React from 'react';
import { config } from '../config';

const Login = () => {
  const loginUrl = `https://id.twitch.tv/oauth2/authorize?client_id=${config.twitchClientId}&redirect_uri=${encodeURIComponent(config.twitchRedirectUri)}&response_type=code&scope=${config.twitchScopes.join('+')}`;

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-[#0E0E10]">
      {/* Effet de fond */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-radial from-purple-900/20 via-transparent to-transparent"></div>
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
      </div>

      {/* Logo et Titre */}
      <div className="relative z-10 mb-12">
        <div className="w-20 h-20 mx-auto mb-6 relative">
          <div className="absolute inset-0 bg-purple-500 rounded-2xl rotate-45 blur-lg opacity-50"></div>
          <div className="absolute inset-0 bg-gradient-to-br from-purple-600 to-purple-800 rounded-2xl rotate-45"></div>
          <svg 
            className="relative w-12 h-12 mx-auto mt-4 text-white" 
            viewBox="0 0 24 24" 
            fill="currentColor"
          >
            <path d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714Z"/>
          </svg>
        </div>
        <h1 className="text-4xl font-bold text-white text-center tracking-tight">
          APO <span className="text-purple-500">Overlay</span>
        </h1>
        <p className="mt-3 text-gray-400 text-center max-w-sm">
          Créez et gérez vos overlays Twitch en quelques clics
        </p>
      </div>

      {/* Bouton de connexion */}
      <div className="relative z-10 w-full max-w-sm px-4">
        <div className="bg-gray-800/50 backdrop-blur-xl rounded-xl p-6 border border-gray-700/50">
          <a
            href={loginUrl}
            className="group relative w-full flex items-center justify-center px-4 py-3 bg-[#9146FF] text-white rounded-lg transition-all duration-200 overflow-hidden hover:bg-[#7c2cff] focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-800"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-purple-600 opacity-0 group-hover:opacity-20 transition-opacity"></div>
            <svg 
              className="w-5 h-5 mr-3" 
              viewBox="0 0 24 24" 
              fill="currentColor"
            >
              <path d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714Z"/>
            </svg>
            <span className="font-medium">Connexion avec Twitch</span>
          </a>
          
          <p className="mt-4 text-xs text-center text-gray-500">
            En vous connectant, vous acceptez nos conditions d'utilisation
          </p>
        </div>
      </div>

      {/* Message d'erreur */}
      <div 
        id="error-message" 
        className="fixed bottom-4 right-4 bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg hidden"
      >
        Une erreur est survenue lors de la connexion
      </div>
    </div>
  );
};

export default Login; 