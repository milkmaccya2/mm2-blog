# Chat Backend Separation Design

## Overview

チャット機能のバックエンドを Astro ブログ (`mm2-blog`) から分離し、独立した Cloudflare Worker (`mm2-blog-chat`) として `chat.milkmaccya.com` にデプロイする。フロントエンド (React island) はブログ側に残し、API の向き先だけ変更する。

## Motivation

PR #114 でチャット機能を Astro に統合した結果、AI/Vectorize バインディングの存在がブログ本体の CI・テスト・ビルド・監視に波及的な複雑さをもたらした:

- CI で `jq` による wrangler.json 書き換えが必要
- Playwright が `astro preview` を使えず `serve` で代替
- satori/sharp の動的 import 化
- Sentry integration の除去とインライン化
- 全ページへの React バンドルロード

バックエンドだけ分離することで、ブログを元のシンプルな静的サイト構成に戻せる。

## Architecture

### After (Target)

```
mm2-blog (Astro, static-first)
├── src/components/chat/     # React island (unchanged)
│   ├── ChatWidget.tsx
│   ├── ChatWindow.tsx       # transport URL → chat.milkmaccya.com
│   ├── ChatInput.tsx
│   └── ChatMessage.tsx
└── (no AI/Vectorize code or bindings)

mm2-blog-chat (new repo, Cloudflare Worker)
├── src/
│   ├── index.ts             # POST /chat endpoint with CORS
│   ├── rag.ts               # Vectorize search (from lib/chat/rag.ts)
│   ├── system-prompt.ts     # Prompt builder (from lib/chat/system-prompt.ts)
│   └── constants.ts         # EMBEDDING_MODEL (single source of truth)
├── scripts/
│   ├── chunker.ts           # Markdown chunker (from scripts/)
│   ├── ingest.ts            # Chunk generator (from scripts/)
│   ├── ingest-worker.ts     # Embedding + Vectorize upsert (from scripts/)
│   ├── note-fetcher.ts      # note.com fetcher (from scripts/)
│   └── wrangler-ingest.json
├── wrangler.json            # ai, vectorize bindings
└── package.json             # @ai-sdk/anthropic, ai
```

### Blog Side: Revert to Pre-Chat State

| File | Action |
|------|--------|
| `astro.config.mjs` | Sentry integration 復活, `@astrojs/cloudflare` adapter 除去, `@astrojs/react` は残す |
| `sentry.client.config.js` | 復元 (git restore) |
| `sentry.server.config.js` | 復元 (git restore) |
| `BaseLayout.astro` | Sentry インラインスクリプト除去 |
| `src/pages/og/[...slug].png.ts` | satori/sharp を静的 import に戻す |
| `.github/workflows/ci.yml` | jq strip ステップ削除 |
| `playwright.config.ts` | serve workaround 削除, `astro preview` に戻す |
| `wrangler.json` | ai/vectorize バインディング削除 |
| `src/env.d.ts` | 削除 |
| `src/pages/api/chat.ts` | 削除 |
| `src/lib/chat/` | ディレクトリごと削除 |
| `scripts/` (chat関連) | 削除 (chunker, constants, ingest, ingest-worker, note-fetcher, wrangler-ingest.json) |
| `package.json` | `@ai-sdk/anthropic`, `ai`, `serve`, `tsx` 除去. `@ai-sdk/react`, `@astrojs/react`, `react` は残す |

### Chat Worker: CORS

```ts
const ALLOWED_ORIGIN = 'https://blog.milkmaccya.com';

// OPTIONS preflight + POST response headers
Access-Control-Allow-Origin: https://blog.milkmaccya.com
Access-Control-Allow-Methods: POST, OPTIONS
Access-Control-Allow-Headers: Content-Type
```

### Frontend Change

`ChatWindow.tsx` の transport URL のみ変更:

```tsx
const transport = new DefaultChatTransport({
  api: 'https://chat.milkmaccya.com/chat',
});
```

他のフロントエンドコード (ChatWidget, ChatInput, ChatMessage) は変更なし.

## EMBEDDING_MODEL Consolidation

現在 `scripts/constants.ts` と `src/lib/chat/constants.ts` に重複していた `EMBEDDING_MODEL` は、新リポの `src/constants.ts` に一本化。ingest スクリプトも同じリポ内から import するため、同期忘れのリスクがなくなる。

## Deployment

### Chat Worker

- `npx wrangler deploy` で `chat.milkmaccya.com` にデプロイ
- Cloudflare Dashboard でカスタムドメイン (`chat.milkmaccya.com`) をルーティング
- `npx wrangler secret put ANTHROPIC_API_KEY`
- Vectorize index は既存の `mm2-blog-content` をそのまま使用

### Blog

- Cloudflare adapter 除去後、デプロイ方式の確認が必要 (Pages or Workers)
- 既存の Cloudflare Workers デプロイフローを維持する場合、adapter なしでも `wrangler.json` の assets 設定で静的配信可能

## Out of Scope

- `createAboutChunks()` のハードコード解消 (将来の改善)
- チャットUI の React → 軽量化 (現状維持)
- RAG レスポンスキャッシュ (将来の改善)
