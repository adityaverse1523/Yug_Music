import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  preview: {
    port: 3001,
    host: true,
    allowedHosts: true,
  },
  server: {
    port: 3001,
    host: true,
    allowedHosts: true,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@yug/shared': path.resolve(__dirname, '../../packages/shared/src'),
    },
  },
});

