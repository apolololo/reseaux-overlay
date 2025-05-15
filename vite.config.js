import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  base: '/',
  server: {
    port: 3000,
    open: '/index.html',
    proxy: {
      '/api': 'http://localhost:3000',
      '/auth': 'http://localhost:3000'
    }
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    emptyOutDir: true,
    copyPublicDir: true,
    rollupOptions: {
      input: {
        main: './index.html',
        login: './login.html',
        apo: resolve(__dirname, 'src/overlays/apo/overlay.html'),
        starting: resolve(__dirname, 'src/overlays/starting/overlay.html'),
        brb: resolve(__dirname, 'src/overlays/brb/overlay.html'),
        brbVideo: resolve(__dirname, 'src/overlays/brb/overlay-video.html'),
        end: resolve(__dirname, 'src/overlays/end/overlay.html'),
        gameStatus: resolve(__dirname, 'src/overlays/game-status/overlay.html'),
        mapInfo: resolve(__dirname, 'src/overlays/maps/overlay.html'),
        followersGoal: resolve(__dirname, 'src/overlays/followers-goal/overlay.html')
      },
    },
  }
});