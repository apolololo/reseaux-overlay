
import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  base: '/',
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        auth: resolve(__dirname, 'src/auth.html'),
        callback: resolve(__dirname, 'auth/callback.html'),
        googleCallback: resolve(__dirname, 'auth/google-callback.html'),
        overlay: resolve(__dirname, 'overlay.html'),
        privacy: resolve(__dirname, 'src/privacy.html'),
        // Twitch overlays
        twitchApo: resolve(__dirname, 'src/overlays/twitch/apo/overlay.html'),
        twitchStarting: resolve(__dirname, 'src/overlays/twitch/starting/overlay.html'),
        twitchBrb: resolve(__dirname, 'src/overlays/twitch/brb/overlay.html'),
        twitchBrbVideo: resolve(__dirname, 'src/overlays/twitch/brb/overlay-video.html'),
        twitchEnd: resolve(__dirname, 'src/overlays/twitch/end/overlay.html'),
        twitchGameStatus: resolve(__dirname, 'src/overlays/twitch/game-status/overlay.html'),
        twitchMapInfo: resolve(__dirname, 'src/overlays/twitch/maps/overlay.html'),
        twitchFollowersGoal: resolve(__dirname, 'src/overlays/twitch/followers-goal/overlay.html'),
        twitchFollowersGoalConfig: resolve(__dirname, 'src/overlays/twitch/followers-goal/config.html'),
        
        // YouTube overlays
        youtubeApo: resolve(__dirname, 'src/overlays/youtube/apo/overlay.html'),
        youtubeStarting: resolve(__dirname, 'src/overlays/youtube/starting/overlay.html'),
        youtubeBrb: resolve(__dirname, 'src/overlays/youtube/brb/overlay.html'),
        youtubeEnd: resolve(__dirname, 'src/overlays/youtube/end/overlay.html'),
        youtubeGameStatus: resolve(__dirname, 'src/overlays/youtube/game-status/overlay.html'),
        youtubeMapInfo: resolve(__dirname, 'src/overlays/youtube/maps/overlay.html')
      },
    },
    assetsDir: 'assets',
    outDir: 'dist',
    emptyOutDir: true,
    copyPublicDir: true
  },
  server: {
    port: 8080,
    open: '/index.html'
  }
});
