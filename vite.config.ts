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
        manifest: {
          name: '万屋チェッカー🌸',
          short_name: '万屋🌸',
          description: '万屋の在庫管理・チェッカー',
          theme_color: '#1a2a4a',
          icons: [
            {
              src: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMjAiIGhlaWdodD0iMTIwIiB2aWV3Qm94PSIwIDAgMTIwIDEyMCI+CiAgPHJlY3Qgd2lkdGg9IjEyMCIgaGVpZ2h0PSIxMjAiIHJ4PSIyNCIgZmlsbD0iIzFhMmE0YSIvPgogIDxwYXRoIGQ9Ik02MCAyMWMtNC40IDAtOCAxLjYtOCAzLjZzMy42IDMuNiA4IDMuNnM4LTEuNiA4LTMuNnMtMy42LTMuNi04LTMuNnpNMzcgMzljLTQuNCAwLTggMS42LTggMy42czMuNiAzLjYgOCAzLjZzOC0xLjYgOC0zLjZzLTMuNi0zLjYtOC0zLjZ6TTgzIDM5Yy00LjQgMC04IDEuNi04IDMuNnMzLjYgMy42IDggMy42czgtMS42IDgtMy42cy0zLjYtMy42LTgtMy42ek00MiA3NWMtNC40IDAtOCAxLjYtOCAzLjZzMy42IDMuNiA4IDMuNnM4LTEuNiA4LTMuNnMtMy42LTMuNi04LTMuNnpNNzggNzVjLTQuNCAwLTggMS42LTggMy42czMuNiAzLjYgOCAzLjZzOC0xLjYgOC0zLjZzLTMuNi0zLjYtOC0zLjZ6IiBmaWxsPSIjZDlhYTU5Ii8+CiAgPHBhdGggZD0iTTMwIDUwaDYwTTQ1IDUwdjE1TTc1IDUwdjE1TTQyIDcwIDQ4IDcwTTcyIDcwIDc4IDcwTTYwIDMwdjQwIiBzdHJva2U9IiNkOWFhNTkiIHN0cm9rZS13aWR0aD0iMiIgZmlsbD0ibm9uZSIvPgo8L3N2Zz4=',
              sizes: '120x120',
              type: 'image/svg+xml',
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
