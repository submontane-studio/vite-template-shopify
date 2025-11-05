import { defineConfig } from 'vite';
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer';
import shopify from 'vite-plugin-shopify';
// @ts-ignore @vituum/vite-plugin-liquidの型定義が存在しない
import liquid from '@vituum/vite-plugin-liquid';
import autoprefixer from 'autoprefixer';
import cssnano from 'cssnano';
import checker from 'vite-plugin-checker';

export default defineConfig({
  plugins: [
    shopify(),
    liquid(),
    checker({ typescript: true }),
    ViteImageOptimizer({
      jpg: { quality: 82, progressive: true },
      png: { quality: 80, compressionLevel: 9 },
      webp: { quality: 80, effort: 5 },
      avif: { quality: 75, effort: 5 },
    })
  ],
  root: './src',
  build: {
    outDir: '../shopify-theme/assets',
    emptyOutDir: false,
    rollupOptions: {
      input: ['./src/main.ts', './src/main.scss']
    },
  },
  css: {
    devSourcemap: true,
    postcss: {
      plugins: [
        autoprefixer(),
        cssnano({
          preset: 'default',
        })
      ]
    },
  },
});