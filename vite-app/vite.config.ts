import fs from "node:fs/promises";
import path from "node:path";
import autoprefixer from "autoprefixer";
import cssnano from "cssnano";
import { defineConfig } from "vite";
import checker from "vite-plugin-checker";
import shopify from "vite-plugin-shopify";
import { imageOptimizer } from "vite-plugin-image-optimizer";

export default defineConfig({
  plugins: [
    shopify(),
    checker({ typescript: true }),
    imageOptimizer({
      patterns: [
        {
          from: "./src/assets/images/**/*",
          to: "images"
        }
      ],
      outDir: "../shopify-theme/assets",  // アセットの出力場所
      quality: {
        jpeg: 82,
        png: 80,
        webp: 80,
        avif: 70,
      },
      generateWebp: true,
      generateAvif: true,
    }),
  ],
  root: "./src",
  build: {
    outDir: "../../shopify-theme/assets",
    emptyOutDir: false,
    rollupOptions: {
      input: {
        main: "./src/assets/scripts/main.ts",
        style: "./src/assets/styles/main.scss",
      },
      output: {
        entryFileNames: "[name].js",
        chunkFileNames: "[name].js",
        assetFileNames: "[name].[ext]",
      },
    },
  },
  css: {
    devSourcemap: true,
    postcss: {
      plugins: [
        autoprefixer(),
        cssnano({
          preset: "default",
        }),
      ],
    },
  },
});
