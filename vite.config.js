import { defineConfig } from 'vite'

export default defineConfig({
  server: {
    port: 3000
  },
  build: {
    rollupOptions: {
      input: {
        main: './index.html',
        overlay: './overlay.html'
      }
    }
  }
})