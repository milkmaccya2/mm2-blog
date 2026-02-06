# 実装計画：構造化データの導入

## 1. 目的
Googleなどの検索エンジンがサイトの内容をより正確に理解できるようにし、リッチリザルト（記事の公開日や画像が検索結果に表示されるなど）への対応を行う。

## 2. 導入する構造化データ
- **WebSite**: サイト全体の情報。主にトップページで適用。
- **BlogPosting**: ブログ記事の詳細情報。各記事ページで適用。

## 3. 変更内容

### 3.1 新規コンポーネントの作成
- `src/components/StructuredData.astro`: 受け取ったオブジェクトを `<script type="application/ld+json">` として出力するシンプルなコンポーネント。

### 3.2 既存ファイルの修正
- `src/components/BaseHead.astro`:
  - `structuredData` プロパティを追加。
  - `StructuredData` コンポーネントを呼び出す。
- `src/layouts/BaseLayout.astro`:
  - `structuredData` プロパティを受け取り、`BaseHead` に渡す。
- `src/layouts/BlogPost.astro`:
  - 記事データから `BlogPosting` オブジェクトを生成し、`BaseLayout` に渡す。
- `src/pages/index.astro`:
  - サイト情報から `WebSite` オブジェクトを生成し、`BaseLayout` に渡す。

## 4. 完了条件
- 各ページに正しいJSON-LDが出力されていること。
- ビルドエラーが発生しないこと。
