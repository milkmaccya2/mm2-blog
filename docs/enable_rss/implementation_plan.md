# RSSフィード復活の実装計画 (改訂版)

## Goal Description
`@astrojs/rss` が Astro v6 beta (Zod v4) と互換性がないため、手動で RSS XML を生成するように `src/pages/rss.xml.js` を書き換える。

## User Review Required
- `@astrojs/rss` を使用せず、独自の実装に切り替えます。

## Proposed Changes
### src/pages
#### [MODIFY] [rss.xml.js](file:///Users/yokoyama/git/mm2-blog/src/pages/rss.xml.js)
- `@astrojs/rss` のインポートを削除
- 手動で XML 文字列を生成するロジックを実装
- タイトル、説明、各記事のアイテム（タイトル、リンク、出版日、説明）を含める

## Verification Plan
### Automated Tests
- `npm run build` が成功することを確認。
- 生成された `dist/rss.xml` または `npm run dev` での `/rss.xml` レスポンスが正しい XML 形式であることを確認。
