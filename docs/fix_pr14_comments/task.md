# PR #14 レビュー指摘対応

## 指摘事項
- `<lastBuildDate>` を「生成時刻」から「最新記事の公開日時」に変更することを推奨。

## タスク
- [x] [EXECUTION] `src/pages/rss.xml.js` の修正
    - [x] `lastBuildDate` に `posts[0].data.pubDate` を使用するように変更
- [x] [VERIFICATION] 動作確認
    - [x] ビルド確認
    - [x] RSS出力確認
- [x] [VERIFICATION] コミットとプッシュ
