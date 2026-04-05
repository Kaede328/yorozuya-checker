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
              src: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMjAiIGhlaWdodD0iMTIwIiB2aWV3Qm94PSIwIDAgMTIwIDEyMCI+CiAgPHJlY3Qgd2lkdGg9IjEyMCIgaGVpZ2h0PSIxMjAiIHJ4PSIyNCIgZmlsbD0iIzFhMmE0YSIvPgogIDxwYXRoIGQ9Ik02MCAyMGMtNSAwLTEwIDUtMTAgMTBzNSAxMCAxMCAxMCAxMC01IDEwLTEwLTUtMTAtMTAtMTB6TTQwIDQwYy01IDAtMTAgNS0xMCAxMHM1IDEwIDEwIDEwIDEwLTUgMTAtMTAtNS0xMC0xMC0xMHpNODAgNDBjLTUgMC0xMCA1LTEwIDEwczUgMTAgMTAgMTAgMTAtNSAxMC0xMC01LTEwLTAtMTB6TTUwIDcwYy01IDAtMTAgNS0xMCAxMHM1IDEwIDEwIDEwIDEwLTUgMTAtMTAtNS0xMC0xMC0xMHpNNzAgNzBjLTUgMC0xMCA1LTEwIDEwczUgMTAgMTAgMTAgMTAtNSAxMC0xMC01LTEwLTAtMTB6IiBmaWxsPSIjZDlhYTU5Ii8+CiAgPHBhdGggZD0iTTMwIDUwaDYwTTQ1IDUwdjE1TTc1IDUwdjE1TTQ1IDY1bC01IDVoMTBNNzUgNjVsLTUgNWgxME02MCAzNXYzNSIgc3Ryb2tlPSIjZDlhYTU5IiBzdHJva2Utd2lkdGg9IjIiIGZpbGw9Im5vbmUiLz4KPC9zdmc+',
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
