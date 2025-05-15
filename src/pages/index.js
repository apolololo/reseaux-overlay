import { requireAuth } from '../middleware/auth';
import { generateOverlayUrl } from '../auth/twitch';
import { useState, useEffect } from 'react';

export default function Home() {
  const [overlayUrl, setOverlayUrl] = useState('');
  const [user, setUser] = useState(null);

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const response = await fetch('/api/user');
        const userData = await response.json();
        setUser(userData);
        
        if (userData.id) {
          const url = generateOverlayUrl(userData.id);
          setOverlayUrl(url);
        }
      } catch (error) {
        console.error('Error loading user data:', error);
      }
    };

    loadUserData();
  }, []);

  if (!user) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center relative bg-gray-900">
        {/* Fond flou */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat blur-md opacity-20"
          style={{
            backgroundImage: 'url(/images/bg-pattern.png)',
            filter: 'blur(8px)'
          }}
        />
        
        {/* Contenu centré */}
        <div className="relative z-10 text-center">
          <a
            href="/auth/twitch"
            className="inline-flex items-center px-8 py-4 bg-[#9146FF] text-white rounded-lg hover:bg-[#7c2cff] transition-colors duration-200 text-lg font-medium shadow-lg hover:shadow-xl"
          >
            <svg className="w-6 h-6 mr-3" viewBox="0 0 24 24" fill="currentColor">
              <path d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714Z"/>
            </svg>
            Se connecter avec Twitch
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Générateur d'Overlay</h1>
        
        <div className="bg-gray-800 shadow-lg rounded-lg p-6">
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Bienvenue, {user.display_name}!</h2>
            <p className="text-gray-400">Votre URL d'overlay personnalisée :</p>
            <div className="mt-2 p-4 bg-gray-700 rounded">
              <code className="text-sm break-all text-gray-300">{overlayUrl}</code>
              <button
                onClick={() => navigator.clipboard.writeText(overlayUrl)}
                className="ml-2 px-3 py-1 bg-[#9146FF] text-white rounded hover:bg-[#7c2cff] transition-colors duration-200"
              >
                Copier
              </button>
            </div>
          </div>
          
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-2">Instructions :</h3>
            <ol className="list-decimal list-inside space-y-2 text-gray-300">
              <li>Copiez l'URL de l'overlay ci-dessus</li>
              <li>Ajoutez-la comme source "Navigateur" dans votre logiciel de streaming</li>
              <li>Configurez la taille et la position selon vos besoins</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
} 