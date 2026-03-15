# パーソナライズAIチャット 実装プラン

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** mm2-blogにフローティングチャットウィジェットを追加し、RAG + Anthropic Claudeでブログコンテンツに基づく対話型AIエージェントを構築する

**Architecture:** Cloudflare Workers上でAstroのSSRエンドポイント (`/api/chat`) を追加。Preact (compat mode) アイランドでチャットUIを構築し、Vercel AI SDK + Anthropic Claudeでストリーミング応答。コンテンツはplamo-embedding-1bでベクトル化し、Cloudflare Vectorizeに格納してRAG検索する。

**Tech Stack:** Astro 6, Preact (compat), Vercel AI SDK (`ai`, `@ai-sdk/anthropic`, `@ai-sdk/react`), Cloudflare Workers AI (plamo-embedding-1b), Cloudflare Vectorize, Tailwind CSS

**Spec:** `.claude/specs/2026-03-14-personalized-ai-chat-design.md`

**重要な設計判断:**
- Astro 6ではhybridがデフォルトなので `output: 'hybrid'` 設定は不要。APIエンドポイントに `export const prerender = false` を書くだけ
- Vercel AI SDKの `useChat` はPreactネイティブ非対応。`@astrojs/preact` の `compat: true` でReactエイリアスを有効にし、`@ai-sdk/react` を使う
- Cloudflare Workersアダプターが必要（`@astrojs/cloudflare`）— 現在はSSGのみなのでアダプターが入っていない

---

## Chunk 1: インフラ・基盤セットアップ

### Task 1: Cloudflareアダプター導入とPreact統合

**Files:**
- Modify: `astro.config.mjs`
- Modify: `package.json`
- Modify: `wrangler.json`
- Modify: `.env.example`
- Modify: `tsconfig.json`

- [ ] **Step 1: 依存パッケージをインストール**

```bash
npm install @astrojs/cloudflare @astrojs/preact preact ai @ai-sdk/anthropic @ai-sdk/react
```

- [ ] **Step 2: astro.config.mjs にCloudflareアダプターとPreact統合を追加**

```javascript
// @ts-check
import cloudflare from '@astrojs/cloudflare';
import mdx from '@astrojs/mdx';
import preact from '@astrojs/preact';
import sitemap from '@astrojs/sitemap';
import sentry from '@sentry/astro';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'astro/config';
import compress from 'astro-compress';
import remarkLinkCardPlus from 'remark-link-card-plus';

export default defineConfig({
  site: 'https://blog.milkmaccya.com',
  adapter: cloudflare(),
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
    preact({ compat: true }),
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

注意点:
- `preact({ compat: true })` により `react` / `react-dom` のimportが自動的にPreactにエイリアスされる
- `adapter: cloudflare()` によりSSRエンドポイントがCloudflare Workersで動作可能になる
- 既存の静的ページは影響なし（Astro 6ではデフォルトで `prerender: true`）

- [ ] **Step 3: wrangler.json にバインディングとレート制限を追加**

```json
{
  "name": "mm2-blog",
  "compatibility_date": "2024-09-23",
  "compatibility_flags": ["nodejs_compat"],
  "assets": {
    "directory": "./dist",
    "not_found_handling": "404-page"
  },
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
  },
  "rate_limiting": {
    "rules": [
      {
        "action": "block",
        "match": "/api/chat",
        "period": 60,
        "requests_per_period": 10
      }
    ]
  }
}
```

- [ ] **Step 4: .env.example に ANTHROPIC_API_KEY を追加**

```
ANTHROPIC_API_KEY=sk-ant-your-api-key-here
```

`.env` にも実際のキーを設定する（手動）。

- [ ] **Step 5: ビルドが通ることを確認**

Run: `npm run build`
Expected: ビルド成功（既存ページへの影響なし）

- [ ] **Step 6: コミット**

```bash
git add astro.config.mjs wrangler.json package.json package-lock.json .env.example tsconfig.json
git commit -m "feat: Cloudflareアダプター・Preact統合・AI関連パッケージを追加"
```

---

### Task 2: Vectorizeインデックス作成

- [ ] **Step 1: Cloudflare Vectorizeインデックスを作成**

```bash
npx wrangler vectorize create mm2-blog-content --dimensions=2048 --metric=cosine
```

Expected: `Successfully created Vectorize index 'mm2-blog-content'`

注意: dimensions(2048)とmetric(cosine)は作成後に変更不可。plamo-embedding-1bの出力次元数に合わせている。

- [ ] **Step 2: 本番環境にAnthropic APIキーを設定**

```bash
npx wrangler secret put ANTHROPIC_API_KEY
```

プロンプトが出たらAPIキーを入力する。

---

## Chunk 2: APIエンドポイント（バックエンド）

### Task 3: チャットAPIエンドポイント作成

**Files:**
- Create: `src/pages/api/chat.ts`
- Create: `src/lib/chat/system-prompt.ts`
- Create: `src/lib/chat/rag.ts`

- [ ] **Step 1: システムプロンプト定義ファイルを作成**

`src/lib/chat/system-prompt.ts`:

```typescript
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

- [ ] **Step 2: RAG検索モジュールを作成**

`src/lib/chat/rag.ts`:

```typescript
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
  topK = 5,
): Promise<RagResult[]> {
  // クエリをベクトル化
  const embedding = await ai.run('@cf/pfnet/plamo-embedding-1b', {
    text: [query],
  });

  const queryVector = embedding.data[0];

  // Vectorizeで類似検索
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

  return results
    .map((r) => `### ${r.title} (${r.source})\n${r.text}`)
    .join('\n\n');
}
```

- [ ] **Step 3: チャットAPIエンドポイントを作成**

`src/pages/api/chat.ts`:

```typescript
import type { APIRoute } from 'astro';
import { createAnthropic } from '@ai-sdk/anthropic';
import { streamText } from 'ai';
import { buildPromptWithContext } from '@/lib/chat/system-prompt';
import { formatContext, searchRelevantChunks } from '@/lib/chat/rag';

export const prerender = false;

export const POST: APIRoute = async ({ request, locals }) => {
  const { messages } = await request.json();
  const env = locals.runtime.env;

  // 最新のユーザーメッセージでRAG検索
  const lastUserMessage = [...messages].reverse().find(
    (m: { role: string }) => m.role === 'user',
  );

  let context = '';
  if (lastUserMessage) {
    const results = await searchRelevantChunks(
      lastUserMessage.content,
      env.AI,
      env.VECTORIZE,
    );
    context = formatContext(results);
  }

  const anthropic = createAnthropic({
    apiKey: env.ANTHROPIC_API_KEY,
  });

  const result = streamText({
    model: anthropic('claude-sonnet-4-20250514'),
    system: buildPromptWithContext(context),
    messages,
  });

  return result.toDataStreamResponse();
};
```

- [ ] **Step 4: Cloudflare Workers の型定義を追加**

`src/env.d.ts` に追記（既存ファイルがあれば追記、なければ作成）:

```typescript
/// <reference types="astro/client" />

interface CloudflareEnv {
  AI: Ai;
  VECTORIZE: VectorizeIndex;
  ANTHROPIC_API_KEY: string;
}

declare namespace App {
  interface Locals {
    runtime: {
      env: CloudflareEnv;
    };
  }
}
```

- [ ] **Step 5: ビルドが通ることを確認**

Run: `npm run build`
Expected: ビルド成功

- [ ] **Step 6: コミット**

```bash
git add src/pages/api/chat.ts src/lib/chat/system-prompt.ts src/lib/chat/rag.ts src/env.d.ts
git commit -m "feat: チャットAPIエンドポイントとRAG検索を追加"
```

---

## Chunk 3: フロントエンド（チャットウィジェット）

### Task 4: ChatWidgetコンポーネント作成

**Files:**
- Create: `src/components/chat/ChatWidget.tsx`
- Create: `src/components/chat/ChatWindow.tsx`
- Create: `src/components/chat/ChatMessage.tsx`
- Create: `src/components/chat/ChatInput.tsx`

- [ ] **Step 1: ChatMessage コンポーネントを作成**

`src/components/chat/ChatMessage.tsx`:

```tsx
interface Props {
  role: 'user' | 'assistant';
  content: string;
}

export default function ChatMessage({ role, content }: Props) {
  const isUser = role === 'user';

  return (
    <div class={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-3`}>
      <div
        class={`max-w-[80%] rounded-2xl px-4 py-2 text-sm leading-relaxed ${
          isUser
            ? 'bg-blue-600 text-white'
            : 'bg-[var(--color-bg-secondary,#f3f4f6)] text-[var(--color-text)] dark:bg-gray-700 dark:text-gray-100'
        }`}
      >
        {content}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: ChatInput コンポーネントを作成**

`src/components/chat/ChatInput.tsx`:

```tsx
interface Props {
  input: string;
  isLoading: boolean;
  onInputChange: (e: Event) => void;
  onSubmit: (e: Event) => void;
}

export default function ChatInput({ input, isLoading, onInputChange, onSubmit }: Props) {
  return (
    <form onSubmit={onSubmit} class="flex gap-2 border-t border-gray-200 p-3 dark:border-gray-600">
      <input
        type="text"
        value={input}
        onInput={onInputChange}
        placeholder="質問を入力..."
        disabled={isLoading}
        class="flex-1 rounded-lg border border-gray-300 bg-[var(--color-bg)] px-3 py-2 text-sm text-[var(--color-text)] placeholder-gray-400 focus:border-blue-500 focus:outline-none dark:border-gray-600"
      />
      <button
        type="submit"
        disabled={isLoading || !input.trim()}
        class="rounded-lg bg-blue-600 px-4 py-2 text-sm text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
      >
        {isLoading ? '...' : '送信'}
      </button>
    </form>
  );
}
```

- [ ] **Step 3: ChatWindow コンポーネントを作成**

`src/components/chat/ChatWindow.tsx`:

```tsx
import { useChat } from '@ai-sdk/react';
import { useEffect, useRef } from 'preact/hooks';
import ChatInput from './ChatInput';
import ChatMessage from './ChatMessage';

interface Props {
  onClose: () => void;
}

export default function ChatWindow({ onClose }: Props) {
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: '/api/chat',
  });
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div class="fixed bottom-20 right-4 z-50 flex h-[500px] w-[360px] flex-col rounded-2xl bg-[var(--color-bg)] shadow-2xl ring-1 ring-gray-200 dark:ring-gray-700 max-sm:bottom-0 max-sm:right-0 max-sm:h-full max-sm:w-full max-sm:rounded-none">
      {/* Header */}
      <div class="flex items-center justify-between rounded-t-2xl bg-blue-600 px-4 py-3 text-white max-sm:rounded-none">
        <span class="text-sm font-bold">milkmaccya に聞く</span>
        <button
          onClick={onClose}
          class="text-white/80 transition-colors hover:text-white"
          aria-label="チャットを閉じる"
        >
          ✕
        </button>
      </div>

      {/* Messages */}
      <div class="flex-1 overflow-y-auto p-4">
        {messages.length === 0 && (
          <p class="text-center text-sm text-gray-400">
            ブログの内容について何でも聞いてください
          </p>
        )}
        {messages.map((m) => (
          <ChatMessage key={m.id} role={m.role as 'user' | 'assistant'} content={m.content} />
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <ChatInput
        input={input}
        isLoading={isLoading}
        onInputChange={handleInputChange}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
```

- [ ] **Step 4: ChatWidget（エントリポイント）を作成**

`src/components/chat/ChatWidget.tsx`:

```tsx
import { useState } from 'preact/hooks';
import ChatWindow from './ChatWindow';

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {isOpen && <ChatWindow onClose={() => setIsOpen(false)} />}

      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          class="fixed bottom-4 right-4 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-blue-600 text-2xl text-white shadow-lg transition-transform hover:scale-110"
          aria-label="チャットを開く"
        >
          💬
        </button>
      )}
    </>
  );
}
```

- [ ] **Step 5: コミット**

```bash
git add src/components/chat/
git commit -m "feat: チャットウィジェットUIコンポーネントを追加"
```

---

### Task 5: BaseLayoutにチャットウィジェットを組み込み

**Files:**
- Modify: `src/layouts/BaseLayout.astro`

- [ ] **Step 1: BaseLayout.astro にChatWidgetを追加**

`src/layouts/BaseLayout.astro` の `<body>` 閉じタグの直前に追加:

```astro
---
import ChatWidget from '@/components/chat/ChatWidget';
// ... 既存のimport
---

<!-- 既存のHTML -->
<body>
  {gtmId && <GoogleTagManager id={gtmId} part="body" />}
  <ReadingProgress />
  <Header />
  <Breadcrumb items={breadcrumbItems} siteOrigin={siteOrigin} />
  <slot />
  <Footer />
  <ChatWidget client:idle />
</body>
```

`client:idle` はページロード完了後にハイドレートする。LCPやFCPに影響しない。

- [ ] **Step 2: ローカルで動作確認**

Run: `npm run dev`

確認項目:
- 全ページの右下に💬ボタンが表示される
- クリックでチャットウィンドウが開く
- メッセージ送信で `/api/chat` にリクエストが飛ぶ（Vectorizeがローカルにないのでエラーになるのは想定内）
- ✕ボタンでウィンドウが閉じる

- [ ] **Step 3: コミット**

```bash
git add src/layouts/BaseLayout.astro
git commit -m "feat: BaseLayoutにチャットウィジェットを組み込み"
```

---

## Chunk 4: データ取り込みスクリプト（Ingest）

### Task 6: チャンカーとnote記事取得スクリプト作成

**Files:**
- Create: `scripts/chunker.ts`
- Create: `scripts/note-fetcher.ts`

- [ ] **Step 1: チャンカー（チャンク分割）モジュールを作成**

`scripts/chunker.ts`:

```typescript
export interface Chunk {
  id: string;
  text: string;
  source: 'blog' | 'about' | 'note';
  title: string;
  section?: string;
  url?: string;
  date?: string;
}

/**
 * Markdownを ## 見出し単位でチャンク分割する
 */
export function chunkMarkdownBySections(
  markdown: string,
  meta: { source: Chunk['source']; title: string; date?: string; url?: string; idPrefix: string },
): Chunk[] {
  // frontmatter を除去
  const content = markdown.replace(/^---[\s\S]*?---\n/, '');
  const sections = content.split(/(?=^## )/m).filter((s) => s.trim());

  return sections.map((section, index) => {
    const lines = section.trim().split('\n');
    const heading = lines[0]?.replace(/^##\s*/, '').trim() ?? `section-${index}`;
    const body = lines.slice(1).join('\n').trim();

    return {
      id: `${meta.idPrefix}:section-${index}`,
      text: body || heading,
      source: meta.source,
      title: meta.title,
      section: heading,
      url: meta.url,
      date: meta.date,
    };
  });
}

/**
 * テキストを段落単位でチャンク分割する（note記事用）
 */
export function chunkByParagraphs(
  text: string,
  meta: { title: string; url: string; idPrefix: string },
): Chunk[] {
  const paragraphs = text
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter((p) => p.length > 20); // 短すぎる段落は除外

  return paragraphs.map((paragraph, index) => ({
    id: `${meta.idPrefix}:para-${index}`,
    text: paragraph,
    source: 'note' as const,
    title: meta.title,
    url: meta.url,
  }));
}

/**
 * about情報をチャンク化する（ハードコード）
 */
export function createAboutChunks(): Chunk[] {
  const sections = [
    {
      section: 'プロフィール',
      text: 'milkmaccya（みるまっちゃ）。LINE Yahooで働くフロントエンドエンジニア。双子と長女の3児の父。',
    },
    {
      section: '経歴 - LINE Yahoo',
      text: 'Frontend Engineer @ LINE Yahoo (2021-Present)。大規模Next.jsリファクタリング（v10→v14）、チームマネジメント経験あり。',
    },
    {
      section: '経歴 - Sky',
      text: 'Project Leader @ Sky Corp (2016-2021)。エンタープライズシステム開発。フロントエンドへの転身。',
    },
    {
      section: '経歴 - TRC',
      text: 'System Engineer @ TRC (2011-2016)。工場システム、衛星インフラ開発。',
    },
    {
      section: 'スキル',
      text: 'TypeScript/JavaScript, React, Next.js, Vue.js, Astro, Java, C#, C++, SQL。資格: PMP, 情報セキュリティスペシャリスト, AWS, Docker。',
    },
  ];

  return sections.map((s, index) => ({
    id: `about:section-${index}`,
    text: s.text,
    source: 'about' as const,
    title: 'About milkmaccya',
    section: s.section,
  }));
}
```

- [ ] **Step 2: note記事取得モジュールを作成**

`scripts/note-fetcher.ts`:

```typescript
export interface NoteArticle {
  title: string;
  body: string;
  url: string;
  publishedAt: string;
}

const NOTE_API_BASE = 'https://note.com/api/v2/creators/milkmaccya2/contents';

export async function fetchNoteArticles(maxPages = 3): Promise<NoteArticle[]> {
  const articles: NoteArticle[] = [];

  for (let page = 1; page <= maxPages; page++) {
    const url = `${NOTE_API_BASE}?kind=note&page=${page}`;
    const res = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; AstroBot/1.0)' },
    });

    if (!res.ok) {
      console.error(`note API error: ${res.status} at page ${page}`);
      break;
    }

    const data = await res.json();
    const notes = data.data?.contents ?? [];

    if (notes.length === 0) break;

    for (const note of notes) {
      articles.push({
        title: note.name ?? '',
        body: note.body ?? '',
        url: `https://note.com/milkmaccya2/n/${note.key}`,
        publishedAt: note.publishAt ?? '',
      });
    }
  }

  return articles;
}
```

- [ ] **Step 3: コミット**

```bash
git add scripts/chunker.ts scripts/note-fetcher.ts
git commit -m "feat: チャンカーとnote記事取得モジュールを追加"
```

---

### Task 7: Ingestスクリプト作成

**Files:**
- Create: `scripts/ingest.ts`
- Modify: `package.json` (npm script追加)

- [ ] **Step 1: ingestスクリプトを作成**

`scripts/ingest.ts`:

```typescript
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { type Chunk, chunkByParagraphs, chunkMarkdownBySections, createAboutChunks } from './chunker';
import { fetchNoteArticles } from './note-fetcher';

// Wrangler の unstable_dev または REST API 経由で実行する想定
// 実行: npx wrangler dev scripts/ingest-worker.ts --remote
// もしくは standalone スクリプトとして wrangler vectorize + Workers AI API を直接呼ぶ

const BLOG_DIR = join(process.cwd(), 'src/content/blog/weekly');

async function loadBlogChunks(): Promise<Chunk[]> {
  const files = readdirSync(BLOG_DIR).filter((f) => f.endsWith('.md'));
  const chunks: Chunk[] = [];

  for (const file of files) {
    const content = readFileSync(join(BLOG_DIR, file), 'utf-8');
    const dateMatch = file.match(/(\d{4}-\d{2}-\d{2})/);
    const date = dateMatch?.[1] ?? '';

    // frontmatter からタイトルを抽出
    const titleMatch = content.match(/title:\s*['"](.+?)['"]/);
    const title = titleMatch?.[1] ?? file.replace('.md', '');

    const blogChunks = chunkMarkdownBySections(content, {
      source: 'blog',
      title,
      date,
      idPrefix: `blog:${date}`,
    });
    chunks.push(...blogChunks);
  }

  return chunks;
}

async function loadNoteChunks(): Promise<Chunk[]> {
  console.log('Fetching note articles...');
  const articles = await fetchNoteArticles();
  console.log(`Fetched ${articles.length} note articles`);

  const chunks: Chunk[] = [];
  for (const article of articles) {
    const articleChunks = chunkByParagraphs(article.body, {
      title: article.title,
      url: article.url,
      idPrefix: `note:${article.url.split('/').pop() ?? ''}`,
    });
    chunks.push(...articleChunks);
  }

  return chunks;
}

async function main() {
  console.log('=== Ingest Start ===');

  // 1. 全チャンクを収集
  const blogChunks = await loadBlogChunks();
  console.log(`Blog chunks: ${blogChunks.length}`);

  const aboutChunks = createAboutChunks();
  console.log(`About chunks: ${aboutChunks.length}`);

  const noteChunks = await loadNoteChunks();
  console.log(`Note chunks: ${noteChunks.length}`);

  const allChunks = [...blogChunks, ...aboutChunks, ...noteChunks];
  console.log(`Total chunks: ${allChunks.length}`);

  // 2. ベクトル化 & Vectorize upsert
  // この部分はCloudflare Workers環境で実行する必要がある
  // scripts/ingest-worker.ts として別途Workerスクリプトを作成する
  console.log('Chunks prepared. Run ingest-worker to embed and upsert.');
  console.log(JSON.stringify(allChunks, null, 2));
}

main().catch(console.error);
```

注意: plamo-embedding-1bとVectorizeはCloudflare Workers環境でしか使えないため、実際のembedding + upsertはWorkerスクリプトとして実行する必要がある。チャンク生成はローカルで行い、JSON出力 → Workerで取り込みの2段階にする。

- [ ] **Step 2: Ingest用Workerスクリプトを作成**

`scripts/ingest-worker.ts`:

```typescript
// このファイルは npx wrangler dev scripts/ingest-worker.ts --remote で実行する
// チャンクJSONを受け取り、embedding + Vectorize upsertを行う

export interface Env {
  AI: Ai;
  VECTORIZE: VectorizeIndex;
}

interface Chunk {
  id: string;
  text: string;
  source: string;
  title: string;
  section?: string;
  url?: string;
  date?: string;
}

const BATCH_SIZE = 10; // embedding APIのバッチサイズ

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    if (request.method !== 'POST') {
      return new Response('POST chunks JSON to this endpoint', { status: 405 });
    }

    const chunks: Chunk[] = await request.json();
    console.log(`Received ${chunks.length} chunks`);

    let upserted = 0;

    // バッチ処理
    for (let i = 0; i < chunks.length; i += BATCH_SIZE) {
      const batch = chunks.slice(i, i + BATCH_SIZE);
      const texts = batch.map((c) => c.text);

      // plamo-embedding-1b でベクトル化
      const embeddings = await env.AI.run('@cf/pfnet/plamo-embedding-1b', {
        text: texts,
      });

      // Vectorize に upsert
      const vectors = batch.map((chunk, idx) => ({
        id: chunk.id,
        values: embeddings.data[idx],
        metadata: {
          text: chunk.text,
          source: chunk.source,
          title: chunk.title,
          section: chunk.section ?? '',
          url: chunk.url ?? '',
          date: chunk.date ?? '',
        },
      }));

      await env.VECTORIZE.upsert(vectors);
      upserted += vectors.length;
      console.log(`Upserted ${upserted}/${chunks.length}`);
    }

    return Response.json({ success: true, upserted });
  },
};
```

- [ ] **Step 3: package.json に ingest スクリプトを追加**

```json
{
  "scripts": {
    "ingest:prepare": "npx tsx scripts/ingest.ts > /tmp/chunks.json",
    "ingest:upload": "echo 'Run: curl -X POST http://localhost:8787 -H \"Content-Type: application/json\" -d @/tmp/chunks.json'"
  }
}
```

実行手順:
1. `npm run ingest:prepare` — チャンクJSONを生成
2. `npx wrangler dev scripts/ingest-worker.ts --remote` — Workerをリモートモードで起動
3. `curl -X POST http://localhost:8787 -H "Content-Type: application/json" -d @/tmp/chunks.json` — チャンクをアップロード

- [ ] **Step 4: コミット**

```bash
git add scripts/ingest.ts scripts/ingest-worker.ts package.json
git commit -m "feat: データ取り込み（ingest）スクリプトを追加"
```

---

## Chunk 5: 結合テスト・デプロイ

### Task 8: E2Eテスト追加

**Files:**
- Modify: `tests/e2e.spec.ts`

- [ ] **Step 1: チャットウィジェットのE2Eテストを追加**

既存の `tests/e2e.spec.ts` に追加:

```typescript
test('チャットウィジェットが表示される', async ({ page }) => {
  await page.goto('/');
  // client:idle なので少し待つ
  const chatButton = page.locator('button[aria-label="チャットを開く"]');
  await expect(chatButton).toBeVisible({ timeout: 10000 });
});

test('チャットウィンドウの開閉', async ({ page }) => {
  await page.goto('/');
  const chatButton = page.locator('button[aria-label="チャットを開く"]');
  await chatButton.click();

  // ウィンドウが開く
  await expect(page.locator('text=milkmaccya に聞く')).toBeVisible();

  // 閉じる
  const closeButton = page.locator('button[aria-label="チャットを閉じる"]');
  await closeButton.click();

  // ウィンドウが閉じてボタンが再表示
  await expect(chatButton).toBeVisible();
});
```

- [ ] **Step 2: テスト実行**

Run: `npm test`
Expected: 既存テスト + 新規チャットテストがPASS

- [ ] **Step 3: コミット**

```bash
git add tests/e2e.spec.ts
git commit -m "test: チャットウィジェットのE2Eテストを追加"
```

---

### Task 9: Lint確認・最終ビルド・デプロイ

- [ ] **Step 1: Lint実行**

Run: `npm run lint`
Expected: エラーなし（チャット関連ファイルがBiomeルールに準拠していること）

- [ ] **Step 2: ビルド確認**

Run: `npm run build`
Expected: ビルド成功

- [ ] **Step 3: データ取り込み実行**

```bash
npm run ingest:prepare
npx wrangler dev scripts/ingest-worker.ts --remote
# 別ターミナルで:
curl -X POST http://localhost:8787 -H "Content-Type: application/json" -d @/tmp/chunks.json
```

Expected: `{ "success": true, "upserted": N }`

- [ ] **Step 4: デプロイ**

```bash
npx wrangler deploy
```

- [ ] **Step 5: 本番動作確認**

確認項目:
- blog.milkmaccya.com にアクセスし、💬ボタンが表示される
- チャットウィンドウが開く
- 質問を送信すると、ストリーミングで回答が返る
- レート制限が機能する（連打で429エラー）

- [ ] **Step 6: 最終コミット（もしあれば）**

```bash
git add -A
git commit -m "feat: パーソナライズAIチャット機能を追加"
```
