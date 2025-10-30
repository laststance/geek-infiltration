import react from '@vitejs/plugin-react-swc'
import { defineConfig } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    sourcemap: true,
  },
  plugins: [react(), tsconfigPaths()],
  server: {
    host: true,
    port: 3005,
    proxy: {
      '/login/oauth/access_token': {
        changeOrigin: true,
        target: 'https://github.com',
      },
    },
  },
})
