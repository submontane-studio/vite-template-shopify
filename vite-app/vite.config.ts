import path from "node:path";
import autoprefixer from "autoprefixer";
import cssnano from "cssnano";
import glob from "fast-glob";
import { defineConfig } from "vite";
import checker from "vite-plugin-checker";
import { ViteImageOptimizer } from "vite-plugin-image-optimizer";
import shopify from "vite-plugin-shopify";

// 画像のルートディレクトリ
const imageDir = path.resolve(__dirname, "src/assets/images");

// 画像ファイルを全探索して、inputに渡す
const imageFiles = glob
  .sync(`${imageDir}/**/*.{png,jpg,jpeg,webp,avif}`)
  .map((file) => path.resolve(file))
  .filter((file) => file.startsWith(imageDir));

// ファイルパスをキーにしてマップを作成（後でassetFileNamesで使用）
const imagePathMap = new Map(
  imageFiles.map((file) => {
    const relativePath = path.relative(imageDir, file).replace(/\\/g, "/");
    return [path.basename(file), relativePath];
  }),
);

const imageInputEntries = Object.fromEntries(
  imageFiles.map((file, i) => [`image_${i}`, file]),
);

const rollupInput = {
  main: "./src/main.ts",
  style: "./src/main.scss",
  ...imageInputEntries,
};

export default defineConfig({
  plugins: [
    shopify(),
    checker({ typescript: true }),
    ViteImageOptimizer({
      include: /\.(jpg|jpeg|png|webp|avif)$/i,
      jpg: { quality: 82, progressive: true },
      png: { quality: 80, compressionLevel: 9 },
      webp: { quality: 80, effort: 5 },
      avif: { quality: 75, effort: 5 },
    }),
  ],
  root: "./src",
  build: {
    outDir: "../../shopify-theme/assets",
    emptyOutDir: false,
    rollupOptions: {
      input: rollupInput,
      output: {
        assetFileNames: (info) => {
          // 画像ファイルの場合はディレクトリ構造を維持
          if (info.name && /\.(jpg|jpeg|png|webp|avif|svg)$/i.test(info.name)) {
            const relativePath = imagePathMap.get(info.name);
            if (relativePath) {
              // 拡張子を除去してハッシュを挿入
              const pathWithoutExt = relativePath.replace(/\.[^/.]+$/, "");
              return `images/${pathWithoutExt}.[hash][extname]`;
            }
          }

          // その他のアセット（CSS等）はデフォルト
          return "[name].[hash][extname]";
        },
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
