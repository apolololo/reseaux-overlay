import { defineConfig } from 'vite';

export default defineConfig({
  base: '/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    rollupOptions: {
      input: {
        main: 'index.html',
        social: 'overlays/social.html',
        starting: 'overlays/starting.html',
        brb: 'overlays/brb.html',
        end: 'overlays/end.html',
        followers: 'overlays/followers.html',
        game: 'overlays/game.html'
      }
    }
  },
  server: {
    port: 3000,
    host: true
  }
});