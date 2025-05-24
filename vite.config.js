
import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  base: '/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        editor: resolve(__dirname, 'editor.html'),
        overlay: resolve(__dirname, 'overlay.html'),
        login: resolve(__dirname, 'login.html'),
        navigation: resolve(__dirname, 'src/components/navigation.js'),
        'my-overlays': resolve(__dirname, 'my-overlays.html'),
        marketplace: resolve(__dirname, 'marketplace.html'),

      }
    }
  },
  server: {
    port: 8080,
    open: true
  }
});
