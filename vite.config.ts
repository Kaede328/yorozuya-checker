import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig, loadEnv} from 'vite';
import {viteSingleFile} from 'vite-plugin-singlefile';
import {VitePWA} from 'vite-plugin-pwa';

export default defineConfig(({mode}) => {
  const env = loadEnv(mode, '.', '');
  return {
    base: '/yorozuya-checker/',
    plugins: [
      react(),
      tailwindcss(),
      viteSingleFile(),
      VitePWA({
        registerType: 'autoUpdate',
        includeAssets: ['icon.jpg'],
        manifest: {
          name: '万屋チェッカー🌸',
          short_name: '万屋🌸',
          description: '万屋の在庫管理・チェッカー',
          theme_color: '#1a2a4a',
          background_color: '#1a2a4a',
          display: 'standalone',
          orientation: 'portrait',
          icons: [
            {
              src: './icon.jpg',
              sizes: '120x120 180x180 192x192 512x512',
              type: 'image/jpeg',
              purpose: 'any maskable',
            },
          ],
        },
      }),
    ],
    build: {
      outDir: 'dist',
      assetsDir: 'assets',
      emptyOutDir: true,
    },
    define: {
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      hmr: process.env.DISABLE_HMR !== 'true',
    },
  };
});
