# OGP画像自動生成 設計ドキュメント

## 概要

ブログ記事ごとにカード型のOGP画像をビルド時に自動生成する。

## 技術スタック

- **Satori** — JSXからSVGを生成
- **sharp** — SVGからPNGに変換（既存依存）
- **Noto Sans JP** — Google Fonts APIからビルド時に取得

## デザイン仕様

- サイズ: 1200 x 630px
- カード型レイアウト: 記事タイトル + 公開日 + サイトロゴ + サイト名
- ダークグレー背景、白テキスト

## 進捗状況

- [x] satori パッケージのインストール
- [x] OGPカードデザインコンポーネントの作成 (`og-image.tsx`)
- [x] OGP画像生成エンドポイントの作成 (`[...slug].png.ts`)
- [x] `BaseHead.astro` と `BlogPost.astro` をOGP画像パスに対応
- [x] ビルドとOGP画像の検証

## ファイル構成

### 新規作成

- `src/pages/og/[...slug].png.ts` — OGP画像生成エンドポイント
- `src/lib/og-image.tsx` — Satori用カードデザイン定義

### 変更

- `src/components/BaseHead.astro` — ogImage prop追加
- `src/layouts/BlogPost.astro` — OGP画像パスをBaseHeadに渡す

## 生成フロー

1. `getStaticPaths()` で全ブログ記事を列挙
2. 各記事の title, pubDate を取得
3. Satori でJSX → SVG変換
4. sharp でSVG → PNG変換
5. `/og/weekly/2026-01-26.png` として出力
