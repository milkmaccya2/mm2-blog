# PR #13 レビュー指摘修正実装計画

## Goal Description
PR #13 で指摘された `src/pages/rss.xml.js` のセキュリティ問題（XMLインジェクション対策）と堅牢性の向上を行う。

## User Review Required
- 特になし

## Proposed Changes
### src/pages
#### [MODIFY] [rss.xml.js](file:///Users/yokoyama/git/mm2-blog/src/pages/rss.xml.js)
- **XMLエスケープ処理の追加**: `escapeXML` 関数を実装し、動的な値（タイトル、説明、記事内容など）に適用する。
- **URL構築の堅牢化**: 単純な文字列の結合 (`context.site + ...`) の代わりに `new URL(...)` を使用するか、スラッシュの重複/不足を防ぐロジックを入れる。
    - `context.site` は末尾スラッシュの有無が設定依存であるため、整合性を確保する。
- **CDATAの適切な使用**: エスケープと合わせて `CDATA` を適切に扱う。タイトルは通常エスケープ、`<content:encoded>` などは CDATA が一般的だが、ここでは `description` に `CDATA` を使っている。
    - `description` 内に `]]>` が含まれる場合のエスケープ処理も考慮（今回は簡易的な置換で対応）。

## Verification Plan
### Automated Tests
- `npm run build` でエラーが出ないこと。
- 生成された `dist/rss.xml` を確認し、特殊文字（`<`, `&` など）が正しくエスケープされているか確認する。
- バリデーター（オンラインツール等があれば）にかける、またはブラウザで正しく表示されるか確認する。
