import react from '@vitejs/plugin-react';
// import { checker } from 'vite-plugin-checker';
import readableClassnames from 'vite-plugin-readable-classnames';
import sassDts from 'vite-plugin-sass-dts';
import tsconfigPaths from 'vite-tsconfig-paths';
import { defineConfig } from 'vitest/config';
import path from 'node:path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    readableClassnames(),
    sassDts({
      enabledMode: ['development'],
      esmExport: true,
    }),
    tsconfigPaths(),
  ],
  resolve: {
    alias: {
      '@':          path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
      '@hooks':     path.resolve(__dirname, './src/hooks'),
      '@services':  path.resolve(__dirname, './src/services'),
      '@utils':     path.resolve(__dirname, './src/utils'),
    },
  },
  base: '/burger-praktikum/',
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./vitest-setup.js'],
    include: ['src/**/*.test.{ts,tsx}'],
  },
  server: {
    open: true,
  },
});
