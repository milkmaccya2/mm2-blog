# 変更内容の確認: Hero画像のalt属性設定

以下のファイルに対して変更を行い、Hero画像の `alt` 属性に記事タイトルを設定しました。

## 変更ファイル

### `src/layouts/BlogPost.astro`
- Hero画像の `alt` 属性に `title` プロパティを割り当てました。

### `src/pages/blog/index.astro`
- 記事一覧のサムネイル画像の `alt` 属性に `post.data.title` を割り当てました。

## 意図
- アクセシビリティの向上とSEO対策のため、意味のある `alt` テキストを設定しました。
