# RSSフィード修正漏れ対応

mergeされたmainブランチに含まれていなかった修正を再適用する。

- [x] [EXECUTION] `src/pages/rss.xml.js` の修正
    - [x] `description` の CDATA エスケープ処理追加 (`]]>` -> `]]]]><![CDATA[>`)
    - [x] `<lastBuildDate>` と `<language>` の追加
    - [x] コメントの英語化
- [x] [VERIFICATION] 動作確認
    - [x] CDATAエスケープの検証（テスト記事作成）
    - [x] XMLバリデーション（ビルド確認）
- [x] [VERIFICATION] PR作成
