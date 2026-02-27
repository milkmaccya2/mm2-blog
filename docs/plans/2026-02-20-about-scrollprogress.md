# Aboutページ更新 & スクロールプログレス全ページ対応 Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Aboutページの職歴タイトルをManagerからEngineerに変更し、スクロールプログレスバーを全ページに適用する。

**Architecture:** `ReadingProgress.astro`のJSをdocumentスクロールベースに変更し、`BaseLayout.astro`に移動して全ページ対応。`BlogPost.astro`から重複するimportを削除。

**Tech Stack:** Astro 6, TypeScript, Tailwind CSS 4, Playwright (E2E)

---

### Task 1: Aboutページのテキスト変更

**Files:**
- Modify: `src/pages/about.astro:23` (イントロ文)
- Modify: `src/pages/about.astro:62` (職歴セクションのh3タイトル)

**Step 1: イントロ文を変更**

`src/pages/about.astro` の23行目を変更する:

```diff
- 現在は国内インターネット関連企業にてFrontend Development Managerを務めています。<br
+ 現在は国内インターネット関連企業にてWeb系エンジニアとして勤務しています。<br
```

**Step 2: 職歴セクションのh3タイトルを変更**

`src/pages/about.astro` の62行目を変更する:

```diff
- <h3 class="text-xl font-semibold">Frontend Development Manager</h3>
+ <h3 class="text-xl font-semibold">Frontend Engineer</h3>
```

**Step 3: ビルドエラーがないか確認**

```bash
npm run lint
```

Expected: エラーなし

**Step 4: Commit**

```bash
git add src/pages/about.astro
git commit -m "fix: AboutページのManager→Engineer に変更"
```

---

### Task 2: ReadingProgressをドキュメントスクロールベースに更新

**Files:**
- Modify: `src/components/ReadingProgress.astro`

**Step 1: スクリプト部分を変更**

`src/components/ReadingProgress.astro` のscript内の `initReadingProgress` 関数を以下に置き換える:

```typescript
function initReadingProgress() {
  const bar = document.getElementById('reading-progress-bar');
  const container = document.getElementById('reading-progress');

  if (!bar || !container) return;

  let ticking = false;

  function updateProgress() {
    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = scrollHeight > 0
      ? Math.min((window.scrollY / scrollHeight) * 100, 100)
      : 0;

    bar!.style.width = `${progress}%`;
    container!.setAttribute('aria-valuenow', String(Math.round(progress)));
    ticking = false;
  }

  function onScroll() {
    if (!ticking) {
      requestAnimationFrame(updateProgress);
      ticking = true;
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  updateProgress();

  // Cleanup for View Transitions
  document.addEventListener('astro:before-swap', () => {
    window.removeEventListener('scroll', onScroll);
  }, { once: true });
}

// Init on page load (including View Transitions navigation)
document.addEventListener('astro:page-load', initReadingProgress);
```

**Step 2: lint確認**

```bash
npm run lint
```

Expected: エラーなし

**Step 3: Commit**

```bash
git add src/components/ReadingProgress.astro
git commit -m "refactor: ReadingProgressをドキュメントスクロールベースに変更"
```

---

### Task 3: ReadingProgressをBaseLayoutに移動

**Files:**
- Modify: `src/layouts/BaseLayout.astro` (ReadingProgressを追加)
- Modify: `src/layouts/BlogPost.astro` (ReadingProgressを削除)

**Step 1: BaseLayout.astroにReadingProgressを追加**

`src/layouts/BaseLayout.astro` の frontmatter (import部分) に追記:

```diff
  import ThemeScript from '@/components/ThemeScript.astro';
+ import ReadingProgress from '@/components/ReadingProgress.astro';
  import { SITE_DESCRIPTION, SITE_TITLE } from '@/consts';
```

`<body>` 直下に `<ReadingProgress />` を追加:

```diff
  <body>
+   <ReadingProgress />
    <Header />
    <Breadcrumb items={breadcrumbItems} siteOrigin={siteOrigin} />
```

**Step 2: BlogPost.astroからReadingProgressを削除**

`src/layouts/BlogPost.astro` から以下を削除:

```diff
- import ReadingProgress from '@/components/ReadingProgress.astro';
```

```diff
- <ReadingProgress />
  <main class="max-w-full! px-0! md:px-4!">
```

**Step 3: lint確認**

```bash
npm run lint
```

Expected: エラーなし

**Step 4: Commit**

```bash
git add src/layouts/BaseLayout.astro src/layouts/BlogPost.astro
git commit -m "feat: スクロールプログレスを全ページに適用"
```

---

### Task 4: E2Eテストで動作確認

**Files:**
- Test: `tests/e2e.spec.ts`

**Step 1: devサーバーを起動して確認 (オプション: 目視確認)**

```bash
npm run dev
```

ブラウザで以下のページを開き、スクロールプログレスバーが表示されることを確認:
- `http://localhost:4321/` (ホームページ)
- `http://localhost:4321/about/` (Aboutページ)
- `http://localhost:4321/blog/` (ブログ一覧)
- ブログ記事ページ

**Step 2: E2Eテスト実行**

```bash
npx playwright test tests/e2e.spec.ts
```

Expected: 全テストPASS

**Step 3: ビルド確認**

```bash
npm run build
```

Expected: ビルド成功、エラーなし
