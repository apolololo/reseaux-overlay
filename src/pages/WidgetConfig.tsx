
import React, { useEffect, useState } from 'react';
import { FollowersGoalConfig } from '../components/FollowersGoalConfig';
import { FollowersGoalWidget } from '../components/FollowersGoalWidget';

export const WidgetConfig = () => {
  const [userId, setUserId] = useState<string>('');

  useEffect(() => {
    // Récupérer l'ID utilisateur depuis les données Twitch
    const userData = localStorage.getItem('twitch_user');
    if (userData) {
      try {
        const user = JSON.parse(userData);
        setUserId(user.id);
      } catch (error) {
        console.error('Erreur lors du parsing des données utilisateur:', error);
      }
    }
  }, []);

  if (!userId) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center">
        <div className="bg-white rounded-lg p-6 text-center">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            Authentification requise
          </h2>
          <p className="text-gray-600 mb-4">
            Vous devez être connecté avec Twitch pour configurer votre widget.
          </p>
          <a 
            href="/src/auth.html" 
            className="inline-block bg-purple-600 text-white px-6 py-2 rounded hover:bg-purple-700"
          >
            Se connecter avec Twitch
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500 to-blue-600 py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Configuration */}
          <div>
            <FollowersGoalConfig userId={userId} />
          </div>
          
          {/* Aperçu */}
          <div>
            <div className="bg-white rounded-lg p-6 mb-4">
              <h2 className="text-xl font-bold text-center mb-4">👀 Aperçu en temps réel</h2>
              <div className="flex justify-center">
                <FollowersGoalWidget userId={userId} showControls={false} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
