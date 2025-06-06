# APO Overlays

Générateur d'overlays professionnels pour streamers Twitch et YouTube.

## 🚀 Fonctionnalités

- **Authentification** : Connexion Twitch et YouTube
- **Overlays prêts à l'emploi** :
  - Réseaux sociaux animés
  - Écran "Starting Soon" avec timer
  - Écran "Be Right Back"
  - Écran de fin de stream
  - Objectifs de followers en temps réel
  - Indicateur de changement de jeu

## 🛠️ Installation

1. Clonez le projet
2. Installez les dépendances : `npm install`
3. Configurez vos variables d'environnement (voir `.env.example`)
4. Lancez le serveur de développement : `npm run dev`

## 📦 Déploiement

Le site est optimisé pour Netlify avec configuration automatique des redirections.

## 🔧 Configuration

### Twitch
- Client ID : Configuré dans les variables d'environnement
- Scopes : `user:read:email channel:read:subscriptions moderator:read:followers`

### YouTube
- Client ID Google : Configuré dans les variables d'environnement
- Scopes : Profil utilisateur et lecture YouTube

## 📱 Utilisation

1. Connectez-vous avec Twitch ou YouTube
2. Choisissez un overlay
3. Prévisualisez le résultat
4. Copiez l'URL pour OBS Studio

## 🎨 Personnalisation

Chaque overlay est entièrement personnalisable via les paramètres d'URL et peut être adapté selon vos besoins.

## 📄 Licence

Projet personnel - APO Overlays