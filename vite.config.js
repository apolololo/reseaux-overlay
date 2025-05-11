import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        apo: resolve(__dirname, 'src/overlays/apo/overlay.html'),
      },
    },
  },
  server: {
    port: 3000,
    open: '/index.html'
  }
});