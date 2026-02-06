# PR #13 追加レビュー指摘修正実装計画

## Goal Description
PR #13 に対する追加のレビュー指摘（セキュリティ修正、標準準拠、コード品質向上）に対応する。

## User Review Required
- 特になし

## Proposed Changes
### src/pages
#### [MODIFY] [rss.xml.js](file:///Users/yokoyama/git/mm2-blog/src/pages/rss.xml.js)
- **CDATAの適切なエスケープ**: `description` 内の `]]>` を `]]]]><![CDATA[>` に置換して XML インジェクションを防ぐ。
- **標準要素の追加**:
    - `<lastBuildDate>`: 生成時の日時 ((new Date()).toUTCString())
    - `<language>`: `ja`
- **コードコメントの英語化**: 日本語のコメントを英語に翻訳する。
- **(Optional) 全文配信**: 可能であれば `content:encoded` に記事本文を含めるが、Markdown -> HTML 変換の複雑さを考慮し、今回は必須とはしない（まずはセキュリティ修正を優先）。
    - 調査: `post.body` をそのまま CDATA に入れるか検討。

## Verification Plan
### Automated Tests
- `npm run build` が成功すること。
- 生成された RSS に `<lastBuildDate>`, `<language>` が含まれていること。
- `description` 内に `]]>` を含むテストデータを作成し、正しくエスケープ（分割）されているか確認する。
