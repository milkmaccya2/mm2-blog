# Reading Progress Bar Design

## Overview

ブログ記事ページにリーディングプログレスバーを追加する。記事の読了進捗をページ最上部の細いラインで視覚的に表示する。

## Design Decisions

| 項目 | 決定 |
|------|------|
| 位置 | ページ最上部に固定（`position: fixed; top: 0`） |
| 高さ | 3px |
| 色 | テーマに馴染む色。ライトモードではダーク寄り、ダークモードでは明るめ |
| 対象ページ | ブログ記事ページ（`BlogPost.astro`）のみ |
| z-index | ヘッダーより上 |

## Technical Details

### スクロール進捗の計算

- `<article>` 要素の位置を基準に進捗率を算出
- ページ全体ではなく記事本文の読了率を追跡
- `scroll` イベント + `requestAnimationFrame` でパフォーマンス確保

### Astro View Transitions 対応

- `astro:page-load` で初期化
- `astro:before-swap` でクリーンアップ

### アクセシビリティ

- `prefers-reduced-motion` 時はトランジションを無効にするが、バー自体は表示
- `role="progressbar"` と `aria-valuenow` で支援技術に対応

### ファイル構成

- `src/components/ReadingProgress.astro` — バーのHTML + スタイル + スクリプトをカプセル化
- `src/layouts/BlogPost.astro` — コンポーネントを読み込み

### 実装方針

- 既存の GSAP アニメーション（`animations.ts`）とは独立した軽量スクリプト
- Astro コンポーネント内に `<script>` タグでインラインスクリプト
- CSS カスタムプロパティでテーマ連動
