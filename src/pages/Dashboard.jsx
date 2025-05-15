import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [overlayUrl, setOverlayUrl] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const generateUrl = async () => {
      try {
        const response = await fetch('/api/overlay/generate');
        const data = await response.json();
        setOverlayUrl(data.url);
      } catch (error) {
        console.error('Erreur lors de la génération de l\'URL:', error);
      }
    };

    if (user) {
      generateUrl();
    }
  }, [user]);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(overlayUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Erreur lors de la copie:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="bg-gray-800 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">Générateur d'Overlay</h1>
            <div className="flex items-center space-x-4">
              <span className="text-gray-300">
                Bienvenue, {user?.display_name}
              </span>
              <button
                onClick={logout}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Déconnexion
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Contenu principal */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-gray-800 rounded-xl shadow-xl p-6">
          <h2 className="text-xl font-semibold mb-4">Votre URL d'overlay</h2>
          
          <div className="bg-gray-700 p-4 rounded-lg mb-6">
            <div className="flex items-center space-x-4">
              <code className="flex-1 text-sm break-all text-purple-300">
                {overlayUrl}
              </code>
              <button
                onClick={copyToClipboard}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  copied 
                    ? 'bg-green-500 hover:bg-green-600' 
                    : 'bg-purple-600 hover:bg-purple-700'
                }`}
              >
                {copied ? 'Copié !' : 'Copier'}
              </button>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium">Instructions :</h3>
            <ol className="list-decimal list-inside space-y-2 text-gray-300">
              <li>Copiez l'URL de l'overlay ci-dessus</li>
              <li>Dans votre logiciel de streaming, ajoutez une nouvelle source "Navigateur"</li>
              <li>Collez l'URL dans le champ approprié</li>
              <li>Ajustez la taille et la position selon vos besoins</li>
              <li>L'overlay se mettra à jour automatiquement lorsque vous ferez des modifications</li>
            </ol>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard; 