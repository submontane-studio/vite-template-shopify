# SUBMONTANE STUDIO – Shopify + Vite 開発環境テンプレート

高速・軽量・安全なShopifyテーマ開発のためのテンプレート構成です。  
Viteをベースに、最新のフロントエンド構成（Autoprefixer / cssnano / Sharp / Biome）を統合しています。

---

## 🚀 Features

| 機能 | 使用技術 | 説明 |
|------|------------|------|
| ⚡️ フロントビルド | [Vite](https://vitejs.dev/) | 超高速なHMR + ビルド環境 |
| 💄 CSS自動整形 | Autoprefixer + cssnano | ベンダープレフィックス付与 & 自動圧縮 |
| 🧠 型チェック | [vite-plugin-checker](https://github.com/fi3ework/vite-plugin-checker) | TypeScriptの静的解析 |
| 🖼 画像最適化 | [vite-plugin-image-optimizer](https://github.com/FatehAK/vite-plugin-image-optimizer) (Sharpベース) | JPEG / PNG / WebP / AVIF 自動軽量化 |
| 💧 Liquid構文対応 | [@vituum/vite-plugin-liquid](https://github.com/vituum/vite-plugin-liquid) | ShopifyテンプレートのLiquid構文を安全に処理 |
| 🧹 コード品質維持 | [Biome](https://biomejs.dev/) | Lint & Format統合 |
| 🔄 Shopify接続 | [Shopify CLI](https://shopify.dev/docs/themes/tools/cli) | テーマの開発・プレビュー・デプロイを自動化 |

---

## 📂 ディレクトリ構成

```plaintext
SUBMONTANE STUDIO/
├── vite-app/                 # Viteフロントエンド環境
│   ├── src/                  # TS, SCSS, 画像ファイルなど
│   ├── vite.config.ts        # Vite設定（Shopify連携）
│   ├── package.json          # スクリプト・依存関係
│   ├── tsconfig.json         # TypeScript設定
│   └── biome.json            # Linter設定
│
└── shopify-theme/            # 出力先のShopifyテーマ
    ├── assets/               # Viteがビルド出力を格納
    ├── config/
    ├── layout/
    ├── sections/
    ├── snippets/
    └── templates/
```
---

## ⚙️ セットアップ手順

```bash
# 1. 依存パッケージをインストール
bun install
# or
npm install

# 2. ローカル開発開始
npm run dev

# 3. 本番ビルド & ShopifyにPush
npm run build


⸻

🧩 主なスクリプト

コマンド	説明
npm run dev	Viteの監視ビルド + Shopifyローカルプレビュー同時起動
npm run build	Lint → 本番ビルド → テーマをShopifyへpush
npm run lint	Biomeで構文チェック
npm run fix	Biomeで自動整形


⸻

🧠 設計ポリシー
	•	「Shopifyテーマ開発を最速・最小構成で」
	•	すべての依存をvite.config.tsで完結
	•	PostCSSやWebpackなどの外部ビルド不要
	•	Biomeによる統一フォーマットでチーム開発にも対応

⸻

🧰 推奨環境
	•	Node.js ≥ 20 / Bun ≥ 1.0
	•	Shopify CLI v3 以上
	•	VSCode + Biome 拡張機能
	•	macOS / Linux（Windowsでも動作確認済）

⸻

🪶 作者メモ

SUBMONTANE STUDIO は、
「Shopifyのテーマ開発を近代化するための最小構成」を目指して設計されています。

クリーンなCSS、軽量な画像、堅牢な型チェックを自動で処理する環境です。

→ クリーン・スマート・スピーディー。

⸻

📜 License

MIT © SUBMONTANE STUDIO