
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

interface FollowersGoalWidgetProps {
  userId: string;
  showControls?: boolean;
}

export const FollowersGoalWidget: React.FC<FollowersGoalWidgetProps> = ({ 
  userId, 
  showControls = false 
}) => {
  const [config, setConfig] = useState<WidgetConfig>({
    goal: 1000,
    title: 'Objectif Followers',
    style: 'modern',
    bgColor: '#9146FF',
    textColor: '#FFFFFF',
    progressColor: '#00D4AA'
  });
  const [currentFollowers, setCurrentFollowers] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Charger la configuration depuis la base de données
  const loadConfig = async () => {
    try {
      const { data, error } = await supabase
        .from('widget_configs')
        .select('*')
        .eq('user_id', userId)
        .eq('widget_type', 'followers_goal')
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Erreur lors du chargement de la config:', error);
        return;
      }

      if (data) {
        setConfig(data.config);
        setCurrentFollowers(data.current_followers || 0);
      }
    } catch (error) {
      console.error('Erreur lors du chargement:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Sauvegarder la configuration
  const saveConfig = async (newConfig: WidgetConfig, followers?: number) => {
    try {
      const { error } = await supabase
        .from('widget_configs')
        .upsert({
          user_id: userId,
          widget_type: 'followers_goal',
          config: newConfig,
          current_followers: followers !== undefined ? followers : currentFollowers,
          is_active: true
        });

      if (error) {
        console.error('Erreur lors de la sauvegarde:', error);
      }
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
    }
  };

  // Récupérer les followers depuis l'API Twitch
  const fetchFollowers = async () => {
    try {
      const token = localStorage.getItem('twitch_token');
      const userData = localStorage.getItem('twitch_user');
      
      if (!token || !userData) return;

      const user = JSON.parse(userData);
      const response = await fetch(`https://api.twitch.tv/helix/channels/followers?broadcaster_id=${user.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Client-Id': 'z8q1w4g12yrql6cyb5zzwmhe1pnxyn'
        }
      });

      if (response.ok) {
        const data = await response.json();
        const followers = data.total || data.total_count || 0;
        
        if (followers !== currentFollowers) {
          setCurrentFollowers(followers);
          await saveConfig(config, followers);
        }
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des followers:', error);
    }
  };

  // Écouter les changements en temps réel
  useEffect(() => {
    loadConfig();

    const channel = supabase
      .channel('widget_config_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'widget_configs',
          filter: `user_id=eq.${userId}`
        },
        (payload) => {
          if (payload.new) {
            setConfig(payload.new.config);
            setCurrentFollowers(payload.new.current_followers || 0);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId]);

  // Polling des followers
  useEffect(() => {
    fetchFollowers();
    const interval = setInterval(fetchFollowers, 3000);
    return () => clearInterval(interval);
  }, [config, currentFollowers]);

  const percentage = Math.min((currentFollowers / config.goal) * 100, 100);
  const remaining = Math.max(config.goal - currentFollowers, 0);

  const getStyleClasses = () => {
    switch (config.style) {
      case 'minimal':
        return 'border border-white/20 shadow-none';
      case 'classic':
        return 'shadow-lg';
      case 'neon':
        return 'border-2 border-purple-500 shadow-lg shadow-purple-500/50';
      default:
        return 'shadow-xl';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-white">Chargement...</div>
      </div>
    );
  }

  return (
    <div 
      className={`p-6 rounded-2xl backdrop-blur-lg ${getStyleClasses()} transition-all duration-300`}
      style={{ 
        backgroundColor: config.bgColor + '95',
        color: config.textColor,
        minWidth: '400px',
        maxWidth: '500px'
      }}
    >
      {/* Header */}
      <div className="text-center mb-5">
        <h2 className="text-2xl font-bold uppercase tracking-wide">
          {config.title}
        </h2>
      </div>

      {/* Followers Info */}
      <div className="flex items-center justify-center gap-4 mb-6">
        <div className="text-center">
          <div className="text-4xl font-black mb-1" style={{ color: config.progressColor }}>
            {currentFollowers.toLocaleString()}
          </div>
          <div className="text-sm font-semibold opacity-70">Followers</div>
        </div>
        
        <div className="text-3xl opacity-60">/</div>
        
        <div className="text-center">
          <div className="text-4xl font-black mb-1" style={{ color: config.bgColor }}>
            {config.goal.toLocaleString()}
          </div>
          <div className="text-sm font-semibold opacity-70">Objectif</div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="w-full h-3 bg-white/20 rounded-full overflow-hidden">
          <div 
            className="h-full rounded-full transition-all duration-500 ease-out"
            style={{ 
              width: `${percentage}%`,
              backgroundColor: config.progressColor 
            }}
          />
        </div>
        <div className="text-center mt-2 font-bold">
          {Math.round(percentage)}%
        </div>
      </div>

      {/* Remaining */}
      {remaining > 0 && (
        <div className="text-center">
          <span className="text-sm font-semibold">
            Plus que <span style={{ color: config.progressColor }}>{remaining.toLocaleString()}</span> followers !
          </span>
        </div>
      )}

      {/* Goal Reached */}
      {currentFollowers >= config.goal && (
        <div className="text-center">
          <div className="text-lg font-bold animate-pulse" style={{ color: config.progressColor }}>
            🎉 OBJECTIF ATTEINT ! 🎉
          </div>
        </div>
      )}

      {/* Controls pour les tests */}
      {showControls && (
        <div className="mt-4 pt-4 border-t border-white/20">
          <div className="flex gap-2 justify-center">
            <button 
              onClick={() => {
                const newFollowers = Math.max(0, currentFollowers - 1);
                setCurrentFollowers(newFollowers);
                saveConfig(config, newFollowers);
              }}
              className="px-3 py-1 bg-red-500 text-white rounded text-sm"
            >
              -1
            </button>
            <button 
              onClick={() => {
                const newFollowers = currentFollowers + 1;
                setCurrentFollowers(newFollowers);
                saveConfig(config, newFollowers);
              }}
              className="px-3 py-1 bg-green-500 text-white rounded text-sm"
            >
              +1
            </button>
            <button 
              onClick={() => {
                const newFollowers = currentFollowers + 10;
                setCurrentFollowers(newFollowers);
                saveConfig(config, newFollowers);
              }}
              className="px-3 py-1 bg-green-600 text-white rounded text-sm"
            >
              +10
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
