# Affiliate Cards 実装プラン

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Amazon/楽天アフィリエイトリンクをリッチなカード表示で週報に埋め込めるようにし、記事フッターにも共通バナーエリアを設置する。

**Architecture:** @astrojs/mdx を導入し、週報を .md → .mdx に移行することで `<AffiliateCard>` コンポーネントを記事内に直接埋め込む。共通バナー（AffiliateBanner）は BlogPost.astro の Giscus コメント欄直前に挿入する。既存の .md ファイルはそのまま維持し、新しい週報から .mdx を使用する。

**Tech Stack:** Astro 6, @astrojs/mdx, Tailwind CSS 4

---

### Task 1: feature ブランチを作成する

**Files:**
- (git操作のみ)

**Step 1: main から feature ブランチを作成してチェックアウト**

```bash
git checkout main
git checkout -b feature/affiliate-cards
```

Expected: `Switched to a new branch 'feature/affiliate-cards'`

---

### Task 2: @astrojs/mdx をインストールして astro.config.mjs に追加する

**Files:**
- Modify: `package.json`（npm install で自動更新）
- Modify: `astro.config.mjs`

**Step 1: パッケージをインストール**

```bash
npm install @astrojs/mdx
```

Expected: `added N packages` のようなメッセージ。エラーなし。

**Step 2: astro.config.mjs の integrations に mdx() を追加**

```js
// @ts-check
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import sentry from '@sentry/astro';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'astro/config';
import compress from 'astro-compress';
import remarkLinkCardPlus from 'remark-link-card-plus';

export default defineConfig({
  site: 'https://blog.milkmaccya.com',
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
    mdx(),   // ← 追加（sentry より前に置く）
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

> **Note:** `markdown.remarkPlugins` に設定した remarkLinkCardPlus は、@astrojs/mdx 経由の .mdx ファイルにも自動的に適用される。

**Step 3: ビルドが通ることを確認**

```bash
npm run build
```

Expected: `Complete!` のようなメッセージ。エラーなし。

**Step 4: コミット**

```bash
git add astro.config.mjs package.json package-lock.json
git commit -m "feat: @astrojs/mdx を追加"
```

---

### Task 3: AffiliateCard.astro コンポーネントを作成する

**Files:**
- Create: `src/components/AffiliateCard.astro`

**Step 1: コンポーネントを作成**

```astro
---
interface Props {
  name: string;
  amazonUrl?: string;
  rakutenUrl?: string;
  imageUrl?: string;
  brand?: string;
}
const { name, amazonUrl, rakutenUrl, imageUrl, brand } = Astro.props;
---

<div class="not-prose my-4 flex gap-4 rounded-lg border border-gray-200 dark:border-gray-700 p-4 bg-white dark:bg-gray-800 shadow-sm">
  {imageUrl && (
    <div class="flex-shrink-0 w-24 h-24">
      <img src={imageUrl} alt={name} class="w-full h-full object-contain rounded" loading="lazy" />
    </div>
  )}
  <div class="flex flex-col gap-2 flex-1 min-w-0">
    <div>
      {brand && <p class="text-xs text-gray-500 dark:text-gray-400 m-0">{brand}</p>}
      <p class="font-semibold text-gray-900 dark:text-gray-100 m-0 leading-snug">{name}</p>
    </div>
    <div class="flex gap-2 flex-wrap mt-auto">
      {amazonUrl && (
        <a
          href={amazonUrl}
          target="_blank"
          rel="nofollow sponsored noopener noreferrer"
          class="inline-flex items-center gap-1 px-3 py-1.5 text-sm bg-[#FF9900] text-black font-semibold rounded hover:bg-[#e88a00] transition-colors no-underline"
        >
          Amazon で見る
        </a>
      )}
      {rakutenUrl && (
        <a
          href={rakutenUrl}
          target="_blank"
          rel="nofollow sponsored noopener noreferrer"
          class="inline-flex items-center gap-1 px-3 py-1.5 text-sm bg-[#BF0000] text-white font-semibold rounded hover:bg-[#a00000] transition-colors no-underline"
        >
          楽天で見る
        </a>
      )}
    </div>
  </div>
</div>
```

> **Note:** `not-prose` クラスを付けることで prose スタイルのリセットが走り、カード内のボタンや画像が prose の影響を受けない。

**Step 2: ビルドが通ることを確認**

```bash
npm run build
```

Expected: エラーなし。

**Step 3: コミット**

```bash
git add src/components/AffiliateCard.astro
git commit -m "feat: AffiliateCard コンポーネントを追加"
```

---

### Task 4: AffiliateBanner.astro コンポーネントを作成する

記事フッター（Giscus の直前）に表示する共通バナー。

**Files:**
- Create: `src/components/AffiliateBanner.astro`

**Step 1: コンポーネントを作成**

```astro
---
// Amazon/楽天のアフィリエイトトップページ URL を props で受け取る
// 未指定時は素のトップページにフォールバック
interface Props {
  amazonUrl?: string;
  rakutenUrl?: string;
}
const {
  amazonUrl = 'https://www.amazon.co.jp/',
  rakutenUrl = 'https://www.rakuten.co.jp/',
} = Astro.props;
---

<div class="not-prose my-8 p-5 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-center">
  <p class="text-sm text-gray-500 dark:text-gray-400 mb-4 m-0">
    お買い物の際はこちらのリンクを使っていただけると励みになります
  </p>
  <div class="flex gap-3 justify-center flex-wrap">
    <a
      href={amazonUrl}
      target="_blank"
      rel="nofollow sponsored noopener noreferrer"
      class="inline-flex items-center gap-2 px-5 py-2 text-sm bg-[#FF9900] text-black font-semibold rounded-lg hover:bg-[#e88a00] transition-colors"
    >
      Amazon で探す
    </a>
    <a
      href={rakutenUrl}
      target="_blank"
      rel="nofollow sponsored noopener noreferrer"
      class="inline-flex items-center gap-2 px-5 py-2 text-sm bg-[#BF0000] text-white font-semibold rounded-lg hover:bg-[#a00000] transition-colors"
    >
      楽天市場で探す
    </a>
  </div>
  <p class="text-xs text-gray-400 dark:text-gray-500 mt-3 mb-0">
    ※ アフィリエイトリンクを含みます
  </p>
</div>
```

**Step 2: コミット**

```bash
git add src/components/AffiliateBanner.astro
git commit -m "feat: AffiliateBanner コンポーネントを追加"
```

---

### Task 5: BlogPost.astro に AffiliateBanner を組み込む

Giscus（コメント欄）の直前にバナーを挿入する。

**Files:**
- Modify: `src/layouts/BlogPost.astro:1-10`（import 追加）
- Modify: `src/layouts/BlogPost.astro:138-144`（バナー挿入）

**Step 1: import を追加（frontmatter 末尾に）**

既存の import 群に以下を追加：

```ts
import AffiliateBanner from '@/components/AffiliateBanner.astro';
```

**Step 2: `<slot />` の直後、Giscus の直前にバナーを挿入**

現在のコード（BlogPost.astro:138-143）:
```astro
<slot />

<div class="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
  <Giscus />
</div>
```

変更後:
```astro
<slot />

<AffiliateBanner />

<div class="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
  <Giscus />
</div>
```

> **Note:** AffiliateBanner の amazonUrl / rakutenUrl props は将来的にアフィリエイトタグ付き URL に差し替える。現時点では props 省略（デフォルト値が入る）のままで OK。

**Step 3: ビルドが通ることを確認**

```bash
npm run build
```

Expected: エラーなし。

**Step 4: コミット**

```bash
git add src/layouts/BlogPost.astro
git commit -m "feat: BlogPost レイアウトにAffiliateBannerを追加"
```

---

### Task 6: 最新週報を .md → .mdx に変換して AffiliateCard を埋め込む

デモとして 2026-02-16 の週報を MDX に変換し、「今週の買い物」に AffiliateCard を追加する。

**Files:**
- Rename: `src/content/blog/weekly/2026-02-16.md` → `src/content/blog/weekly/2026-02-16.mdx`
- Modify: `src/content/blog/weekly/2026-02-16.mdx`（AffiliateCard 追加）

**Step 1: ファイルをリネーム**

```bash
mv src/content/blog/weekly/2026-02-16.md src/content/blog/weekly/2026-02-16.mdx
```

**Step 2: ファイル先頭（frontmatter の直後）に import を追加**

```mdx
---
title: '[週報] 2026/02/16週'
...
---

import AffiliateCard from '@/components/AffiliateCard.astro';
```

**Step 3: 「今週の買い物」セクションの各商品説明の直後に AffiliateCard を追加**

FAT ボトムの項（満足度の直後）:
```mdx
**満足度：** ★5 とても満足

<AffiliateCard
  name="FAT ボトム"
  brand="FAT"
  amazonUrl="https://www.amazon.co.jp/s?k=FAT+ボトム&tag=YOUR_ASSOCIATE_TAG"
  rakutenUrl="https://search.rakuten.co.jp/search/mall/FAT+ボトム/"
/>
```

AURALEE ボトムの項:
```mdx
**満足度：** ★3 ふつう

<AffiliateCard
  name="AURALEE ボトム"
  brand="AURALEE"
  amazonUrl="https://www.amazon.co.jp/s?k=AURALEE+ボトム&tag=YOUR_ASSOCIATE_TAG"
  rakutenUrl="https://search.rakuten.co.jp/search/mall/AURALEE+ボトム/"
/>
```

> **Note:** URL の `YOUR_ASSOCIATE_TAG` は、実際のアソシエイトタグに差し替えること。現時点では検索リンクとして機能する。

**Step 4: ビルドが通ることを確認**

```bash
npm run build
```

Expected: エラーなし。2026-02-16 のページが正しく生成されること。

**Step 5: コミット**

```bash
git add src/content/blog/weekly/2026-02-16.mdx
git commit -m "feat: 2026-02-16週報にAffiliateCardを追加（MDX化）"
```

> ⚠️ `src/content/blog/weekly/2026-02-16.md`（旧ファイル）が残っている場合は削除すること:
> `git rm src/content/blog/weekly/2026-02-16.md`

---

### Task 7: 設計ドキュメントをコミットして PR を作成する

**Step 1: 設計ドキュメントをコミット**

```bash
git add docs/plans/2026-02-24-affiliate-cards.md
git commit -m "docs: アフィリエイトカード設計ドキュメントを追加"
```

**Step 2: ブランチを push**

```bash
git push -u origin feature/affiliate-cards
```

**Step 3: PR を作成**

```bash
gh pr create \
  --title "feat: Amazon/楽天アフィリエイトカードを追加" \
  --body "..."
```

PR 本文には以下を含める：
- 追加したコンポーネント（AffiliateCard, AffiliateBanner）の説明
- スクリーンショットがあると望ましい（なくても OK）
- `YOUR_ASSOCIATE_TAG` を実際のタグに差し替える旨のメモ

---

## 完了後の TODO（PR マージ後）

- Amazon アソシエイトプログラムに申請・承認後、`YOUR_ASSOCIATE_TAG` を実際のタグに差し替える
- AffiliateBanner の `amazonUrl` / `rakutenUrl` をアフィリエイトタグ付き URL に更新
- 今後の週報は `.mdx` で作成して AffiliateCard を活用する
- textlint の対象を `.mdx` にも拡張する（任意）
