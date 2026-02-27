# Privacy Policy & Terms Pages Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** プライバシーポリシーページ (`/privacy`) と利用規約ページ (`/terms`) を作成し、フッターにリンクを追加する。

**Architecture:** `about.astro` と同じパターンで静的 Astro ページを2枚作成。BaseLayout のパンくずラベル辞書に追記。Footer にテキストリンクを追加。

**Tech Stack:** Astro 6, Tailwind CSS 4, TypeScript

---

### Task 1: パンくず対応 — BaseLayout の SEGMENT_LABELS 更新

**Files:**
- Modify: `src/layouts/BaseLayout.astro:37-41`

**Step 1: `SEGMENT_LABELS` に `privacy` と `terms` を追加**

```typescript
const SEGMENT_LABELS: Record<string, string> = {
  blog: 'Blog',
  about: 'About',
  projects: 'Projects',
  privacy: 'プライバシーポリシー',
  terms: '利用規約',
};
```

**Step 2: dev サーバーで `/privacy` にアクセスし 404 でもパンくずが壊れていないことを確認**

（ページ未作成なので 404 が出るのは正常）

---

### Task 2: プライバシーポリシーページ作成

**Files:**
- Create: `src/pages/privacy.astro`

**Step 1: ファイルを作成する**

```astro
---
import { SITE_TITLE } from '@/consts';
import BaseLayout from '@/layouts/BaseLayout.astro';
---

<BaseLayout
  title={`プライバシーポリシー | ${SITE_TITLE}`}
  description="milkmaccya or something のプライバシーポリシーです。"
>
  <main class="max-w-4xl mx-auto px-4 py-8">
    <div class="space-y-10">
      <h1 class="text-4xl font-bold">プライバシーポリシー</h1>

      <section class="space-y-3">
        <h2 class="text-2xl font-bold border-b pb-2">個人情報の取得について</h2>
        <p class="text-gray-700 dark:text-gray-300 leading-relaxed">
          当サイトでは、アクセス解析ツールの利用に際し、Cookie を通じてアクセス情報（IPアドレス、ブラウザ種別、閲覧ページ等）を取得することがあります。
          取得した情報は、サイト改善の目的にのみ使用し、個人を特定する情報は収集しません。
        </p>
      </section>

      <section class="space-y-3">
        <h2 class="text-2xl font-bold border-b pb-2">アクセス解析ツールについて</h2>
        <p class="text-gray-700 dark:text-gray-300 leading-relaxed">
          当サイトでは、Google が提供する Google アナリティクスを利用しています。
          Google アナリティクスは Cookie を使用してデータを収集・分析します。
          Cookie を無効にすることでデータの収集を拒否することができます。詳細は
          <a
            href="https://policies.google.com/technologies/partner-sites"
            target="_blank"
            rel="noopener noreferrer"
            class="text-blue-600 dark:text-blue-400 hover:underline"
          >Google のポリシーと規約</a>
          をご確認ください。
        </p>
      </section>

      <section class="space-y-3">
        <h2 class="text-2xl font-bold border-b pb-2">アフィリエイトについて</h2>
        <p class="text-gray-700 dark:text-gray-300 leading-relaxed">
          当サイトは、Amazon.co.jp を宣伝しリンクすることによってサイトが紹介料を獲得できる手段を提供することを目的に設定されたアフィリエイトプログラムである、
          Amazonアソシエイト・プログラムの参加者です。
        </p>
        <p class="text-gray-700 dark:text-gray-300 leading-relaxed">
          また、楽天グループ株式会社が運営する楽天アフィリエイトプログラムにも参加しています。
          当サイト内の商品リンクには、アフィリエイトリンクが含まれる場合があります。
          リンクを経由して商品を購入された場合、当サイトに紹介料が支払われることがあります。
        </p>
      </section>

      <section class="space-y-3">
        <h2 class="text-2xl font-bold border-b pb-2">広告の配信について</h2>
        <p class="text-gray-700 dark:text-gray-300 leading-relaxed">
          当サイトは第三者配信の広告サービスを利用することがあります。これらの広告配信事業者は、
          ユーザーの興味に応じた広告を表示するために Cookie を使用することがあります。
          Cookie を無効にする設定はご利用のブラウザの設定から行うことができます。
        </p>
      </section>

      <section class="space-y-3">
        <h2 class="text-2xl font-bold border-b pb-2">お問い合わせ</h2>
        <p class="text-gray-700 dark:text-gray-300 leading-relaxed">
          プライバシーポリシーに関するお問い合わせは、
          <a
            href="mailto:milkmaccya@gmail.com"
            class="text-blue-600 dark:text-blue-400 hover:underline"
          >milkmaccya@gmail.com</a>
          までご連絡ください。
        </p>
      </section>

      <p class="text-sm text-gray-500 dark:text-gray-400">制定日：2026年2月25日</p>
    </div>
  </main>
</BaseLayout>
```

**Step 2: `npm run dev` で `/privacy` にアクセスし、ページが表示されることを確認**

---

### Task 3: 利用規約ページ作成

**Files:**
- Create: `src/pages/terms.astro`

**Step 1: ファイルを作成する**

```astro
---
import { SITE_TITLE } from '@/consts';
import BaseLayout from '@/layouts/BaseLayout.astro';
---

<BaseLayout
  title={`利用規約 | ${SITE_TITLE}`}
  description="milkmaccya or something の利用規約です。"
>
  <main class="max-w-4xl mx-auto px-4 py-8">
    <div class="space-y-10">
      <h1 class="text-4xl font-bold">利用規約</h1>

      <section class="space-y-3">
        <h2 class="text-2xl font-bold border-b pb-2">免責事項</h2>
        <p class="text-gray-700 dark:text-gray-300 leading-relaxed">
          当サイトのコンテンツ・情報については、できる限り正確な情報を提供するよう努めておりますが、
          正確性や安全性を保証するものではありません。
          当サイトの情報をもとに行動した結果、損害が生じた場合でも、当サイトは一切の責任を負いません。
        </p>
      </section>

      <section class="space-y-3">
        <h2 class="text-2xl font-bold border-b pb-2">著作権について</h2>
        <p class="text-gray-700 dark:text-gray-300 leading-relaxed">
          当サイトに掲載されている文章・画像・その他コンテンツの著作権は、特別な記載がない限り運営者（milkmaccya）に帰属します。
          無断転載・複製は禁止します。引用の場合は出典を明示してください。
        </p>
      </section>

      <section class="space-y-3">
        <h2 class="text-2xl font-bold border-b pb-2">リンクについて</h2>
        <p class="text-gray-700 dark:text-gray-300 leading-relaxed">
          当サイトからリンクしている外部サイトの内容について、当サイトは一切の責任を負いません。
          また、外部サイトの情報が変更・削除された場合もその責任を負いかねます。
        </p>
      </section>

      <section class="space-y-3">
        <h2 class="text-2xl font-bold border-b pb-2">規約の変更について</h2>
        <p class="text-gray-700 dark:text-gray-300 leading-relaxed">
          当サイトは、必要と判断した場合には事前の告知なく本規約を変更することがあります。
          変更後は当ページへの掲載をもって告知に代えさせていただきます。
        </p>
      </section>

      <p class="text-sm text-gray-500 dark:text-gray-400">制定日：2026年2月25日</p>
    </div>
  </main>
</BaseLayout>
```

**Step 2: `npm run dev` で `/terms` にアクセスし、ページが表示されることを確認**

---

### Task 4: フッターにリンク追加

**Files:**
- Modify: `src/components/Footer.astro`

**Step 1: フッターにプライバシーポリシー・利用規約リンクを追加**

現在のフッター（`src/components/Footer.astro`）:
```astro
<footer ...>
  &copy; {today.getFullYear()} milkmaccya. All rights reserved.
  <div class="flex justify-center gap-4 mt-4">
    <SocialLinks ... />
  </div>
</footer>
```

変更後:
```astro
<footer
  class="px-4 pt-8 pb-24 text-center text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800"
>
  &copy; {today.getFullYear()} milkmaccya. All rights reserved.
  <div class="flex justify-center gap-4 mt-4">
    <SocialLinks
      linkClass="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
    />
  </div>
  <div class="flex justify-center gap-4 mt-3 text-sm">
    <a
      href="/privacy"
      class="hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
    >プライバシーポリシー</a>
    <a
      href="/terms"
      class="hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
    >利用規約</a>
  </div>
</footer>
```

**Step 2: dev サーバーでフッターのリンクが表示され、クリックで各ページに遷移することを確認**

---

### Task 5: E2E テスト追加

**Files:**
- Modify: `tests/e2e.spec.ts`

**Step 1: `privacy` と `terms` のスモークテストを追加**

既存の `Smoke Tests` describe ブロック内に追加:

```typescript
test('privacy page', async ({ page }) => {
  await page.goto('/privacy')
  await verifyLayout(page)
  await expect(
    page.getByRole('heading', { level: 1, name: 'プライバシーポリシー' }),
  ).toBeVisible()
})

test('terms page', async ({ page }) => {
  await page.goto('/terms')
  await verifyLayout(page)
  await expect(
    page.getByRole('heading', { level: 1, name: '利用規約' }),
  ).toBeVisible()
})
```

**Step 2: テストを実行する**

```bash
npm run build && npx playwright test tests/e2e.spec.ts
```

Expected: 全テスト PASS

**Step 3: コミット**

```bash
git add src/pages/privacy.astro src/pages/terms.astro src/components/Footer.astro src/layouts/BaseLayout.astro tests/e2e.spec.ts
git commit -m "feat: プライバシーポリシー・利用規約ページを追加しフッターにリンクを追加"
```
