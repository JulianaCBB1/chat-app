import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/stream': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
    },
  },
});
