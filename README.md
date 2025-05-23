# APO Overlays

Système d'overlays pour streamers avec éditeur intégré.

## Installation

1. Cloner le repository :
```bash
git clone https://github.com/votre-username/apo-overlays.git
cd apo-overlays
```

2. Installer les dépendances :
```bash
npm install
```

3. Lancer le serveur de développement :
```bash
npm run dev
```

## Déploiement

1. Construire le projet :
```bash
npm run build
```

2. Le dossier `dist` contient tous les fichiers nécessaires pour le déploiement.

3. Déployer le contenu du dossier `dist` sur votre hébergeur (Netlify, Vercel, etc.).

## Utilisation

1. Accédez à l'éditeur via `/editor.html`
2. Créez votre overlay en modifiant le HTML, CSS et JavaScript
3. Sauvegardez votre overlay
4. Copiez l'URL générée
5. Dans OBS :
   - Ajoutez une source "Navigateur"
   - Collez l'URL de l'overlay
   - Définissez la largeur à 1920 et la hauteur à 1080

## Structure du projet

```
apo-overlays/
├── src/                    # Code source
├── dist/                   # Fichiers de production (généré)
├── editor.html            # Éditeur d'overlays
├── overlay.html           # Template d'overlay
├── my-overlays.html       # Bibliothèque d'overlays
├── marketplace.html       # Marketplace d'overlays
├── index.html             # Page d'accueil
├── package.json           # Dépendances
└── vite.config.js         # Configuration Vite
```

## Fonctionnalités

- Éditeur de code en temps réel
- Prévisualisation instantanée
- Sauvegarde automatique
- URL unique pour chaque overlay
- Intégration facile avec OBS
- Dimensions optimisées pour le streaming (1920x1080)

## Support

Pour toute question ou problème, veuillez ouvrir une issue sur GitHub. 