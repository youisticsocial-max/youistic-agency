import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  publicDir: 'Public',
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        development: resolve(__dirname, 'development.html'),
        solutions: resolve(__dirname, 'solutions.html'),
        growth: resolve(__dirname, 'growth.html'),
        contact: resolve(__dirname, 'contact.html'),
        start: resolve(__dirname, 'start.html'),
        admin: resolve(__dirname, 'admin.html')
      }
    }
  }
});

