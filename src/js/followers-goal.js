// Gestion du widget Followers Goal
export function initFollowersGoal(token) {
  if (!token) {
    console.error('Token Twitch manquant');
    return;
  }

  let ws = null;
  let reconnectAttempts = 0;
  const maxReconnectAttempts = 5;

  function connectWebSocket() {
    const wsUrl = `wss://uejmtvhqzadtxrqtowtm.supabase.co/functions/v1/followers-ws`;
    ws = new WebSocket(wsUrl);

    ws.onopen = () => {
      console.log('WebSocket connecté');
      reconnectAttempts = 0;
      
      // Envoyer le token d'authentification
      ws.send(JSON.stringify({
        type: 'authorization',
        token: token
      }));
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        handleWebSocketMessage(data);
      } catch (error) {
        console.error('Erreur lors du traitement du message:', error);
      }
    };

    ws.onclose = (event) => {
      console.log('WebSocket fermé:', event.code, event.reason);
      handleWebSocketClose();
    };

    ws.onerror = (error) => {
      console.error('Erreur WebSocket:', error);
    };
  }

  function handleWebSocketMessage(data) {
    switch (data.type) {
      case 'auth_success':
        console.log('Authentification réussie:', data);
        updateFollowerCount(data.followers);
        break;

      case 'followers_update':
        console.log('Mise à jour des followers:', data);
        updateFollowerCount(data.count);
        break;

      case 'new_follower':
        console.log('Nouveau follower:', data);
        handleNewFollower(data.follower);
        break;

      case 'error':
        console.error('Erreur WebSocket:', data.message);
        break;
    }
  }

  function handleWebSocketClose() {
    if (reconnectAttempts < maxReconnectAttempts) {
      const delay = Math.min(1000 * Math.pow(2, reconnectAttempts), 30000);
      reconnectAttempts++;
      
      console.log(`Tentative de reconnexion ${reconnectAttempts}/${maxReconnectAttempts} dans ${delay/1000}s`);
      
      setTimeout(connectWebSocket, delay);
    } else {
      console.error('Nombre maximum de tentatives de reconnexion atteint');
    }
  }

  function updateFollowerCount(count) {
    const currentCount = document.getElementById('currentCount');
    if (currentCount) {
      currentCount.textContent = count.toLocaleString();
      
      // Mettre à jour la barre de progression
      const progressFill = document.getElementById('progressFill');
      const targetCount = parseInt(document.getElementById('targetCount').textContent.replace(/,/g, ''));
      
      if (progressFill && !isNaN(targetCount)) {
        const percentage = Math.min((count / targetCount) * 100, 100);
        progressFill.style.width = `${percentage}%`;
      }
    }
  }

  function handleNewFollower(follower) {
    const container = document.querySelector('.goal-container');
    if (container) {
      container.classList.add('new-follower');
      setTimeout(() => {
        container.classList.remove('new-follower');
      }, 3000);
    }
  }

  // Initialiser la connexion WebSocket
  connectWebSocket();

  // Nettoyer la connexion lors du démontage
  return () => {
    if (ws) {
      ws.close();
    }
  };
}