# Design: Aboutページ更新 & スクロールプログレス全ページ対応

Date: 2026-02-20

## 概要

1. Aboutページの職歴タイトルを Manager → Engineer に変更
2. スクロールプログレスバーをブログ記事だけでなく全ページに適用

## 変更内容

### 1. Aboutページ テキスト変更 (`src/pages/about.astro`)

- イントロ文: `Frontend Development Managerを務めています` → `Web系エンジニアとして勤務しています`
- 職歴セクションの `<h3>`: `Frontend Development Manager` → `Frontend Engineer`

### 2. ReadingProgress JS更新 (`src/components/ReadingProgress.astro`)

現在の実装はブログ記事の `<article>` 要素を基準にスクロール追跡しているが、
全ページ対応のためドキュメントスクロールに変更する。

```js
// Before (article-based)
const article = document.querySelector('article');
if (!article) return;
// ... article rect based calculation

// After (document-based)
const progress = Math.min(
  (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100,
  100
);
```

### 3. BaseLayout更新 (`src/layouts/BaseLayout.astro`)

- `ReadingProgress` コンポーネントをimportして `<body>` 内に追加

### 4. BlogPost更新 (`src/layouts/BlogPost.astro`)

- `ReadingProgress` のimportと `<ReadingProgress />` 呼び出しを削除（BaseLayoutで対応するため）

## 影響範囲

- 全ページでスクロールプログレスバーが表示される
- ビジュアル: 変更なし（同じ3px高さの固定バー at top）
- アクセシビリティ: `aria-valuenow` / `aria-valuemin` / `aria-valuemax` は維持
- `prefers-reduced-motion` 対応: 維持
- View Transitions (astro:page-load, astro:before-swap) 対応: 維持
