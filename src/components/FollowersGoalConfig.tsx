
import React, { useState, useEffect } from 'react';
import { supabase } from '../integrations/supabase/client';

interface WidgetConfig {
  goal: number;
  title: string;
  style: string;
  bgColor: string;
  textColor: string;
  progressColor: string;
}

interface FollowersGoalConfigProps {
  userId: string;
}

export const FollowersGoalConfig: React.FC<FollowersGoalConfigProps> = ({ userId }) => {
  const [config, setConfig] = useState<WidgetConfig>({
    goal: 1000,
    title: 'Objectif Followers',
    style: 'modern',
    bgColor: '#9146FF',
    textColor: '#FFFFFF',
    progressColor: '#00D4AA'
  });
  const [currentFollowers, setCurrentFollowers] = useState(0);
  const [isSaving, setIsSaving] = useState(false);

  // Charger la configuration
  const loadConfig = async () => {
    try {
      const { data, error } = await supabase
        .from('widget_configs')
        .select('*')
        .eq('user_id', userId)
        .eq('widget_type', 'followers_goal')
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Erreur lors du chargement:', error);
        return;
      }

      if (data) {
        setConfig(data.config);
        setCurrentFollowers(data.current_followers || 0);
      }
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  // Sauvegarder la configuration
  const saveConfig = async (newConfig: WidgetConfig) => {
    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('widget_configs')
        .upsert({
          user_id: userId,
          widget_type: 'followers_goal',
          config: newConfig,
          current_followers: currentFollowers,
          is_active: true
        });

      if (error) {
        console.error('Erreur lors de la sauvegarde:', error);
        alert('Erreur lors de la sauvegarde');
      } else {
        alert('Configuration sauvegardée avec succès !');
      }
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de la sauvegarde');
    } finally {
      setIsSaving(false);
    }
  };

  // Ajuster les followers manuellement
  const adjustFollowers = async (amount: number) => {
    const newFollowers = Math.max(0, currentFollowers + amount);
    setCurrentFollowers(newFollowers);
    
    try {
      const { error } = await supabase
        .from('widget_configs')
        .upsert({
          user_id: userId,
          widget_type: 'followers_goal',
          config: config,
          current_followers: newFollowers,
          is_active: true
        });

      if (error) {
        console.error('Erreur lors de la mise à jour des followers:', error);
      }
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  // Charger au démarrage
  useEffect(() => {
    loadConfig();
  }, [userId]);

  // Mettre à jour la configuration en temps réel
  const handleConfigChange = (field: keyof WidgetConfig, value: any) => {
    const newConfig = { ...config, [field]: value };
    setConfig(newConfig);
    
    // Sauvegarder automatiquement après 500ms de délai
    const timeoutId = setTimeout(() => {
      saveConfig(newConfig);
    }, 500);
    
    return () => clearTimeout(timeoutId);
  };

  const progress = Math.min((currentFollowers / config.goal) * 100, 100);

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold text-center mb-6">🎯 Configuration Followers Goal</h1>
      
      {/* Informations actuelles */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <h3 className="font-semibold text-blue-800 mb-2">📊 Informations actuelles</h3>
        <div className="grid grid-cols-3 gap-4 text-sm">
          <div>
            <span className="text-gray-600">Followers:</span>
            <div className="font-bold">{currentFollowers.toLocaleString()}</div>
          </div>
          <div>
            <span className="text-gray-600">Objectif:</span>
            <div className="font-bold">{config.goal.toLocaleString()}</div>
          </div>
          <div>
            <span className="text-gray-600">Progression:</span>
            <div className="font-bold">{Math.round(progress)}%</div>
          </div>
        </div>
      </div>

      {/* Contrôles manuels */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
        <h3 className="font-semibold text-yellow-800 mb-2">🔧 Test manuel</h3>
        <div className="flex gap-2 justify-center">
          <button 
            onClick={() => adjustFollowers(-10)}
            className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
          >
            -10
          </button>
          <button 
            onClick={() => adjustFollowers(-1)}
            className="px-3 py-1 bg-red-400 text-white rounded hover:bg-red-500"
          >
            -1
          </button>
          <button 
            onClick={() => adjustFollowers(1)}
            className="px-3 py-1 bg-green-400 text-white rounded hover:bg-green-500"
          >
            +1
          </button>
          <button 
            onClick={() => adjustFollowers(10)}
            className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
          >
            +10
          </button>
        </div>
      </div>

      {/* Configuration */}
      <div className="space-y-4">
        {/* Objectif */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            🎯 Objectif de followers
          </label>
          <input
            type="number"
            min="1"
            max="100000"
            value={config.goal}
            onChange={(e) => handleConfigChange('goal', parseInt(e.target.value) || 1000)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        {/* Titre */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            📝 Titre personnalisé
          </label>
          <input
            type="text"
            maxLength={50}
            value={config.title}
            onChange={(e) => handleConfigChange('title', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        {/* Style */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            🎨 Style d'affichage
          </label>
          <select
            value={config.style}
            onChange={(e) => handleConfigChange('style', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="modern">Moderne</option>
            <option value="classic">Classique</option>
            <option value="minimal">Minimal</option>
            <option value="neon">Néon</option>
          </select>
        </div>

        {/* Couleurs */}
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              🌈 Arrière-plan
            </label>
            <input
              type="color"
              value={config.bgColor}
              onChange={(e) => handleConfigChange('bgColor', e.target.value)}
              className="w-full h-10 rounded border border-gray-300"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              ✏️ Texte
            </label>
            <input
              type="color"
              value={config.textColor}
              onChange={(e) => handleConfigChange('textColor', e.target.value)}
              className="w-full h-10 rounded border border-gray-300"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              📊 Progression
            </label>
            <input
              type="color"
              value={config.progressColor}
              onChange={(e) => handleConfigChange('progressColor', e.target.value)}
              className="w-full h-10 rounded border border-gray-300"
            />
          </div>
        </div>
      </div>

      {/* URL pour OBS */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="font-semibold text-gray-800 mb-2">🔗 URL pour OBS</h3>
        <div className="bg-white p-2 rounded border font-mono text-sm break-all">
          {window.location.origin}/widget/{userId}
        </div>
        <p className="text-sm text-gray-600 mt-2">
          Copiez cette URL dans OBS en tant que source navigateur. Elle ne changera jamais et se mettra à jour automatiquement.
        </p>
      </div>

      {isSaving && (
        <div className="text-center text-purple-600 font-medium">
          Sauvegarde en cours...
        </div>
      )}
    </div>
  );
};
