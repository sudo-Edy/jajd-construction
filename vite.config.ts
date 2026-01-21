import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd(), '');
    return {
      server: {
        port: 3000,
        host: 'localhost',
        proxy: {
          '/api': {
            target: 'http://localhost:5001',
            changeOrigin: true,
            rewrite: (path) => {
              // /api/lead -> /api/lead
              return path;
            }
          }
        }
      },
      plugins: [react()],
      define: {
        'process.env.VITE_API_URL': JSON.stringify(env.VITE_API_URL || 'http://localhost:5001'),
        'process.env.VITE_GEMINI_API_KEY': JSON.stringify(env.VITE_GEMINI_API_KEY || ''),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.VITE_GEMINI_API_KEY || '')
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});
