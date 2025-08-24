import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/__tests__/setup.ts',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        '**/types/**',
        '**/*.d.ts',
        '**/*.config.*',
        '**/*.setup.*',
        '**/index.ts',
        '**/main.tsx',
        '**/vite-env.d.ts',
        '**/node_modules/**',
        '**/dist/**',
        '**/coverage/**',
        '**/*.cjs*',
      ],
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
