import { defineConfig } from 'vite';

export default defineConfig({
  base: 'https://apo-overlay.netlify.app/',
  build: {
    rollupOptions: {
      input: {
        main: 'index.html',
        auth: 'auth/auth.html',
        callback: 'auth/callback.html',
        marketplace: 'marketplace.html',
        myOverlays: 'my-overlays.html'
      }
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
