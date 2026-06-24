import { defineConfig } from 'vitest/config'

export default defineConfig({
  resolve: {
    tsconfigPaths: true,
  },
  test: {
    environment: 'jsdom',
    globals: true,
    exclude: ['tests/**', 'node_modules/**'],
    setupFiles: ['./vitest.setup.ts'],
  },
})
