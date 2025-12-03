# Metaobjects vs Metafields 完全ガイド

Shopifyでカスタムコンテンツを扱う際の2つのアプローチを詳しく解説します。

## 📊 概要比較

### Metafields（メタフィールド）
> 既存のリソースに「おまけ」として情報を追加する

```
既存リソース + 追加情報

Product（商品）
├─ title ← 標準フィールド
├─ price ← 標準フィールド
└─ metafields ← 追加フィールド
    ├─ material（素材）
    ├─ care_instructions（ケア方法）
    └─ country_of_origin（原産国）
```

### Metaobjects（メタオブジェクト）
> 完全に新しい「独自のコンテンツタイプ」を作る

```
新規コンテンツタイプ

Staff（スタッフ）← 完全に独立した新しいタイプ
├─ name
├─ position
├─ bio
├─ photo
└─ social_links
```

---

## 🔍 詳細比較表

| 特性 | Metafields | Metaobjects |
|------|-----------|-------------|
| **何か？** | 既存リソースの拡張機能 | 新規コンテンツタイプ |
| **存在形態** | 親リソースに依存 | 完全に独立 |
| **作成場所** | 各リソースの編集画面 | 専用の管理画面 |
| **URL** | 親リソースのURL | 独自URLを持てる |
| **一覧表示** | 親リソースから取得 | `shop.metaobjects.{type}.values` |
| **個別取得** | リソース経由 | `shop.metaobjects.{type}.{handle}` |
| **リレーション** | 参照可能（弱め） | 強力なリレーション機能 |
| **バリデーション** | 基本的なもの | より高度な設定可能 |
| **検索** | 親リソースに依存 | Storefront APIで柔軟に検索可能 |
| **並び替え** | 手動管理が必要 | 定義時に設定可能 |

---

## 🎯 使い分けガイド

### Metafieldsを選ぶべき場合 ✅

#### 1. **既存リソースに情報を追加したい**

```liquid
{%- comment -%} 商品に素材情報を追加 {%- endcomment -%}
商品名: {{ product.title }}
価格: {{ product.price }}
素材: {{ product.metafields.custom.material }} ← 追加情報
```

#### 2. **少数のカスタムフィールドで十分**

```
✅ 商品に「ケア方法」を追加
✅ ページに「公開日」を追加
✅ コレクションに「バナー画像」を追加
```

#### 3. **既存のShopify構造を活用したい**

```
- 商品管理の流れをそのまま使いたい
- ページのURL構造を維持したい
- 既存のテンプレートシステムを活用したい
```

#### 4. **シンプルなカスタマイズ**

今回実装したカスタムポストのように、Pageリソース+Metafieldsで十分な場合。

---

### Metaobjectsを選ぶべき場合 ⭐️

#### 1. **Shopifyに存在しないコンテンツタイプが必要**

```
⭐️ スタッフ紹介
⭐️ FAQ
⭐️ お客様の声
⭐️ イベント情報
⭐️ ブランドストーリー
⭐️ サービス一覧
⭐️ 店舗情報
```

これらは既存のProduct/Page/Collection等では表現しにくい。

#### 2. **複雑なリレーションシップが必要**

```liquid
{%- comment -%}
スタッフ ← 担当商品（複数）
         ← 担当ブログ記事（複数）
         ← 所属部署（単一）
{%- endcomment -%}

{% assign staff = shop.metaobjects.staff.john %}
担当商品:
{% for product in staff.products.value %}
  - {{ product.title }}
{% endfor %}
```

#### 3. **専用の管理画面が欲しい**

Metaobjectsは専用の管理画面が自動生成され、チーム全体で管理しやすい。

#### 4. **柔軟なデータ構造が必要**

```json
{
  "type": "faq",
  "fields": [
    {"key": "question", "type": "single_line_text_field"},
    {"key": "answer", "type": "rich_text_field"},
    {"key": "category", "type": "single_line_text_field"},
    {"key": "related_faqs", "type": "list.metaobject_reference"},
    {"key": "related_products", "type": "list.product_reference"},
    {"key": "helpful_count", "type": "number_integer"}
  ]
}
```

---

## 💻 実装例の比較

### 例1: ブログ/記事システム

#### Metafields アプローチ（今回実装）

```liquid
{%- comment -%} Page + Metafields {%- endcomment -%}
{% assign article_page = pages['my-article'] %}

タイトル: {{ article_page.title }}
本文: {{ article_page.content }}
公開日: {{ article_page.metafields.custom.published_date }}
著者: {{ article_page.metafields.custom.author }}
カテゴリー: {{ article_page.metafields.custom.category }}
```

**メリット:**
- 既存のPage管理画面を使用
- シンプルで理解しやすい
- ページURLがそのまま使える

**デメリット:**
- Pagesの一覧から取得するのが面倒
- 複雑なフィルタリングが難しい
- リレーションが弱い

#### Metaobjects アプローチ

```liquid
{%- comment -%} Metaobjects {%- endcomment -%}
{% assign article = shop.metaobjects.blog_post['my-article'] %}

タイトル: {{ article.title }}
本文: {{ article.content }}
公開日: {{ article.published_date }}
著者: {{ article.author.value.name }} ← 著者もMetaobject
カテゴリー: {{ article.category.value.name }} ← カテゴリーもMetaobject
関連記事:
{% for related in article.related_posts.value %}
  - {{ related.title }}
{% endfor %}
```

**メリット:**
- 専用の管理画面
- 強力なリレーション機能
- 柔軟な検索・フィルタリング
- 完全なデータ独立性

**デメリット:**
- 学習コストがやや高い
- テンプレート作成が必要
- Shopify 2.0以降のみ

---

### 例2: スタッフ紹介

#### ❌ Metafields（不適切な例）

```
Pageリソースを使ってスタッフページを作る場合:

pages/staff-john-doe
pages/staff-jane-smith
pages/staff-bob-johnson

問題点:
- 「ページ」として扱うのは不自然
- スタッフ一覧の取得が困難
- フィルタリング（部署別など）が難しい
- スタッフ同士の関係性を表現できない
```

#### ✅ Metaobjects（適切な例）

```liquid
{%- comment -%} Metaobjectsで実装 {%- endcomment -%}

{% assign all_staff = shop.metaobjects.staff.values %}

{%- comment -%} 部署でフィルタリング {%- endcomment -%}
{% assign sales_team = all_staff | where: 'department', '営業部' %}

{% for staff in sales_team %}
  名前: {{ staff.name }}
  役職: {{ staff.position }}
  上司: {{ staff.manager.value.name }}
  担当商品:
  {% for product in staff.products.value %}
    - {{ product.title }}
  {% endfor %}
{% endfor %}
```

---

## 🔄 移行のタイミング

### Metafields → Metaobjects に移行すべきサイン

以下のような状況になったら、Metaobjectsへの移行を検討すべき：

```
⚠️ Metafieldsが10個以上になった
⚠️ リソース間の関連性が複雑になってきた
⚠️ カスタムフィルタリングが必要になった
⚠️ 「これはPageじゃないよな...」と感じ始めた
⚠️ 専用の管理画面が欲しくなった
```

---

## 📝 実装手順

### Metafields の設定手順

#### 1. Shopify管理画面で設定

```
設定 > カスタムデータ > [リソースタイプ] > メタフィールドを追加
```

#### 2. 定義を作成

```
Namespace: custom
Key: published_date
Type: Date
```

#### 3. Liquidで使用

```liquid
{{ page.metafields.custom.published_date }}
```

---

### Metaobjects の設定手順

#### 1. Shopify管理画面で定義を作成

```
設定 > カスタムデータ > Metaobjects > 定義を追加
```

#### 2. スキーマを設計

```
名前: Staff
タイプ: staff

フィールド:
- name (Single line text)
- position (Single line text)
- bio (Multi-line text)
- photo (File reference)
- products (List of product references)
```

#### 3. エントリーを作成

```
コンテンツ > Metaobjects > Staff > エントリーを追加
```

#### 4. Liquidで使用

```liquid
{% assign staff = shop.metaobjects.staff.john_doe %}
{{ staff.name }}
```

---

## 🎓 Storefront API での使用

### Metafields の取得

```graphql
query GetProductWithMetafields {
  product(handle: "my-product") {
    title
    metafield(namespace: "custom", key: "material") {
      value
    }
  }
}
```

### Metaobjects の取得

```graphql
query GetStaff {
  metaobjects(type: "staff", first: 10) {
    edges {
      node {
        handle
        fields {
          key
          value
        }
      }
    }
  }
}
```

---

## ⚡️ パフォーマンス比較

### ページ速度への影響

| 項目 | Metafields | Metaobjects |
|------|-----------|-------------|
| **読み込み速度** | 速い（リソースと一緒に取得） | やや遅い（別途取得） |
| **キャッシュ** | リソースと同じ | 独立したキャッシュ |
| **API呼び出し** | リソースに含まれる | 追加の呼び出しが必要な場合も |

**最適化のヒント:**
- Metaobjectsを使う場合は、必要な数だけ取得
- Lazy loadingを活用
- Storefront APIでGraphQLクエリを最適化

---

## 🎯 結論: どちらを選ぶべきか？

### 簡単な決定フローチャート

```
既存のShopifyリソース（Product/Page/Collection）で
表現できるか？
  ├─ YES → Metafields を使う
  │         （今回のカスタムポストなど）
  │
  └─ NO → Shopifyに存在しないコンテンツタイプか？
            ├─ YES → Metaobjects を使う
            │         （スタッフ、FAQ、イベントなど）
            │
            └─ 迷う → まずMetafieldsで始めて、
                      必要になったらMetaobjectsへ移行
```

### ハイブリッドアプローチ

**両方を組み合わせることも可能！**

```liquid
{%- comment -%}
商品（Product） + Metafields
  ↓ リレーション
スタッフ（Metaobject）
{%- endcomment -%}

{% assign product = all_products['my-product'] %}
{% assign designer = product.metafields.custom.designer.value %}

商品: {{ product.title }}
デザイナー: {{ designer.name }}
デザイナーの所属: {{ designer.department }}
```

---

## 📚 参考リソース

- [Shopify Metafields Documentation](https://shopify.dev/docs/apps/custom-data/metafields)
- [Shopify Metaobjects Documentation](https://shopify.dev/docs/apps/custom-data/metaobjects)
- [Metaobjects Storefront API](https://shopify.dev/docs/api/storefront/2024-01/objects/Metaobject)

---

**SUBMONTANE STUDIO** - より良いShopify開発のために
