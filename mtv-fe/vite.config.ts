import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'
import svgr from 'vite-plugin-svgr';
import json from '@rollup/plugin-json';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),
    json(),
    tailwindcss(), 
    svgr({
      svgrOptions: {
        icon: true,
      },
    }) 
  ],
  resolve: {
    alias: {
      '@': '/src',
    },
  },
  assetsInclude: ['**/*.svg'],
})
