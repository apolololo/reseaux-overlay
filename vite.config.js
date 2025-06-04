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
        apo: resolve(__dirname, 'src/overlays/common/apo/overlay.html'),
        starting: resolve(__dirname, 'src/overlays/common/starting/overlay.html'),
        brb: resolve(__dirname, 'src/overlays/common/brb/overlay.html'),
        brbVideo: resolve(__dirname, 'src/overlays/common/brb/overlay-video.html'),
        end: resolve(__dirname, 'src/overlays/common/end/overlay.html'),
        gameStatus: resolve(__dirname, 'src/overlays/common/game-status/overlay.html'),
        mapInfo: resolve(__dirname, 'src/overlays/common/maps/overlay.html'),
        followersGoal: resolve(__dirname, 'src/overlays/twitch/followers-goal/overlay.html'),
        followersGoalConfig: resolve(__dirname, 'src/overlays/twitch/followers-goal/config.html')
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
