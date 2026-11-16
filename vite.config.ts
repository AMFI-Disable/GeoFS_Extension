import { defineConfig } from 'vite';
import preact from '@preact/preset-vite';
import { resolve } from 'path';

const surface = process.env.VITE_SURFACE || 'popup';

export default defineConfig({
  plugins: [preact()],
  root: resolve(__dirname, 'src', surface),
  base: './',
  build: {
    outDir: resolve(__dirname, 'dist', surface),
    emptyOutDir: true,
    rollupOptions: {
      input: resolve(__dirname, 'src', surface, 'index.html')
    }
  }
});
