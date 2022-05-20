import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    sourcemap: true,
  },
  plugins: [react()],
  server: {
    host: true,
    open: true,
    proxy: {
      '/login/oauth/access_token': {
        changeOrigin: true,
        target: 'https://github.com',
      },
    },
  },
})
