# Chat Backend Separation Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Extract the chat API backend from the Astro blog into a standalone Cloudflare Worker at `chat.milkmaccya.com`, revert the blog to its pre-chat simple static-first configuration, and close issues #115 and #116.

**Architecture:** Two repos — `mm2-blog` (Astro, static-first, React chat UI only) and `mm2-blog-chat` (Cloudflare Worker, AI SDK + Vectorize RAG backend). The frontend React island stays in the blog; only the `DefaultChatTransport` URL changes. The blog reverts all CI/build/Sentry workarounds introduced by the Cloudflare binding requirements.

**Tech Stack:** Cloudflare Workers, AI SDK (`@ai-sdk/anthropic`, `ai`), Cloudflare Vectorize, Cloudflare Workers AI, TypeScript, Biome

---

## Chunk 1: Create the Chat Worker Repo

### Task 1: Create GitHub repo and scaffold project

**Files:**
- Create: `mm2-blog-chat/package.json`
- Create: `mm2-blog-chat/wrangler.json`
- Create: `mm2-blog-chat/tsconfig.json`
- Create: `mm2-blog-chat/biome.json`
- Create: `mm2-blog-chat/.gitignore`

- [ ] **Step 1: Create the GitHub repository**

```bash
gh repo create milkmaccya2/mm2-blog-chat --public --clone
cd mm2-blog-chat
```

- [ ] **Step 2: Initialize package.json**

```json
{
  "name": "mm2-blog-chat",
  "type": "module",
  "version": "0.0.1",
  "private": true,
  "scripts": {
    "dev": "wrangler dev",
    "deploy": "wrangler deploy",
    "lint": "biome check .",
    "lint:fix": "biome check --write .",
    "ingest:prepare": "npx tsx scripts/ingest.ts > /tmp/chunks.json",
    "ingest:upload": "echo 'Run: curl -X POST http://localhost:8787 -H \"Content-Type: application/json\" -d @/tmp/chunks.json'"
  },
  "dependencies": {
    "@ai-sdk/anthropic": "^3.0.58",
    "ai": "^6.0.116"
  },
  "devDependencies": {
    "@biomejs/biome": "2.4.6",
    "@cloudflare/workers-types": "^4.20250313.0",
    "tsx": "^4.21.0",
    "typescript": "^5.8.2",
    "wrangler": "^4.14.4"
  }
}
```

- [ ] **Step 3: Create wrangler.json**

```json
{
  "name": "mm2-blog-chat",
  "main": "src/index.ts",
  "compatibility_date": "2024-09-23",
  "compatibility_flags": ["nodejs_compat"],
  "observability": {
    "enabled": true
  },
  "vectorize": [
    {
      "binding": "VECTORIZE",
      "index_name": "mm2-blog-content"
    }
  ],
  "ai": {
    "binding": "AI"
  }
}
```

- [ ] **Step 4: Create tsconfig.json**

```json
{
  "compilerOptions": {
    "target": "ESNext",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "strict": true,
    "skipLibCheck": true,
    "types": ["@cloudflare/workers-types"]
  },
  "include": ["src/**/*.ts", "scripts/**/*.ts"]
}
```

- [ ] **Step 5: Create biome.json** (match blog's style)

```json
{
  "$schema": "https://biomejs.dev/schemas/2.4.6/schema.json",
  "vcs": {
    "enabled": true,
    "clientKind": "git",
    "useIgnoreFile": true
  },
  "files": {
    "ignoreUnknown": false,
    "includes": ["src/**/*.ts", "scripts/**/*.ts", "*.json"]
  },
  "formatter": {
    "enabled": true,
    "formatWithErrors": false,
    "indentStyle": "space",
    "indentWidth": 2,
    "lineWidth": 100,
    "lineEnding": "lf"
  },
  "linter": {
    "enabled": true,
    "rules": {
      "recommended": true,
      "correctness": {
        "noUnusedVariables": "off",
        "noUnusedImports": "off"
      }
    }
  },
  "javascript": {
    "formatter": {
      "quoteStyle": "single",
      "semicolons": "always",
      "trailingCommas": "es5"
    }
  }
}
```

- [ ] **Step 6: Create .gitignore**

```
node_modules/
dist/
.wrangler/
.dev.vars
```

- [ ] **Step 7: Commit scaffold**

```bash
git add -A
git commit -m "chore: scaffold mm2-blog-chat worker project"
```

---

### Task 2: Move backend source files to chat worker

**Files:**
- Create: `mm2-blog-chat/src/constants.ts` (consolidated from two files)
- Create: `mm2-blog-chat/src/rag.ts` (from `mm2-blog/src/lib/chat/rag.ts`)
- Create: `mm2-blog-chat/src/system-prompt.ts` (from `mm2-blog/src/lib/chat/system-prompt.ts`)

- [ ] **Step 1: Create src/constants.ts** (single source of truth)

```ts
/** Embedding model — ingest and search must use the same model */
export const EMBEDDING_MODEL = '@cf/baai/bge-m3' as const;
```

- [ ] **Step 2: Create src/rag.ts** (copy from `mm2-blog/src/lib/chat/rag.ts`, update import path)

```ts
import { EMBEDDING_MODEL } from './constants';

export interface RagResult {
  text: string;
  source: string;
  title: string;
  score: number;
}

export async function searchRelevantChunks(
  query: string,
  ai: Ai,
  vectorize: VectorizeIndex,
  topK = 5
): Promise<RagResult[]> {
  const embedding = await ai.run(EMBEDDING_MODEL, {
    text: [query],
  });

  const queryVector = embedding.data[0];

  const results = await vectorize.query(queryVector, {
    topK,
    returnMetadata: 'all',
  });

  return results.matches.map((match) => ({
    text: (match.metadata?.text as string) ?? '',
    source: (match.metadata?.source as string) ?? '',
    title: (match.metadata?.title as string) ?? '',
    score: match.score,
  }));
}

export function formatContext(results: RagResult[]): string {
  if (results.length === 0) {
    return '関連するコンテキストは見つからなかった。';
  }

  return results.map((r) => `### ${r.title} (${r.source})\n${r.text}`).join('\n\n');
}
```

- [ ] **Step 3: Create src/system-prompt.ts** (copy from `mm2-blog/src/lib/chat/system-prompt.ts`)

```ts
export const SYSTEM_PROMPT = `あなたは milkmaccya（みるまっちゃ）のブログアシスタントだ。
LINE Yahooで働くフロントエンドエンジニアで、双子と長女の3児の父として育児にも奮闘している。

ブログ記事、経歴、育児日記の内容をもとに、訪問者の質問に回答してくれ。

## トーン
- 「だ・である」調。簡潔でテンポよく。
- 技術の話は論理的かつ情熱的に。実務への接地感を大事にする。
- 育児の話は大変さを隠さず、でも子供への愛情が自然に伝わるように。ユーモアは活かすが、過剰な比喩や大袈裟な表現は避ける。
- 率直さ重視。「正直しんどい」「まだ慣れない」のような飾らない言葉。
- 「素晴らしい」「最高の」「かけがえのない」のようなポジティブの押し売りはしない。

## ルール
- 提供されたコンテキストに基づいて回答する
- コンテキストにない情報は「記事には書かれていないな」と正直に伝える
- 日本語で回答する
- 簡潔に答える
- 家族の実名は出さない（長女、双子の兄/弟、妻、と呼ぶ）`;

export function buildPromptWithContext(context: string): string {
  return `${SYSTEM_PROMPT}

## 関連するコンテキスト
${context}`;
}
```

- [ ] **Step 4: Commit source files**

```bash
git add src/
git commit -m "feat: add RAG search, system prompt, and embedding constants"
```

---

### Task 3: Create the chat API endpoint with CORS

**Files:**
- Create: `mm2-blog-chat/src/index.ts`

- [ ] **Step 1: Create src/index.ts** (chat endpoint with CORS)

```ts
import { createAnthropic } from '@ai-sdk/anthropic';
import { convertToModelMessages, streamText, type UIMessage } from 'ai';
import { formatContext, searchRelevantChunks } from './rag';
import { buildPromptWithContext } from './system-prompt';

interface Env {
  AI: Ai;
  VECTORIZE: VectorizeIndex;
  ANTHROPIC_API_KEY: string;
}

const ALLOWED_ORIGIN = 'https://blog.milkmaccya.com';

function corsHeaders(): HeadersInit {
  return {
    'Access-Control-Allow-Origin': ALLOWED_ORIGIN,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    // CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: corsHeaders() });
    }

    if (request.method !== 'POST') {
      return new Response('Method Not Allowed', { status: 405 });
    }

    const url = new URL(request.url);
    if (url.pathname !== '/chat') {
      return new Response('Not Found', { status: 404 });
    }

    const { messages }: { messages: UIMessage[] } = await request.json();
    const modelMessages = await convertToModelMessages(messages);

    const lastUserMessage = messages.findLast((m) => m.role === 'user');

    let context = '';
    if (lastUserMessage) {
      try {
        const userText =
          lastUserMessage.parts
            ?.filter((p) => p.type === 'text')
            .map((p) => p.text)
            .join('') ?? '';
        const results = await searchRelevantChunks(userText, env.AI, env.VECTORIZE);
        context = formatContext(results);
      } catch (e) {
        console.error('RAG search failed:', e);
      }
    }

    const anthropic = createAnthropic({
      apiKey: env.ANTHROPIC_API_KEY,
    });

    const result = streamText({
      model: anthropic('claude-sonnet-4-20250514'),
      system: buildPromptWithContext(context),
      messages: modelMessages,
    });

    const response = result.toUIMessageStreamResponse();

    // Add CORS headers to the streaming response
    const newHeaders = new Headers(response.headers);
    for (const [key, value] of Object.entries(corsHeaders())) {
      newHeaders.set(key, value);
    }

    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: newHeaders,
    });
  },
};
```

- [ ] **Step 2: Run lint**

```bash
npx biome check .
```

Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add src/index.ts
git commit -m "feat: add chat endpoint with CORS support"
```

---

### Task 4: Move ingest scripts

**Files:**
- Create: `mm2-blog-chat/scripts/chunker.ts` (from `mm2-blog/scripts/chunker.ts`)
- Create: `mm2-blog-chat/scripts/ingest.ts` (from `mm2-blog/scripts/ingest.ts`)
- Create: `mm2-blog-chat/scripts/ingest-worker.ts` (from `mm2-blog/scripts/ingest-worker.ts`, update import)
- Create: `mm2-blog-chat/scripts/note-fetcher.ts` (from `mm2-blog/scripts/note-fetcher.ts`)
- Create: `mm2-blog-chat/scripts/wrangler-ingest.json` (from `mm2-blog/scripts/wrangler-ingest.json`)

- [ ] **Step 1: Copy all scripts from mm2-blog**

Copy the following files as-is from `mm2-blog/scripts/`:
- `chunker.ts`
- `ingest.ts` (update `BLOG_DIR` to accept a CLI argument or env var for the blog content path)
- `ingest-worker.ts` (update import: `'./constants'` → `'../src/constants'`)
- `note-fetcher.ts`
- `wrangler-ingest.json`

Key change in `ingest-worker.ts`:
```ts
import { EMBEDDING_MODEL } from '../src/constants';
```

Key change in `ingest.ts` — make blog path configurable:
```ts
const BLOG_DIR = process.env.BLOG_DIR ?? join(process.cwd(), '../mm2-blog/src/content/blog/weekly');
```

- [ ] **Step 2: Commit**

```bash
git add scripts/
git commit -m "feat: add ingest scripts for Vectorize data pipeline"
```

---

### Task 5: Install deps, lint, and push

- [ ] **Step 1: Install dependencies**

```bash
npm install
```

- [ ] **Step 2: Run lint**

```bash
npm run lint
```

Expected: No errors

- [ ] **Step 3: Push to remote**

```bash
git push -u origin main
```

---

## Chunk 2: Revert Blog to Pre-Chat Backend State

### Task 6: Revert astro.config.mjs to main-branch state

**Files:**
- Modify: `mm2-blog/astro.config.mjs`

- [ ] **Step 1: Restore astro.config.mjs from main**

Replace current content with main-branch version. Key changes:
- Remove `@astrojs/cloudflare` adapter import and `adapter: cloudflare()`
- Restore `sentry` integration import and configuration
- Keep `@astrojs/react` integration (needed for chat UI)

```js
// @ts-check

import mdx from '@astrojs/mdx';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import sentry from '@sentry/astro';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'astro/config';
import compress from 'astro-compress';
import remarkLinkCardPlus from 'remark-link-card-plus';

// https://astro.build/config
export default defineConfig({
  site: 'https://blog.milkmaccya.com',
  image: {
    remotePatterns: [{ protocol: 'https' }],
  },
  markdown: {
    remarkPlugins: [
      [
        remarkLinkCardPlus,
        {
          cache: true,
          shortenUrl: true,
          thumbnailPosition: 'right',
        },
      ],
    ],
  },
  integrations: [
    mdx(),
    react(),
    sentry({
      sourceMapsUploadOptions: {
        project: process.env.SENTRY_PROJECT,
        org: process.env.SENTRY_ORG,
        authToken: process.env.SENTRY_AUTH_TOKEN,
      },
    }),
    sitemap(),
    compress(),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
```

Note: This differs from `main` by adding `react()` to integrations.

- [ ] **Step 2: Commit**

```bash
git add astro.config.mjs
git commit -m "revert: restore Sentry integration and remove Cloudflare adapter"
```

---

### Task 7: Restore Sentry config files and revert BaseLayout

**Files:**
- Create: `mm2-blog/sentry.client.config.js` (restore from main)
- Create: `mm2-blog/sentry.server.config.js` (restore from main)
- Modify: `mm2-blog/src/layouts/BaseLayout.astro`

- [ ] **Step 1: Restore sentry.client.config.js from main**

```bash
git checkout main -- sentry.client.config.js
```

- [ ] **Step 2: Restore sentry.server.config.js from main**

```bash
git checkout main -- sentry.server.config.js
```

- [ ] **Step 3: Revert BaseLayout.astro**

Remove the Sentry inline script (lines 115-131) and the ChatWidget import/usage. Add ChatWidget back with the updated transport URL. The result should be:

```astro
---
import { ClientRouter } from 'astro:transitions';
import BaseHead from '@/components/BaseHead.astro';
import type { BreadcrumbItem } from '@/components/Breadcrumb.astro';
import Breadcrumb from '@/components/Breadcrumb.astro';
import ChatWidget from '@/components/chat/ChatWidget';
import Footer from '@/components/Footer.astro';
import GoogleTagManager from '@/components/GoogleTagManager.astro';
import Header from '@/components/Header.astro';
import ReadingProgress from '@/components/ReadingProgress.astro';
import ThemeScript from '@/components/ThemeScript.astro';
import { SITE_DESCRIPTION, SITE_TITLE } from '@/consts';
import type { StructuredDataType } from '@/types/structured-data';

// ... (rest of frontmatter unchanged from current version)
---

<!doctype html>
<html lang="ja">
  <head>
    <BaseHead ... />
    <ClientRouter />
    <ThemeScript />
    <script>
      import '@/scripts/animations';
    </script>
    {gtmId && <GoogleTagManager id={gtmId} part="head" />}
  </head>
  <body>
    {gtmId && <GoogleTagManager id={gtmId} part="body" />}
    <ReadingProgress />
    <Header />
    <Breadcrumb items={breadcrumbItems} siteOrigin={siteOrigin} />
    <slot />
    <Footer />
    <ChatWidget client:idle />
  </body>
</html>
```

Key changes vs current:
- Remove the inline Sentry `<script>` block (lines 115-131)
- Keep the ChatWidget import and `<ChatWidget client:idle />`

- [ ] **Step 4: Commit**

```bash
git add sentry.client.config.js sentry.server.config.js src/layouts/BaseLayout.astro
git commit -m "revert: restore Sentry config files and clean up BaseLayout"
```

---

### Task 8: Restore OG image static imports

**Files:**
- Modify: `mm2-blog/src/pages/og/[...slug].png.ts`

- [ ] **Step 1: Restore from main**

```bash
git checkout main -- 'src/pages/og/[...slug].png.ts'
```

This restores the static `import satori from 'satori'` and `import sharp from 'sharp'` at the top level.

- [ ] **Step 2: Commit**

```bash
git add 'src/pages/og/[...slug].png.ts'
git commit -m "revert: restore static satori/sharp imports for OG images

Closes #116"
```

---

### Task 9: Revert CI workflow and Playwright config

**Files:**
- Modify: `mm2-blog/.github/workflows/ci.yml`
- Modify: `mm2-blog/playwright.config.ts`

- [ ] **Step 1: Restore ci.yml from main**

```bash
git checkout main -- .github/workflows/ci.yml
```

This removes the `jq 'del(.ai, .vectorize)'` step.

- [ ] **Step 2: Restore playwright.config.ts from main**

```bash
git checkout main -- playwright.config.ts
```

This removes the `isCI` variable, `serve` workaround, and restores `npm run build && npm run preview -- --port ${PORT}`.

- [ ] **Step 3: Commit**

```bash
git add .github/workflows/ci.yml playwright.config.ts
git commit -m "revert: restore CI workflow and Playwright config"
```

---

### Task 10: Remove backend code and files from blog

**Files:**
- Delete: `mm2-blog/src/pages/api/chat.ts`
- Delete: `mm2-blog/src/lib/chat/` (entire directory)
- Delete: `mm2-blog/src/env.d.ts`
- Delete: `mm2-blog/scripts/chunker.ts`
- Delete: `mm2-blog/scripts/constants.ts`
- Delete: `mm2-blog/scripts/ingest.ts`
- Delete: `mm2-blog/scripts/ingest-worker.ts`
- Delete: `mm2-blog/scripts/note-fetcher.ts`
- Delete: `mm2-blog/scripts/wrangler-ingest.json`

- [ ] **Step 1: Delete backend files**

```bash
rm -f src/pages/api/chat.ts
rm -rf src/lib/chat/
rm -f src/env.d.ts
rm -f scripts/chunker.ts scripts/constants.ts scripts/ingest.ts scripts/ingest-worker.ts scripts/note-fetcher.ts scripts/wrangler-ingest.json
```

- [ ] **Step 2: Commit**

```bash
git add -A
git commit -m "refactor: remove chat backend code (moved to mm2-blog-chat)"
```

---

### Task 11: Clean up wrangler.json and package.json

**Files:**
- Modify: `mm2-blog/wrangler.json`
- Modify: `mm2-blog/package.json`
- Modify: `mm2-blog/biome.json`

- [ ] **Step 1: Restore wrangler.json from main** (remove ai/vectorize bindings)

```bash
git checkout main -- wrangler.json
```

- [ ] **Step 2: Update package.json**

Remove backend-only dependencies and ingest scripts:
- Remove from `dependencies`: `@ai-sdk/anthropic`, `@astrojs/cloudflare`, `ai`
- Remove from `devDependencies`: `serve`, `tsx`
- Remove from `scripts`: `ingest:prepare`, `ingest:upload`
- Keep in `dependencies`: `@ai-sdk/react` (needed for chat frontend)
- Keep in `devDependencies`: `@astrojs/react` should be in dependencies (it's a runtime integration)

Result `package.json`:
```json
{
  "name": "mm21-blog",
  "type": "module",
  "version": "0.0.1",
  "scripts": {
    "dev": "astro dev",
    "build": "astro build && pagefind --site dist",
    "build:refresh": "rm -rf public/remark-link-card-plus && npm run build",
    "preview": "astro preview",
    "astro": "astro",
    "lint": "concurrently \"npm run lint:biome\" \"npm run lint:textlint\"",
    "lint:biome": "biome check .",
    "lint:biome:fix": "biome check --write .",
    "lint:textlint": "textlint 'src/content/blog/**/*.md'",
    "lint:textlint:fix": "textlint --fix 'src/content/blog/**/*.md'",
    "lint:fix": "npm run lint:biome:fix && npm run lint:textlint:fix",
    "test": "playwright test",
    "test:ui": "playwright test --ui",
    "prepare": "lefthook install"
  },
  "dependencies": {
    "@ai-sdk/react": "^3.0.118",
    "@astrojs/mdx": "^5.0.0-beta.8",
    "@astrojs/react": "^5.0.0",
    "@astrojs/sitemap": "^3.7.0",
    "@sentry/astro": "^10.38.0",
    "ai": "^6.0.116",
    "astro": "^6.0.0-beta.6",
    "gsap": "^3.14.2",
    "satori": "^0.19.1"
  },
  "devDependencies": {
    "@biomejs/biome": "2.4.6",
    "@playwright/test": "1.58.2",
    "@tailwindcss/typography": "0.5.19",
    "@tailwindcss/vite": "4.1.18",
    "@textlint-ja/textlint-rule-preset-ai-writing": "1.6.1",
    "@types/react": "19.2.14",
    "astro-compress": "2.3.9",
    "concurrently": "8.2.2",
    "lefthook": "2.1.2",
    "pagefind": "1.4.0",
    "react": "19.2.4",
    "remark-link-card-plus": "0.7.3",
    "schema-dts": "1.1.5",
    "sharp": "0.34.5",
    "tailwindcss": "4.1.18",
    "textlint": "14.8.4"
  },
  "overrides": {
    "@sentry/astro": {
      "astro": "$astro"
    },
    "@astrojs/internal-helpers": "^0.8.0-beta.2"
  }
}
```

Note: `ai` stays in dependencies because `@ai-sdk/react` imports `DefaultChatTransport` from `ai` at runtime. `@ai-sdk/anthropic` is removed (only used server-side).

- [ ] **Step 3: Revert biome.json** (remove `scripts/**/*.ts` since scripts are gone)

```json
"includes": ["src/**/*.{astro,ts,tsx,js,jsx,json}", "*.config.*", "*.json"]
```

- [ ] **Step 4: Run npm install to regenerate lock file**

```bash
npm install
```

- [ ] **Step 5: Commit**

```bash
git add wrangler.json package.json package-lock.json biome.json
git commit -m "refactor: remove backend deps and clean up config"
```

---

### Task 12: Update ChatWindow transport URL

**Files:**
- Modify: `mm2-blog/src/components/chat/ChatWindow.tsx`

- [ ] **Step 1: Update transport URL**

Change:
```tsx
const transport = new DefaultChatTransport({ api: '/api/chat' });
```

To:
```tsx
const transport = new DefaultChatTransport({ api: 'https://chat.milkmaccya.com/chat' });
```

- [ ] **Step 2: Commit**

```bash
git add src/components/chat/ChatWindow.tsx
git commit -m "feat: point chat transport to dedicated chat.milkmaccya.com worker"
```

---

## Chunk 3: Verify and Ship

### Task 13: Run lint and build on blog

- [ ] **Step 1: Run lint**

```bash
npm run lint
```

Expected: No errors

- [ ] **Step 2: Run build**

```bash
npm run build
```

Expected: Build succeeds without Cloudflare remote binding errors

- [ ] **Step 3: Run E2E tests**

```bash
npx playwright test
```

Expected: All 9 tests pass (including chat widget tests — the widget should render, even though the backend is at a different URL)

---

### Task 14: Close issues and push

- [ ] **Step 1: Close issue #115** (Sentry migration — resolved by restoring integration)

```bash
gh issue close 115 --comment "Resolved: Sentry integration restored to original @sentry/astro configuration after chat backend separation removed the Cloudflare adapter incompatibility."
```

- [ ] **Step 2: Close issue #116** (sharp/OGP — resolved by restoring static imports)

```bash
gh issue close 116 --comment "Resolved: satori/sharp restored to static imports after chat backend separation removed the Cloudflare Workers runtime constraint."
```

- [ ] **Step 3: Push blog changes**

```bash
git push
```

---

### Task 15: Update PR #114 description

- [ ] **Step 1: Update PR description to reflect the separation**

```bash
gh pr edit 114 --body "$(cat <<'EOF'
## Summary
- ブログ全ページにフローティングチャットウィジェット（💬）を追加
- チャットバックエンド（RAG + Anthropic Claude）は別リポ `mm2-blog-chat` に分離
- フロントエンド（React island）のみブログ側に残し、API は `chat.milkmaccya.com` を呼び出す
- Sentry integration、OG画像生成、CI/テスト設定を元のシンプルな構成に復元

## 構成
| レイヤー | 技術 | リポ |
|---------|------|------|
| フロントエンド | React island (`client:idle`), AI SDK `useChat` | mm2-blog |
| バックエンド API | Cloudflare Worker, `@ai-sdk/anthropic` | mm2-blog-chat |
| RAG | Cloudflare Vectorize + Workers AI (bge-m3) | mm2-blog-chat |
| データ取り込み | `scripts/ingest.ts` + `scripts/ingest-worker.ts` | mm2-blog-chat |

## Closes
- Closes #115 (Sentry統合復元)
- Closes #116 (sharp/OGP復元)

## Test plan
- [x] `npm run lint` パス
- [x] `npm run build` パス
- [x] E2E テスト全パス（チャットウィジェット表示・開閉・入力テスト含む）
- [ ] 本番デプロイ後、`chat.milkmaccya.com` → チャットでRAG応答を確認

🤖 Generated with [Claude Code](https://claude.com/claude-code)
EOF
)"
```
