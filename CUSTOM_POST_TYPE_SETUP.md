# Shopify カスタムポストタイプ セットアップガイド

このガイドでは、WordPressのカスタムポストタイプのような機能をShopifyで実現する方法を説明します。

## 📋 概要

Shopifyには「ページ（Pages）」リソースがあり、これにMetafields（カスタムフィールド）を追加することで、カスタムポストタイプのような柔軟なコンテンツ管理が可能になります。

## 🎯 このテンプレートで実装した機能

- ✅ カスタムポスト個別ページ（`templates/page.custom-post.json`）
- ✅ カスタムポスト一覧ページ（`templates/page.custom-posts-archive.json`）
- ✅ アイキャッチ画像、公開日、カテゴリー、著者、タグなどのカスタムフィールド
- ✅ 関連記事の表示機能
- ✅ カテゴリーフィルター機能

## 🔧 セットアップ手順

### ステップ1: Metafieldsの定義

Shopify管理画面で以下のMetafieldsを定義します。

#### 1.1 管理画面へアクセス

```
Shopify管理画面 > 設定 > カスタムデータ > Pages
```

#### 1.2 以下のMetafieldsを追加

| Namespace.Key | Type | Description |
|---------------|------|-------------|
| `custom.published_date` | Date | 公開日 |
| `custom.category` | Single line text | カテゴリー |
| `custom.featured_image` | File reference | アイキャッチ画像 |
| `custom.author` | Single line text | 著者名 |
| `custom.tags` | Single line text | タグ（カンマ区切り） |
| `custom.related_posts` | List of page references | 関連記事 |

#### 1.3 JSON定義（API経由で設定する場合）

```json
{
  "metafield_definitions": [
    {
      "namespace": "custom",
      "key": "published_date",
      "name": "公開日",
      "type": "date",
      "owner_type": "PAGE"
    },
    {
      "namespace": "custom",
      "key": "category",
      "name": "カテゴリー",
      "type": "single_line_text_field",
      "owner_type": "PAGE"
    },
    {
      "namespace": "custom",
      "key": "featured_image",
      "name": "アイキャッチ画像",
      "type": "file_reference",
      "owner_type": "PAGE"
    },
    {
      "namespace": "custom",
      "key": "author",
      "name": "著者",
      "type": "single_line_text_field",
      "owner_type": "PAGE"
    },
    {
      "namespace": "custom",
      "key": "tags",
      "name": "タグ",
      "description": "カンマ区切りで入力してください",
      "type": "single_line_text_field",
      "owner_type": "PAGE"
    },
    {
      "namespace": "custom",
      "key": "related_posts",
      "name": "関連記事",
      "type": "list.page_reference",
      "owner_type": "PAGE"
    }
  ]
}
```

### ステップ2: カスタムポストページの作成

#### 2.1 新規ページ作成

```
Shopify管理画面 > コンテンツ > ページ > ページを追加
```

#### 2.2 ページ情報を入力

- **タイトル**: 記事のタイトル
- **コンテンツ**: 本文（リッチテキストエディタ）
- **テンプレート**: `page.custom-post` を選択

#### 2.3 Metafieldsに値を入力

ページ編集画面の下部に表示される「Metafields」セクションで、以下の値を入力します：

- 公開日: 日付を選択
- カテゴリー: 例）ニュース、ブログ、チュートリアル
- アイキャッチ画像: 画像をアップロード
- 著者: 著者名を入力
- タグ: 例）Shopify, カスタマイズ, 開発
- 関連記事: 他のページを選択

### ステップ3: アーカイブページの作成

#### 3.1 新規ページ作成

```
Shopify管理画面 > コンテンツ > ページ > ページを追加
```

#### 3.2 設定

- **タイトル**: 「記事一覧」など
- **ハンドル**: `custom-posts` など（URLに使用されます）
- **テンプレート**: `page.custom-posts-archive` を選択

#### 3.3 セクション設定

テーマエディタで以下の設定が可能です：

- アーカイブタイトル
- 説明文
- 表示する記事数
- カテゴリーフィルターの有効/無効
- カテゴリーリスト（カンマ区切り）

## 🎨 カスタマイズ方法

### スタイルのカスタマイズ

各セクションファイル内の`<style>`タグ内のCSSを編集してください：

- `sections/custom-post.liquid` - 個別記事ページのスタイル
- `sections/custom-posts-archive.liquid` - 一覧ページのスタイル

### レイアウトの変更

Liquidテンプレートを直接編集することで、表示内容や順序を変更できます。

## 🚀 より高度な実装方法

### 方法1: Metaobjects（Shopify 2.0以降）

Shopifyの最新機能「Metaobjects」を使用すると、より柔軟なカスタムコンテンツタイプを作成できます。

#### 利点
- 完全にカスタマイズ可能なスキーマ
- Storefront APIでアクセス可能
- リレーションシップ設定が容易
- バリデーション機能

#### 設定方法

```
Shopify管理画面 > 設定 > カスタムデータ > Metaobjects > 定義を追加
```

例: 「Blog Post」という定義を作成

```json
{
  "name": "Blog Post",
  "type": "blog_post",
  "fields": [
    {
      "name": "タイトル",
      "key": "title",
      "type": "single_line_text_field",
      "required": true
    },
    {
      "name": "本文",
      "key": "content",
      "type": "rich_text_field"
    },
    {
      "name": "アイキャッチ画像",
      "key": "featured_image",
      "type": "file_reference"
    },
    {
      "name": "公開日",
      "key": "published_date",
      "type": "date"
    },
    {
      "name": "カテゴリー",
      "key": "category",
      "type": "single_line_text_field"
    }
  ]
}
```

### 方法2: Shopify App + App Proxy

より高度な機能が必要な場合は、カスタムアプリを作成してApp Proxyを使用します。

#### 利点
- 完全なデータベース制御
- 高度なクエリとフィルタリング
- カスタムAPIエンドポイント
- 複雑なビジネスロジックの実装

#### 実装例

```javascript
// Shopify App (Node.js + Express)
app.get('/apps/custom-posts', async (req, res) => {
  const { category, limit, page } = req.query;

  // データベースからカスタムポストを取得
  const posts = await CustomPost.find({ category })
    .limit(limit)
    .skip((page - 1) * limit);

  res.json({ posts });
});
```

### 方法3: Storefront API + Headless

フロントエンドを完全にカスタマイズする場合は、Storefront APIを使用します。

#### GraphQLクエリ例

```graphql
query GetCustomPosts {
  pages(first: 10, query: "template_suffix:custom-post") {
    edges {
      node {
        id
        title
        handle
        content
        metafields(identifiers: [
          {namespace: "custom", key: "published_date"},
          {namespace: "custom", key: "category"},
          {namespace: "custom", key: "featured_image"}
        ]) {
          key
          value
          type
        }
      }
    }
  }
}
```

## 📚 追加のMetafieldsアイデア

用途に応じて、以下のMetafieldsを追加できます：

### ブログ/記事系
- `custom.excerpt` (multi_line_text_field) - 要約文
- `custom.read_time` (number_integer) - 読了時間（分）
- `custom.seo_title` (single_line_text_field) - SEOタイトル
- `custom.seo_description` (multi_line_text_field) - SEOディスクリプション

### イベント系
- `custom.event_date` (date_time) - イベント日時
- `custom.location` (single_line_text_field) - 場所
- `custom.price` (money) - 価格
- `custom.capacity` (number_integer) - 定員

### チーム/スタッフ系
- `custom.position` (single_line_text_field) - 役職
- `custom.bio` (multi_line_text_field) - 経歴
- `custom.social_links` (json) - SNSリンク
- `custom.profile_image` (file_reference) - プロフィール画像

### ポートフォリオ系
- `custom.project_date` (date) - プロジェクト日付
- `custom.client` (single_line_text_field) - クライアント名
- `custom.technologies` (list.single_line_text_field) - 使用技術
- `custom.gallery` (list.file_reference) - ギャラリー画像

## 🔍 トラブルシューティング

### Metafieldsが表示されない

1. Metafield定義が正しく作成されているか確認
2. Namespace.Keyが正確に一致しているか確認
3. テーマのコードでMetafieldsを正しく参照しているか確認

```liquid
{%- comment -%} 正しい参照方法 {%- endcomment -%}
{{ page.metafields.custom.published_date }}

{%- comment -%} 間違った参照方法 {%- endcomment -%}
{{ page.metafields.published_date }}  ❌ namespaceが欠けている
```

### テンプレートが選択できない

1. テンプレートファイルが正しい場所にあるか確認
   - `templates/page.custom-post.json`
2. ファイル名が正しいか確認（`page.`で始まる必要があります）
3. JSON構文が正しいか確認

### カテゴリーフィルターが動作しない

1. JavaScriptが読み込まれているか確認
2. コンソールにエラーが出ていないか確認
3. `data-category`属性が正しく設定されているか確認

## 💡 ベストプラクティス

### 1. Metafieldsの命名規則

- namespace: `custom` または独自の名前（例: `blog`, `portfolio`）
- key: スネークケース（例: `published_date`, `featured_image`）

### 2. パフォーマンス最適化

- 画像は適切なサイズで配信（`image_url`フィルターを使用）
- Lazy loadingを使用
- 一覧ページの表示件数を制限

### 3. SEO対策

- 各記事に適切な`<title>`と`<meta description>`を設定
- 構造化データ（JSON-LD）を追加
- サイトマップに含める

## 🎓 参考資料

- [Shopify Metafields Documentation](https://shopify.dev/docs/apps/custom-data/metafields)
- [Shopify Metaobjects Documentation](https://shopify.dev/docs/apps/custom-data/metaobjects)
- [Liquid Reference](https://shopify.dev/docs/api/liquid)
- [Storefront API](https://shopify.dev/docs/api/storefront)

## 🤝 サポート

質問や問題がある場合は、GitHubのIssuesセクションでお知らせください。

---

**SUBMONTANE STUDIO** - Shopify開発をよりスマートに。
