import react from '@vitejs/plugin-react-swc'
import tsconfigPaths from 'vite-tsconfig-paths'
import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    sourcemap: true,
  },
  plugins: [react(), tsconfigPaths()],
  server: {
    host: true,
    port: 3000,
    proxy: {
      '/login/oauth/access_token': {
        changeOrigin: true,
        target: 'https://github.com',
      },
    },
  },
})
