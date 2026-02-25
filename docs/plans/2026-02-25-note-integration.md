# Note記事連携 実装計画

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** トップページにnote.comの記事セクションを追加し、アウトプットを一覧できるようにする。

**Architecture:** 静的データファイル（`src/data/notes.ts`）で記事情報を管理し、`NoteCard.astro` コンポーネントで表示する。トップページの Projects セクションと Recent Posts セクションの間に Note セクションを挿入する。

**Tech Stack:** Astro, TypeScript, Tailwind CSS 4

---

### Task 1: 静的データファイルの作成

**Files:**
- Create: `src/data/notes.ts`

**Step 1: ファイルを作成する**

```ts
// src/data/notes.ts
export interface NoteArticle {
  title: string;
  url: string;
  pubDate: Date;
  description?: string;
  isPaid: boolean;
}

export const NOTES: NoteArticle[] = [
  {
    title: '記事タイトルをここに入力',
    url: 'https://note.com/milkmaccya2/n/xxxxxxxx',
    pubDate: new Date('2026-xx-xx'),
    description: '記事の説明をここに入力',
    isPaid: true,
  },
];
```

※ `title`・`url`・`pubDate` は実際の記事情報に書き換えること。

**Step 2: lintを通す**

```bash
npm run lint
```

Expected: エラーなし

**Step 3: コミット**

```bash
git add src/data/notes.ts
git commit -m "feat: note記事の静的データファイルを追加"
```

---

### Task 2: NoteCard コンポーネントの作成

**Files:**
- Create: `src/components/NoteCard.astro`
- Reference: `src/components/ProjectCard.astro`（スタイルの参考）

**Step 1: コンポーネントを作成する**

```astro
---
// src/components/NoteCard.astro
import type { NoteArticle } from '@/data/notes';
import FormattedDate from '@/components/FormattedDate.astro';

interface Props {
  article: NoteArticle;
}

const { article } = Astro.props;
---

<div
  class="border-l-4 border-gray-200 dark:border-gray-700 pl-4 hover:border-black dark:hover:border-white transition"
>
  <div class="flex items-center gap-2 mb-1">
    <h2 class="text-xl font-bold">
      <a
        href={article.url}
        target="_blank"
        rel="noopener noreferrer"
        class="hover:underline"
      >
        {article.title}
      </a>
    </h2>
    {article.isPaid && (
      <span class="text-xs font-medium px-2 py-0.5 rounded bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300">
        有料
      </span>
    )}
  </div>
  <p class="text-sm text-gray-500 dark:text-gray-400 mb-2">
    <FormattedDate date={article.pubDate} />
  </p>
  {article.description && (
    <p class="text-gray-700 dark:text-gray-300 text-sm mb-3">{article.description}</p>
  )}
  <a
    href={article.url}
    target="_blank"
    rel="noopener noreferrer"
    class="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium text-sm inline-block"
  >
    noteで読む &rarr;
  </a>
</div>
```

**Step 2: lintを通す**

```bash
npm run lint
```

Expected: エラーなし

**Step 3: コミット**

```bash
git add src/components/NoteCard.astro
git commit -m "feat: NoteCardコンポーネントを追加"
```

---

### Task 3: トップページに Note セクションを追加

**Files:**
- Modify: `src/pages/index.astro`

**Step 1: import を追加する**

`src/pages/index.astro` の frontmatter（`---` 内）の import 群に以下を追加する：

```ts
import NoteCard from '@/components/NoteCard.astro';
import { NOTES } from '@/data/notes';
```

**Step 2: Note セクションを挿入する**

`index.astro` の Projectsセクション（`</section>` 終わり）の直後、Recent Postsセクションの直前に以下を挿入する：

```astro
<!-- Note Section -->
<section class="note-section mb-20">
  <div
    class="flex items-center justify-between mb-8 pb-4 border-b border-gray-100 dark:border-gray-800 opacity-0 section-header"
  >
    <h2 class="section-title text-2xl font-bold scramble-text" data-original-text="Note">Note</h2>
    <a
      href="https://note.com/milkmaccya2"
      target="_blank"
      rel="noopener noreferrer"
      class="text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 flex items-center gap-1 group"
    >
      View All
      <span class="transform group-hover:translate-x-1 transition-transform">&rarr;</span>
    </a>
  </div>

  <div class="grid md:grid-cols-2 gap-6">
    {
      NOTES.map((article) => (
        <div class="note-item opacity-0 transform translate-y-4 p-6 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-gray-100 dark:border-gray-800 hover:border-blue-100 dark:hover:border-blue-900 transition-colors">
          <NoteCard article={article} />
        </div>
      ))
    }
  </div>
</section>
```

※ `href="https://note.com/milkmaccya2"` のユーザー名部分は実際のnoteアカウント名に合わせること。

**Step 3: 開発サーバーで目視確認する**

```bash
npm run dev
```

ブラウザで `http://localhost:4321` を開き、以下を確認：
- Projects セクションの下に Note セクションが表示される
- 有料バッジが表示される
- 「noteで読む →」リンクが機能する（外部リンク）
- ダークモードでも崩れない

**Step 4: lintを通す**

```bash
npm run lint
```

Expected: エラーなし

**Step 5: コミット**

```bash
git add src/pages/index.astro
git commit -m "feat: トップページにNote記事セクションを追加"
```

---

### Task 4: E2E テストを更新する

**Files:**
- Modify: `tests/e2e.spec.ts`

**Step 1: ホームページのテストに Note セクションの確認を追加する**

`tests/e2e.spec.ts` の `homepage` テストに以下を追加する：

```ts
test('homepage', async ({ page }) => {
  await page.goto('/')
  await verifyLayout(page)
  await expect(
    page.getByRole('heading', { level: 1, name: "Milkmaccya's Log" }),
  ).toBeVisible()
  // Note セクションの見出しが表示されていること
  await expect(
    page.getByRole('heading', { level: 2, name: 'Note' }),
  ).toBeVisible()
})
```

**Step 2: テストを実行する**

```bash
npm test
```

Expected: 全テストがパスする

**Step 3: コミット**

```bash
git add tests/e2e.spec.ts
git commit -m "test: NoteセクションのE2Eスモークテストを追加"
```

---

### Task 5: ビルド確認 & PR 作成

**Step 1: プロダクションビルドを実行する**

```bash
npm run build
```

Expected: エラーなし

**Step 2: PR を作成する**

```bash
gh pr create --title "feat: トップページにNote記事セクションを追加" --body "$(cat <<'EOF'
## Summary

- `src/data/notes.ts` にnote記事の静的データ管理ファイルを追加
- `src/components/NoteCard.astro` にnote記事表示コンポーネントを追加
- トップページ（`index.astro`）のProjectsセクション下にNoteセクションを挿入
- E2EスモークテストにNoteセクションの表示確認を追加

## Test plan

- [ ] `npm run dev` でローカル確認（有料バッジ表示・外部リンク・ダークモード）
- [ ] `npm test` で全E2Eテストがパス
- [ ] `npm run build` でビルドエラーなし

🤖 Generated with [Claude Code](https://claude.com/claude-code)
EOF
)"
```
