
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
        navigation: resolve(__dirname, 'navigation.js'),
        'my-overlays': resolve(__dirname, 'my-overlays.html'),
        marketplace: resolve(__dirname, 'marketplace.html'),
        'overlay-1': resolve(__dirname, 'overlay-1.html'),
        'overlay-2': resolve(__dirname, 'overlay-2.html'),
        'overlay-3': resolve(__dirname, 'overlay-3.html'),
        'overlay-4': resolve(__dirname, 'overlay-4.html'),
        'overlay-5': resolve(__dirname, 'overlay-5.html'),
        'overlay-6': resolve(__dirname, 'overlay-6.html'),
        'overlay-7': resolve(__dirname, 'overlay-7.html'),
        'overlay-8': resolve(__dirname, 'overlay-8.html'),
        'overlay-9': resolve(__dirname, 'overlay-9.html'),
        'overlay-10': resolve(__dirname, 'overlay-10.html'),
        'overlay-11': resolve(__dirname, 'overlay-11.html'),
        'overlay-12': resolve(__dirname, 'overlay-12.html'),
        'overlay-13': resolve(__dirname, 'overlay-13.html'),
        'overlay-14': resolve(__dirname, 'overlay-14.html'),
        'overlay-15': resolve(__dirname, 'overlay-15.html'),
        'overlay-16': resolve(__dirname, 'overlay-16.html'),
        'overlay-17': resolve(__dirname, 'overlay-17.html'),
        'overlay-18': resolve(__dirname, 'overlay-18.html'),
        'overlay-19': resolve(__dirname, 'overlay-19.html'),
        'overlay-20': resolve(__dirname, 'overlay-20.html')
      }
    }
  },
  server: {
    port: 8080,
    open: true
  }
});
