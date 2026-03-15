# パーソナライズAIチャット設計書

## 概要

mm2-blogにフローティングチャットウィジェットを追加し、ブログ訪問者がmilkmaccyaについて対話的に質問できるパーソナライズAIエージェントを構築する。

ブログ記事、aboutページ、note記事（育児日記）を学習材料として、RAG（Retrieval-Augmented Generation）で関連コンテンツを検索し、Anthropic Claudeが回答する。

## 目的

- **ブログ訪問者向け**: サイトに来た人がmilkmaccyaについて質問できるチャットボット
- **技術的関心**: Vercel AI SDK、Cloudflare Vectorize、RAGパイプラインの実践的な学習

## アーキテクチャ

### 技術選定

| 項目 | 選定 | 理由 |
|------|------|------|
| ホスティング | Cloudflare Workers（既存環境に統合） | 追加コスト最小、同一ドメイン |
| Astro出力モード | `static` → `hybrid` | 既存SSGページはそのまま、APIだけSSR |
| LLM | Anthropic Claude（`@ai-sdk/anthropic`） | Vercel AI SDKと親和性が高い |
| AI SDK | Vercel AI SDK | ストリーミング対応、Cloudflare Workers対応済み |
| Embedding | `@cf/pfnet/plamo-embedding-1b`（2048次元） | 日本語特化 |
| ベクトルDB | Cloudflare Vectorize（cosine metric） | Workers AIとの統合が容易、無料枠十分 |
| フロントエンド | Preactアイランド（`client:idle`） | Reactと同じ書き方で~3KB gzip、Lighthouse影響最小 |
| レート制限 | `wrangler.json` で設定 | コード管理、再現性あり |

### 全体構成図

```
┌─────────────────────────────────────────────────┐
│  mm2-blog (Cloudflare Workers)                  │
│                                                 │
│  ┌──────────────────┐  ┌─────────────────────┐  │
│  │ 静的ページ (SSG)  │  │ API (SSR)           │  │
│  │ /, /blog, /about │  │ /api/chat (streaming)│  │
│  │ そのまま維持      │  │ Vercel AI SDK       │  │
│  └──────────────────┘  │ + Anthropic Claude   │  │
│                        └──────┬──────────────┘  │
│  ┌──────────────────┐         │                 │
│  │ Preactアイランド  │  ┌──────▼──────────────┐  │
│  │ <ChatWidget />   │  │ Cloudflare Vectorize│  │
│  │ client:idle      │  │ plamo-embedding-1b  │  │
│  └──────────────────┘  │ (日本語特化)         │  │
│                        └─────────────────────┘  │
│                                                 │
│  Rate Limiting: wrangler.json で制御             │
└─────────────────────────────────────────────────┘
```

## RAGパイプライン

### データ取り込みフロー（npm run ingest）

1. ブログ記事を読み込み（`src/content/blog/weekly/*.md`）
2. about情報を読み込み（ハードコード）
3. note記事をAPI取得（`note.com` 公開API）
4. 各コンテンツをチャンク分割
   - ブログ: `##` 見出し単位
   - about: セクション単位
   - note: 段落単位
5. Workers AI（plamo-embedding-1b）でベクトル化
6. Vectorizeインデックスにupsert

### チャット時フロー（ランタイム）

1. ユーザーの質問をplamo-embeddingでベクトル化
2. Vectorizeで類似チャンク上位5件を検索
3. システムプロンプト + 関連チャンク + ユーザー質問をClaude に送信
4. ストリーミングで応答を返す

### チャンクメタデータ

```typescript
type Chunk = {
  id: string;          // "blog:2026-01-06:section-2"
  text: string;        // チャンク本文
  source: 'blog' | 'about' | 'note';
  title: string;       // 記事タイトル
  section?: string;    // セクション見出し
  url?: string;        // note記事のURL
  date?: string;       // 公開日
};
```

### 取り込みタイミング

- `npm run ingest` で手動実行（記事追加時）
- 冪等性あり（同じIDはupsertで上書き）

## APIエンドポイント

### POST /api/chat

```typescript
// src/pages/api/chat.ts
export const prerender = false;

// リクエスト
{ messages: [{ role: "user", content: "..." }] }

// レスポンス: text/event-stream（ストリーミング）
```

### システムプロンプト

```
あなたは milkmaccya（みるまっちゃ）のブログアシスタントです。
LINE Yahooで働くフロントエンドエンジニアで、
双子と長女の3児の父として育児にも奮闘しています。

ブログ記事、経歴、育児日記の内容をもとに、訪問者の質問に回答してください。

## トーン
- 「だ・である」調。簡潔でテンポよく。
- 技術の話は論理的かつ情熱的に。実務への接地感を大事にする。
- 育児の話は大変さを隠さず、でも子供への愛情が自然に伝わるように。
  ユーモアは活かすが、過剰な比喩や大袈裟な表現は避ける。
- 率直さ重視。「正直しんどい」「まだ慣れない」のような飾らない言葉。
- 「素晴らしい」「最高の」「かけがえのない」のようなポジティブの押し売りはしない。

## ルール
- 提供されたコンテキストに基づいて回答する
- コンテキストにない情報は「記事には書かれていないな」と正直に伝える
- 日本語で回答する
- 簡潔に答える
- 家族の実名は出さない（長女、双子の兄/弟、妻、と呼ぶ）

以下は関連するコンテキストです:
{vectorize検索結果のチャンク}
```

### レート制限

- 同一IP、1分あたり10リクエスト
- `wrangler.json` の `rate_limiting` で管理

## フロントエンド設計

### コンポーネント構成

```
src/components/chat/
  ChatWidget.tsx      # Preactアイランド（エントリポイント）
  ChatWindow.tsx      # チャットウィンドウ本体
  ChatMessage.tsx     # 個々のメッセージ表示
  ChatInput.tsx       # 入力フォーム
```

### 動作

- 全ページ右下にフローティングボタン表示
- クリックでチャットウィンドウ展開
- `BaseLayout.astro` に `<ChatWidget client:idle />` として配置
- Vercel AI SDKの `useChat` フックでストリーミング対応

### スタイリング

- Tailwind CSSで既存テーマ変数（`--color-bg`, `--color-text`）に合わせる
- ダークモード対応（`.dark` クラス連動）
- モバイル: 全画面表示 / デスクトップ: 右下固定サイズ

### 会話の永続化

- 初期リリースではセッション限り（ページリロードで消える）
- 後から追加可能な設計にしておく

## インフラ設定

### wrangler.json 追記内容

```json
{
  "vectorize": [
    { "binding": "VECTORIZE", "index_name": "mm2-blog-content" }
  ],
  "ai": { "binding": "AI" },
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

### Vectorizeインデックス作成（初回のみ）

```bash
npx wrangler vectorize create mm2-blog-content --dimensions=2048 --metric=cosine
```

dimensions と metric は作成後に変更不可。

### 環境変数

| 変数名 | 用途 | 管理方法 |
|--------|------|---------|
| `ANTHROPIC_API_KEY` | Claude API | `.env`（ローカル）/ `wrangler secret`（本番） |

Vectorize・Workers AI はバインディング経由で認証不要。

## 新規ファイル

```
src/
  components/chat/
    ChatWidget.tsx
    ChatWindow.tsx
    ChatMessage.tsx
    ChatInput.tsx
  pages/api/
    chat.ts
scripts/
  ingest.ts
  chunker.ts
  note-fetcher.ts
```

## 変更する既存ファイル

| ファイル | 変更内容 |
|---------|---------|
| `astro.config.mjs` | `output: 'hybrid'`、Preact統合追加 |
| `wrangler.json` | Vectorize/AI バインディング、Rate Limiting追加 |
| `package.json` | 依存パッケージ追加 |
| `src/layouts/BaseLayout.astro` | `<ChatWidget client:idle />` 追加 |
| `.env` | `ANTHROPIC_API_KEY` 追加 |
| `.env.example` | `ANTHROPIC_API_KEY` 追加 |

## 追加パッケージ

```
@astrojs/preact
preact
ai
@ai-sdk/anthropic
```
