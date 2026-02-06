# mm2-blog

個人の備忘録・メモ用ブログです。

## ドメイン情報

このブログは以下のドメインで運用されています：

- **メインURL**: [https://blog.milkmaccya.com](https://blog.milkmaccya.com) (Cloudflare経由)
- **Cloudflare Workers (デフォルト)**: [https://mm2-blog.milkmaccya2.workers.dev/](https://mm2-blog.milkmaccya2.workers.dev/)

## プロジェクトについて

Astroを使用しており、Markdownファイル (`src/content/blog/`) をベースに記事を管理しています。

### ブログ執筆・更新フロー

Notionに蓄積した個人のメモや日記を元にNotion AIが週報を作成し、それをGeminiでリライトして公開しています。

```mermaid
graph TD
    Input(日々のメモ・日記・WebClip) -->|蓄積| Notion[(Notion)]
    Notion -->|Notion AIが週報作成| Draft["週報下書き<br/>(Personalな情報含む)"]
    Draft -->|Gemini Gemがリライト| Rewritten[リライト済みテキスト]
    Rewritten -->|"目視確認・修正<br/>ファイル作成"| File["YYYY-MM-DD.md"]
    File -->|Git Push| GH[GitHub]
    GH -->|GitHub Actions| CF["Cloudflare Workers<br/>(公開)"]
```

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
