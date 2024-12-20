import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  server: {
    proxy: {
      '/api/v6': {
        target: 'https://mstanotest.daktela.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/v6/, '/api/v6'),
        secure: false,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      },
    },
  },
});