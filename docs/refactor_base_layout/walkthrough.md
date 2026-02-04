# BaseLayoutへのリファクタリング - Walkthrough

サイト全体のHTML構造を統一し、重複コードを削減するために `BaseLayout` コンポーネントを導入しました。これにより `lang="ja"` の設定が全てのページで保証されます。

## 変更内容

### 1. 新しいレイアウトコンポーネント
- **`src/layouts/BaseLayout.astro`**:
    - `<html>`, `<head>`, `<body>` タグを含む共通のスケルトン。
    - `Header` と `Footer` コンポーネントを内包。
    - `lang="ja"` を設定。

### 2. 各ページ・レイアウトの更新
以下のファイルから個別のHTMLタグ宣言を削除し、`<BaseLayout>` でラップするように変更しました。
- `src/pages/index.astro`
- `src/pages/about.astro`
- `src/pages/blog/index.astro`
- `src/layouts/BlogPost.astro`

## 検証結果
- **コード削減**: 各ページファイルがシンプルになり、`<head>` 内のメタタグ設定などが一元管理されるようになりました。
- **一貫性**: `lang="en"` の混在がなくなり、`ja` に統一されました。
