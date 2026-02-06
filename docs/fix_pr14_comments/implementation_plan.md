# PR #14 修正実装計画

## Goal Description
RSSフィードの効率化のため、`<lastBuildDate>` を「ビルド日時」から「コンテンツの最終更新日時（最新記事の日付）」に変更する。

## Proposed Changes
### src/pages
#### [MODIFY] [rss.xml.js](file:///Users/yokoyama/git/mm2-blog/src/pages/rss.xml.js)
- `posts` は既に日付順にソートされているため、`posts[0].data.pubDate` を取得して `lastBuildDate` に設定する。

## Verification Plan
### Automated Tests
- `npm run build` 確認。
- `rss.xml` を確認し、`lastBuildDate` が最新記事の `pubDate` と一致することを確認。
