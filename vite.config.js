import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  base: '/',
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        apo: resolve(__dirname, 'src/overlays/apo/overlay.html'),
        starting: resolve(__dirname, 'src/overlays/starting/overlay.html'),
        brb: resolve(__dirname, 'src/overlays/brb/overlay.html'),
        brbVideo: resolve(__dirname, 'src/overlays/brb/overlay-video.html'),
        end: resolve(__dirname, 'src/overlays/end/overlay.html'),
        gameStatus: resolve(__dirname, 'src/overlays/game-status/overlay.html')
      },
    },
    assetsDir: 'assets',
    outDir: 'dist',
    emptyOutDir: true,
    copyPublicDir: true
  },
  server: {
    port: 3000,
    open: '/index.html'
  }
});