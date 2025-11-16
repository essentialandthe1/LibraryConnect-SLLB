import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'), // <-- this makes "@/..." work
    },
  },
  server: { port: 5173 },
  build: { outDir: 'build' },
});
