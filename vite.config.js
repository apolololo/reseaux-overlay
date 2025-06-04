import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  base: '/',
  build: {
    rollupOptions: {
      input: {
        main: 'index.html',
        auth: 'src/auth.html',
        callback: 'auth/callback.html',
        googleCallback: 'auth/google-callback.html',
        overlay: 'overlay.html',
        privacy: 'src/privacy.html',
        apo: 'src/overlays/common/apo/overlay.html',
        starting: 'src/overlays/common/starting/overlay.html',
        brb: 'src/overlays/common/brb/overlay.html',
        brbVideo: 'src/overlays/common/brb/overlay-video.html',
        end: 'src/overlays/common/end/overlay.html',
        gameStatus: 'src/overlays/common/game-status/overlay.html',
        mapInfo: 'src/overlays/common/maps/overlay.html',
        followersGoal: 'src/overlays/twitch/followers-goal/overlay.html',
        followersGoalConfig: 'src/overlays/twitch/followers-goal/config.html'
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
