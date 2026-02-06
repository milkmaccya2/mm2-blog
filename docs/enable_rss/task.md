# RSSフィードの復活

- [x] [PLANNING] 実装計画の作成
- [x] [EXECUTION] トピックブランチ `feature/enable-rss` の作成
- [x] [EXECUTION] `src/pages/rss.xml.js` の修正 (独自実装)
    - [x] `@astrojs/rss` の依存排除
    - [x] XML生成ロジックの実装
    - [x] `getCollection` でデータ取得
- [x] [VERIFICATION] 動作確認
    - [x] ローカル環境での `/rss.xml` 生成確認
    - [x] XMLのバリデーション（簡易確認）
- [x] [VERIFICATION] Walkthroughの作成とコミット
