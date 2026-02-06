# 修正内容の確認：構造化データの導入

## 実施内容
JSON-LD形式の構造化データを導入し、検索エンジンがサイトの情報をより詳細に把握できるようにしました。

### 1. 新規コンポーネントの導入
- `src/components/StructuredData.astro`: JSONオブジェクトを受け取り、`<script type="application/ld+json">` として出力する汎用コンポーネント。

### 2. 既存レイアウトの拡張
- `src/components/BaseHead.astro`: `structuredData` プロパティを受け取れるように拡張。
- `src/layouts/BaseLayout.astro`: 上位レイアウトから `BaseHead` へ構造化データをリレー。

### 3. 各ページへの適用
- **トップページ (`src/pages/index.astro`)**:
  - `WebSite` 型の構造化データを導入。
  - サイト名、説明、URLを出力。
- **ブログ記事ページ (`src/layouts/BlogPost.astro`)**:
  - `BlogPosting` 型の構造化データを導入。
  - 記事タイトル、説明、公開日、更新日、ヒーロー画像、著者情報（Person）を出力。

## 確認方法
- `npm run build` によるビルド成功を確認。
- `dist/index.html` に `WebSite` のJSON-LDが含まれていることを確認。
- `dist/blog/weekly/2025-12-01/index.html` に `BlogPosting` のJSON-LD（画像URLや公開日含む）が含まれていることを確認。
