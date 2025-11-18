import fs from "node:fs/promises";
import path from "node:path";
import autoprefixer from "autoprefixer";
import cssnano from "cssnano";
import sharp from "sharp";
import type { Plugin } from "vite";
import { defineConfig } from "vite";
import checker from "vite-plugin-checker";
import shopify from "vite-plugin-shopify";
import { viteStaticCopy } from "vite-plugin-static-copy";

async function waitForStaticCopy(
  dir: string,
  minFiles = 1,
  timeout = 5000,
): Promise<void> {
  const start = Date.now();
  while (true) {
    try {
      const files = await fs.readdir(dir);
      if (files.length >= minFiles) break;
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error;
    }

    if (Date.now() - start > timeout) {
      throw new Error(
        `Timed out waiting for viteStaticCopy to finish (${timeout}ms)`,
      );
    }
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
}

// Sharp最適化プラグイン
function sharpOptimizer(): Plugin {
  return {
    name: "vite-plugin-sharp-optimizer",
    async closeBundle() {
      const outDir = path.resolve(__dirname, "../shopify-theme/assets/images");

      // viteStaticCopyの完了を待つ（ポーリング監視）
      await waitForStaticCopy(outDir, 1);

      const processImage = async (filePath: string) => {
        const ext = path.extname(filePath).toLowerCase();
        if (![".jpg", ".jpeg", ".png", ".webp", ".avif"].includes(ext)) return;

        const originalSize = (await fs.stat(filePath)).size;
        const buffer = await fs.readFile(filePath);
        let optimized = sharp(buffer);

        if (ext === ".jpg" || ext === ".jpeg") {
          optimized = optimized.jpeg({ quality: 82, progressive: true });
        } else if (ext === ".png") {
          optimized = optimized.png({ quality: 80, compressionLevel: 9 });
        } else if (ext === ".webp") {
          optimized = optimized.webp({ quality: 80, effort: 5 });
        } else if (ext === ".avif") {
          optimized = optimized.avif({ quality: 75, effort: 5 });
        }

        const tempFile = `${filePath}.tmp`;
        await optimized.toFile(tempFile);
        const newSize = (await fs.stat(tempFile)).size;
        await fs.rename(tempFile, filePath);

        const reduction = ((1 - newSize / originalSize) * 100).toFixed(1);
        console.log(
          `  ${path.relative(outDir, filePath)}: ${(originalSize / 1024).toFixed(1)}KB → ${(newSize / 1024).toFixed(1)}KB (-${reduction}%)`,
        );
      };

      const walk = async (dir: string) => {
        try {
          const entries = await fs.readdir(dir, { withFileTypes: true });
          for (const entry of entries) {
            const fullPath = path.join(dir, entry.name);
            if (entry.isDirectory()) {
              await walk(fullPath);
            } else {
              await processImage(fullPath);
            }
          }
        } catch (error) {
          if ((error as NodeJS.ErrnoException).code === "ENOENT") return;
          throw error;
        }
      };

      await walk(outDir);
      console.log("✨ Images optimized with Sharp");
    },
  };
}

export default defineConfig({
  plugins: [
    shopify(),
    checker({ typescript: true }),
    viteStaticCopy({
      targets: [
        {
          src: "assets/images/**/*",
          dest: "images",
          rename: (fileName, fileExtension, fullPath) => {
            const match = fullPath.match(/assets\/images\/(.+)/);
            return match ? match[1] : fileName + fileExtension;
          },
        },
      ],
    }),
    {
      ...sharpOptimizer(),
      enforce: "post",
    },
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
