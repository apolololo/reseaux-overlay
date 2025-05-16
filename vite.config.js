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
        overlay: resolve(__dirname, 'overlay.html'),
      },
    },
    assetsDir: 'assets',
    outDir: 'dist',
    emptyOutDir: true,
    copyPublicDir: true
  },
  server: {
    port: 8080,
    open: '/index.html',
    proxy: {
      '/src': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/src/, '')
      }
    }
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  }
});
