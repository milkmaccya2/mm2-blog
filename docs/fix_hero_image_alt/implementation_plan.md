# 実装計画: Hero画像のalt属性設定

## 変更内容
1. **記事詳細ページ (`src/layouts/BlogPost.astro`)**
   - `<Image />` コンポーネントの `alt` 属性を `alt=""` から `alt={title}` に変更する。

2. **ブログ一覧ページ (`src/pages/blog/index.astro`)**
    - `<Image />` コンポーネントの `alt` 属性を `alt=""` から `alt={post.data.title}` に変更する。

## 検証手順
- コードレビューにより、`alt` 属性が正しく設定されていることを確認する。
- 可能であれば、ブラウザ開発者ツールで要素を検査し、`alt` 属性が出力されていることを確認する。
