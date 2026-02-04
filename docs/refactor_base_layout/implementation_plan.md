# BaseLayoutへのリファクタリング計画

## 目標
共通のHTML構造（`<html>`, `<head>`, `<body>`, `<Header>`, `<Footer>`）を `BaseLayout` コンポーネントに集約し、各ページでのコード重複を排除する。また、`lang` 属性の整合性（`ja` に統一）を確保する。

## 提案される変更

### 共通レイアウトの作成
#### [NEW] [`src/layouts/BaseLayout.astro`](file:///Users/yokoyama/git/mm2-blog/src/layouts/BaseLayout.astro)
- 共通のHTMLスケルトンを定義。
- `lang="ja"` を設定。
- Props: `title`, `description`.
- `Header` と `Footer` を内包。

### ページ・レイアウトの更新
以下のファイルで、個別のHTML宣言を削除し、`BaseLayout` を使用するように変更する。

#### [MODIFY] [`src/layouts/BlogPost.astro`](file:///Users/yokoyama/git/mm2-blog/src/layouts/BlogPost.astro)
- `BaseLayout` でラップする形に変更。

#### [MODIFY] [`src/pages/index.astro`](file:///Users/yokoyama/git/mm2-blog/src/pages/index.astro)
- `BaseLayout` を使用。

#### [MODIFY] [`src/pages/about.astro`](file:///Users/yokoyama/git/mm2-blog/src/pages/about.astro)
- `BaseLayout` を使用。

#### [MODIFY] [`src/pages/blog/index.astro`](file:///Users/yokoyama/git/mm2-blog/src/pages/blog/index.astro)
- `BaseLayout` を使用。

## 検証計画
- `npm run dev` でエラーがないことを確認。
- 各ページの表示が崩れていないか確認。
- HTMLソースを確認し、`lang="ja"` になっていることを確認。
