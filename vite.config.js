
import { defineConfig } from 'vite';

export default defineConfig(async ({ mode }) => {
  const plugins = [];
  
  if (mode === 'development') {
    const { componentTagger } = await import("lovable-tagger");
    plugins.push(componentTagger());
  }

  return {
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
          callback: 'auth/callback.html',
          brbOverlay: 'src/overlays/brb/overlay.html',
          endOverlay: 'src/overlays/end/overlay.html',
          startingOverlay: 'src/overlays/starting/overlay.html',
          gameStatusOverlay: 'src/overlays/game-status/overlay.html'
        }
      }
    },
    server: {
      host: "::",
      port: 8080,
      open: true
    },
    plugins
  };
});
