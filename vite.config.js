import { defineConfig } from 'vite';

export default defineConfig({
  base: '/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    rollupOptions: {
      input: {
        main: 'index.html',
        editor: 'editor.html',
        overlay: 'overlay.html',
        myOverlays: 'my-overlays.html',
        marketplace: 'marketplace.html',
        auth: 'auth/auth.html',
        callback: 'auth/callback.html'
      }
    }
  },
  server: {
    port: 3000,
    open: true
  }
});
