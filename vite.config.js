
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
        overlay: resolve(__dirname, 'overlay.html'), // Added this entry
        apo: resolve(__dirname, 'src/overlays/apo/overlay.html'),
        starting: resolve(__dirname, 'src/overlays/starting/overlay.html'),
        brb: resolve(__dirname, 'src/overlays/brb/overlay.html'),
        brbVideo: resolve(__dirname, 'src/overlays/brb/overlay-video.html'),
        end: resolve(__dirname, 'src/overlays/end/overlay.html'),
        gameStatus: resolve(__dirname, 'src/overlays/game-status/overlay.html'),
        mapInfo: resolve(__dirname, 'src/overlays/maps/overlay.html'),
        followersGoal: resolve(__dirname, 'src/overlays/followers-goal/overlay.html'),
        followersGoalConfig: resolve(__dirname, 'src/overlays/followers-goal/config.html')
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
