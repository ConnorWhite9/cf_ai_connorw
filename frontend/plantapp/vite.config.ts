import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),
    tailwindcss(),
  ],
  server: {
    host: true, // optional, allows LAN access
    port: 5173,
    proxy: {
      // All requests starting with /api go to your Worker
      "/api": {
        target: "http://127.0.0.1:8787",
        changeOrigin: true,
      },
    },
  }

})
