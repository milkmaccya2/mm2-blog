# ブログ一覧ページネーション 実装計画

## 目次
- [x] ~~**ステップ1: `src/consts.ts` へ定数追加**~~
- [x] ~~**ステップ2: `src/components/BlogPostList.astro` 作成（リファクタリング）**~~
- [x] ~~**ステップ3: `src/pages/blog/[page].astro` 作成**~~
- [x] ~~**ステップ4: `src/pages/blog/index.astro` 更新**~~

---

## 詳細

### ステップ1: `src/consts.ts` へ定数追加
*   **目的**: ページサイズのマジックナンバー排除。
*   **内容**: `BLOG_PAGE_SIZE = 10` を定義。

### ステップ2: `src/components/BlogPostList.astro` 作成（リファクタリング）
*   **目的**: 記事一覧表示ロジックの共通化とメンテナンス性向上。
*   **内容**:
    *   記事配列をPropsとして受け取る。
    *   既存のリストレンダリングロジックを移動。
    *   画像の `alt` 属性を `${post.data.title}のヒーロー画像` に変更（アクセシビリティ改善）。

### ステップ3: `src/pages/blog/[page].astro` 作成
*   **目的**: 2ページ目以降の動的ルート生成。
*   **内容**:
    *   `src/pages/blog/[page].astro` を新規作成。
    *   `getCollection('blog')` で全記事を取得し、日付順にソート。
    *   `paginate(posts, { pageSize: BLOG_PAGE_SIZE })` を使用。
    *   `BlogPostList` コンポーネントを使用し、ページごとの記事を表示。
    *   ナビゲーションリンク（前へ/次へ）を実装。

### ステップ4: `src/pages/blog/index.astro` 更新
*   **目的**: トップページ（1ページ目）の表示ロジック変更。
*   **内容**:
    *   全記事を取得・ソートし、最初の `BLOG_PAGE_SIZE` 件をスライス。
    *   `BlogPostList` コンポーネントを使用。
    *   「次のページ」ボタンのロジックを追加（ページ数計算）。
    *   1ページ目は URL が `/blog/` であるため、独自のページネーション実装が必要（`paginate` 関数は使用しないが、同じロジックで動作させる）。

---

## 備考
- `page.url.prev` / `page.url.next` は Astro の `paginate` 関数が自動生成する URL を使用する。
- 1ページ目の「次のページ」リンクは固定で `/blog/2/` とする（記事数が `BLOG_PAGE_SIZE` を超える場合）。
- Biome の `noUnusedImports` 警告については、Astro ファイル特有の挙動のため無視する（または設定で除外する）。
