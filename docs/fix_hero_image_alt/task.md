# タスク: Hero画像のalt属性設定

## 概要
ブログ記事のHero画像に `alt` 属性が設定されていないため、記事タイトルを `alt` テキストとして設定する。

## 要件
- `src/layouts/BlogPost.astro` (記事詳細ページ) のHero画像に `alt` 属性を追加する。
- `src/pages/blog/index.astro` (ブログ一覧ページ) のHero画像に `alt` 属性を追加する。
- `alt` 属性の値には、その記事のタイトル (`title`) を使用する。
