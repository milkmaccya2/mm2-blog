# mm2-blog

個人の備忘録・メモ用ブログです。

## ドメイン情報

このブログは以下のドメインで運用されています：

- **メインURL**: [https://blog.milkmaccya.com](https://blog.milkmaccya.com) (Cloudflare経由)
- **Cloudflare Workers (デフォルト)**: [https://mm2-blog.milkmaccya2.workers.dev/](https://mm2-blog.milkmaccya2.workers.dev/)

## プロジェクトについて

Astroを使用しており、Markdownファイル (`src/content/blog/`) をベースに記事を管理しています。

## 開発コマンド

| コマンド | 説明 |
| :--- | :--- |
| `npm install` | 依存関係のインストール |
| `npm run dev` | ローカルサーバー起動 (`localhost:4321`) |
| `npm run build` | 本番用ビルド (`./dist/` 生成) |
| `npm run preview` | ビルド内容のプレビュー |

## プロジェクト構成

```text
├── public/          # 静的アセット（フォント、favicon等）
├── src/
│   ├── assets/      # ビルド処理されるアセット（画像等）
│   ├── components/  # Astroコンポーネント
│   ├── content/     # 記事コンテンツ (Markdown)
│   ├── layouts/     # ページレイアウト
│   ├── pages/       # ルーティング定義
│   └── styles/      # グローバルスタイル
├── astro.config.mjs # Astro設定
├── package.json
└── wrangler.jsonc   # Cloudflare Workers設定
```

## 技術スタック

- Astro
- Tailwind CSS
- Cloudflare Workers (Hosting)
