# APO Overlays

Application web pour la gestion d'overlays Twitch personnalisables.

## Configuration de l'authentification Twitch

Pour que l'authentification Twitch fonctionne correctement, vous devez créer une application Twitch Developer :

1. Allez sur [https://dev.twitch.tv/console/apps](https://dev.twitch.tv/console/apps)
2. Connectez-vous avec votre compte Twitch
3. Cliquez sur "Register Your Application"
4. Remplissez les informations :
   - Nom : APO Overlays
   - URL de redirection OAuth : `https://apo-overlay.netlify.app/src/auth/twitch-auth.html`
   - Catégorie : Website Integration
5. Cliquez sur "Create"
6. Une fois créée, cliquez sur "Manage" pour voir votre Client ID
7. Copiez le Client ID et remplacez la valeur dans le fichier `src/auth/twitch-auth.html` à la ligne 149

### Configuration pour le développement local

Pour tester l'authentification en local :

1. Créez une seconde application Twitch Developer (ou modifiez l'existante)
2. Définissez l'URL de redirection OAuth à : `http://localhost:5500/src/auth/twitch-auth-local.html`
3. Copiez le Client ID et remplacez la valeur dans le fichier `src/auth/twitch-auth-local.html`
4. Utilisez un serveur local comme Live Server dans VS Code pour tester

## Fonctionnalités

- Prévisualisation des overlays
- Authentification Twitch pour les fonctionnalités en temps réel
- Personnalisation des overlays
- Copie facile des URLs pour OBS

## Overlays disponibles

- Réseaux sociaux
- Objectif de followers
- Starting Soon
- Pause
- Fin de stream
- Status de jeu
- Maps Fortnite

## Utilisation

1. Connectez-vous avec votre compte Twitch
2. Sélectionnez un overlay dans la liste
3. Personnalisez-le selon vos besoins
4. Cliquez sur "Copier l'URL pour OBS"
5. Dans OBS, ajoutez une source "Navigateur" et collez l'URL