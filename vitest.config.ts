import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'happy-dom',
    setupFiles: ['./tests/setup.ts'],
    watch: false,
    silent: false,
    onConsoleLog: (log) => {
      // Silence React act() warnings
      if (log.includes('wrapped in act(...)')) return false;
      // Silence CJS deprecation warning
      if (log.includes('CJS build of Vite')) return false;
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
